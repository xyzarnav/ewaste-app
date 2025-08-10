const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', auth, async (req, res) => {
  try {
    const { itemName, serialNumber } = req.body;
    
    console.log('Auto-complete request:', { itemName, serialNumber });
    
    // Make serial number compulsory
    if (!serialNumber || serialNumber.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Serial number is required'
      });
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured'
      });
    }

    // Create a more specific and detailed prompt
    const prompt = `You are an expert in e-waste device identification and recycling. 

Given this device information:
- Item Name: ${itemName || 'Not provided'}
- Serial Number: ${serialNumber}

ASSUME this device is non-working, broken, or damaged unless explicitly stated otherwise. This is for e-waste recycling purposes.

Please analyze this device and provide SPECIFIC, ACCURATE information. If you cannot determine exact details from the serial number, make EDUCATED GUESSES based on common patterns and provide realistic estimates.

Return ONLY a JSON object in this exact format (no additional text):
{
  "deviceInfo": {
    "itemName": "specific model name if identifiable, otherwise best guess",
    "modelSerial": "${serialNumber}",
    "manufacturer": "exact brand name",
    "deviceType": "laptop/desktop/monitor/printer/server/mobile/tablet/phone",
    "estimatedValue": realistic_dollar_amount_based_on_device_type_and_age,
    "co2Estimate": realistic_co2_impact_in_kg_based_on_device_type,
    "stockType": "electronic/it/battery/medical/telecom/industrial",
    "condition": "non_working/broken/damaged",
    "hazardLevel": "none/low/medium/high",
    "priority": "low/medium/high",
    "recyclingNotes": "specific, actionable recycling instructions for this device type",
    "description": "compelling advertisement-style description highlighting the device's features, specifications, and potential value for recycling. Make it sound attractive and professional, focusing on what makes this device special and valuable for e-waste processing."
  }
}

IMPORTANT GUIDELINES:
- Use serial number patterns to identify manufacturer and device type
- Provide realistic market values based on device type and age
- Give specific CO2 estimates based on device weight and materials
- Include detailed recycling instructions for the specific device type
- If exact model unknown, provide best estimate based on serial pattern
- Be specific and avoid vague terms like "unknown" or "undefined"
- Write the description in an engaging, advertisement-style format that highlights the device's features and recycling value`;

    console.log('Calling Gemini API with prompt:', prompt);

    // Use cheaper model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Parse JSON response
    let deviceInfo;
    try {
      // Extract JSON from response (in case Gemini adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        deviceInfo = JSON.parse(jsonMatch[0]);
        console.log('Parsed device info:', deviceInfo);
        
        // Validate and enhance the response
        const enhancedDeviceInfo = {
          itemName: deviceInfo.deviceInfo?.itemName || itemName || 'Electronic Device',
          modelSerial: deviceInfo.deviceInfo?.modelSerial || serialNumber,
          manufacturer: deviceInfo.deviceInfo?.manufacturer || 'Unknown Manufacturer',
          deviceType: deviceInfo.deviceInfo?.deviceType || 'electronic',
          estimatedValue: deviceInfo.deviceInfo?.estimatedValue || 0,
          co2Estimate: deviceInfo.deviceInfo?.co2Estimate || 0,
          stockType: deviceInfo.deviceInfo?.stockType || 'electronic',
          condition: deviceInfo.deviceInfo?.condition || 'working',
          hazardLevel: deviceInfo.deviceInfo?.hazardLevel || 'none',
          priority: deviceInfo.deviceInfo?.priority || 'medium',
          recyclingNotes: deviceInfo.deviceInfo?.recyclingNotes || 'Standard e-waste disposal procedures apply.',
          description: deviceInfo.deviceInfo?.description || `Device with serial number: ${serialNumber}`
        };

        // Ensure numeric values are numbers
        enhancedDeviceInfo.estimatedValue = Number(enhancedDeviceInfo.estimatedValue) || 0;
        enhancedDeviceInfo.co2Estimate = Number(enhancedDeviceInfo.co2Estimate) || 0;

        // Validate device type
        const validDeviceTypes = ['laptop', 'desktop', 'monitor', 'printer', 'server', 'mobile', 'tablet', 'phone'];
        if (!validDeviceTypes.includes(enhancedDeviceInfo.deviceType)) {
          enhancedDeviceInfo.deviceType = 'electronic';
        }

        // Validate stock type
        const validStockTypes = ['electronic', 'it', 'battery', 'medical', 'telecom', 'industrial'];
        if (!validStockTypes.includes(enhancedDeviceInfo.stockType)) {
          enhancedDeviceInfo.stockType = 'electronic';
        }

        // Validate condition
        const validConditions = ['working', 'non_working', 'broken', 'damaged'];
        if (!validConditions.includes(enhancedDeviceInfo.condition)) {
          enhancedDeviceInfo.condition = 'non_working';
        }

        // Validate hazard level
        const validHazardLevels = ['none', 'low', 'medium', 'high'];
        if (!validHazardLevels.includes(enhancedDeviceInfo.hazardLevel)) {
          enhancedDeviceInfo.hazardLevel = 'none';
        }

        // Validate priority
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(enhancedDeviceInfo.priority)) {
          enhancedDeviceInfo.priority = 'medium';
        }

        return res.json({
          success: true,
          data: enhancedDeviceInfo
        });

      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      
      // Fallback to basic device info if parsing fails
      const fallbackDeviceInfo = {
        itemName: itemName || 'Electronic Device',
        modelSerial: serialNumber,
        manufacturer: 'Unknown Manufacturer',
        deviceType: 'electronic',
        estimatedValue: 0,
        co2Estimate: 0,
        stockType: 'electronic',
        condition: 'non_working',
        hazardLevel: 'none',
        priority: 'medium',
        recyclingNotes: 'Standard e-waste disposal procedures apply.',
        description: `Premium electronic device with serial number: ${serialNumber} - perfect for responsible e-waste recycling and sustainable disposal.`
      };
      
      return res.status(200).json({
        success: true,
        data: fallbackDeviceInfo,
        warning: 'Used fallback data due to parsing error'
      });
    }

  } catch (error) {
    console.error('Auto-complete error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's a rate limit error
    if (error.message.includes('429') || error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded. Please try again later.',
        error: 'Rate limit exceeded'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during auto-complete',
      error: error.message
    });
  }
});

module.exports = router;
