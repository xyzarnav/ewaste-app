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

    // Enhanced prompt with better structure and examples
    const prompt = `You are an expert e-waste device analyzer specializing in accurate device identification from serial numbers and model information.

DEVICE TO ANALYZE:
- Item Name: ${itemName || 'Not provided'}
- Serial Number/Model: ${serialNumber}

ANALYSIS REQUIREMENTS:
1. IDENTIFY the exact device model, manufacturer, and specifications
2. Use the serial number pattern to determine device details
3. For Lenovo devices, decode the serial format (e.g., 83D2001GIN = specific IdeaPad Pro 5 model)
4. ASSUME device is non-working/broken (e-waste recycling context)
5. Provide accurate market value estimates for non-working devices
6. Calculate realistic CO2 footprint based on device type and components

SERIAL NUMBER DECODING HELP:
- Lenovo format: First 2-3 chars = product line, middle chars = configuration, last chars = region
- Look for patterns that indicate specific models, RAM, storage, processor tiers
- Use model databases and specification sheets for accuracy

RETURN ONLY THIS JSON FORMAT (no markdown, no extra text):
{
  "itemName": "Full Official Product Name (e.g., Lenovo IdeaPad Pro 5 14IMH9)",
  "modelSerial": "${serialNumber}",
  "manufacturer": "Exact Brand Name",
  "deviceType": "laptop",
  "estimatedValue": realistic_resale_value_for_broken_device_in_USD,
  "co2Estimate": realistic_co2_footprint_in_kg,
  "stockType": "electronic",
  "condition": "non_working",
  "hazardLevel": "low",
  "priority": "medium",
  "recyclingNotes": "Detailed step-by-step recycling instructions specific to this device type including battery removal, component separation, data wiping, and certified e-waste disposal requirements.",
  "description": "Professional marketing description highlighting the device's original premium features, build quality, advanced components, and high recycling value. Emphasize sustainability and responsible e-waste processing while making it sound valuable and important."
}

CRITICAL INSTRUCTIONS:
- Use EXACT model names and specifications if identifiable from serial
- Provide realistic broken/non-working device values (typically 10-30% of new price)
- CO2 estimates should reflect actual device weight and materials
- Make recycling notes specific to the actual device type
- Description should be compelling but factual about recycling value
- NEVER use placeholder text - provide specific, researched information`;

    console.log('Calling Gemini API with enhanced prompt');

    // Use the more capable model for better accuracy
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent, factual responses
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Enhanced JSON parsing with better error handling
    let deviceInfo;
    try {
      // Clean the response text
      let cleanedText = text.trim();
      
      // Remove any markdown formatting
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Extract JSON object more reliably
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const jsonStr = cleanedText.substring(jsonStart, jsonEnd);
        deviceInfo = JSON.parse(jsonStr);
        console.log('Parsed device info:', deviceInfo);
       
        // Enhanced validation and fallback handling
        const enhancedDeviceInfo = {
          itemName: deviceInfo.itemName || `${itemName || 'Electronic Device'}`,
          modelSerial: deviceInfo.modelSerial || serialNumber,
          manufacturer: deviceInfo.manufacturer || extractManufacturerFromSerial(serialNumber) || 'Unknown',
          deviceType: validateDeviceType(deviceInfo.deviceType) || 'laptop',
          estimatedValue: validateNumeric(deviceInfo.estimatedValue, 0, 1000) || estimateValueFromSerial(serialNumber),
          co2Estimate: validateNumeric(deviceInfo.co2Estimate, 0, 50) || estimateC02FromDeviceType(deviceInfo.deviceType || 'laptop'),
          stockType: validateStockType(deviceInfo.stockType) || 'electronic',
          condition: 'non_working', // Always non-working as per requirement
          hazardLevel: validateHazardLevel(deviceInfo.hazardLevel) || 'low',
          priority: validatePriority(deviceInfo.priority) || 'medium',
          recyclingNotes: deviceInfo.recyclingNotes || generateDefaultRecyclingNotes(deviceInfo.deviceType || 'laptop'),
          description: deviceInfo.description || generateDefaultDescription(deviceInfo.itemName || itemName, serialNumber)
        };

        return res.json({
          success: true,
          data: enhancedDeviceInfo
        });

      } else {
        throw new Error('No valid JSON structure found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
     
      // Enhanced fallback with better device detection
      const detectedManufacturer = extractManufacturerFromSerial(serialNumber);
      const detectedDeviceType = detectDeviceTypeFromSerial(serialNumber);
      
      const fallbackDeviceInfo = {
        itemName: generateDeviceName(detectedManufacturer, detectedDeviceType, itemName),
        modelSerial: serialNumber,
        manufacturer: detectedManufacturer || 'Unknown',
        deviceType: detectedDeviceType || 'laptop',
        estimatedValue: estimateValueFromSerial(serialNumber),
        co2Estimate: estimateC02FromDeviceType(detectedDeviceType || 'laptop'),
        stockType: 'electronic',
        condition: 'non_working',
        hazardLevel: 'low',
        priority: 'medium',
        recyclingNotes: generateDefaultRecyclingNotes(detectedDeviceType || 'laptop'),
        description: generateDefaultDescription(itemName, serialNumber)
      };
     
      return res.status(200).json({
        success: true,
        data: fallbackDeviceInfo,
        warning: 'Used enhanced fallback data due to parsing error'
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

// Helper functions for better device detection and validation
function extractManufacturerFromSerial(serial) {
  const upperSerial = serial.toUpperCase();
  
  // Common manufacturer patterns
  if (upperSerial.includes('LENOVO') || /^[0-9]{2}[A-Z]{2}/.test(upperSerial)) return 'Lenovo';
  if (upperSerial.includes('DELL') || upperSerial.startsWith('DLL')) return 'Dell';
  if (upperSerial.includes('HP') || upperSerial.startsWith('HP')) return 'HP';
  if (upperSerial.includes('ASUS')) return 'ASUS';
  if (upperSerial.includes('ACER')) return 'Acer';
  if (upperSerial.includes('MSI')) return 'MSI';
  if (upperSerial.includes('APPLE') || /^[A-Z0-9]{10}$/.test(upperSerial)) return 'Apple';
  
  return null;
}

function detectDeviceTypeFromSerial(serial) {
  const upperSerial = serial.toUpperCase();
  
  // Lenovo patterns
  if (/^8[0-9][A-Z][0-9]/.test(upperSerial)) return 'laptop';
  if (upperSerial.includes('IDEAPAD') || upperSerial.includes('THINKPAD')) return 'laptop';
  if (upperSerial.includes('DESKTOP') || upperSerial.includes('TOWER')) return 'desktop';
  if (upperSerial.includes('MONITOR') || upperSerial.includes('DISPLAY')) return 'monitor';
  
  return 'laptop'; // Default assumption
}

function estimateValueFromSerial(serial) {
  const deviceType = detectDeviceTypeFromSerial(serial);
  const manufacturer = extractManufacturerFromSerial(serial);
  
  // Base values for non-working devices (typically 10-30% of new price)
  const baseValues = {
    'laptop': 150,
    'desktop': 100,
    'monitor': 75,
    'tablet': 50,
    'phone': 30,
    'printer': 25
  };
  
  let baseValue = baseValues[deviceType] || 50;
  
  // Adjust for manufacturer premium
  if (['Apple', 'Lenovo', 'Dell'].includes(manufacturer)) {
    baseValue *= 1.5;
  }
  
  return Math.round(baseValue);
}

function estimateC02FromDeviceType(deviceType) {
  const co2Values = {
    'laptop': 2.5,
    'desktop': 4.0,
    'monitor': 3.0,
    'tablet': 1.5,
    'phone': 0.8,
    'printer': 2.0,
    'server': 8.0
  };
  
  return co2Values[deviceType] || 2.5;
}

function generateDeviceName(manufacturer, deviceType, originalName) {
  if (originalName && originalName.toLowerCase() !== 'lenovo') {
    return originalName;
  }
  
  const deviceNames = {
    'Lenovo': {
      'laptop': 'Lenovo IdeaPad Pro Series',
      'desktop': 'Lenovo ThinkCentre',
      'monitor': 'Lenovo ThinkVision'
    }
  };
  
  return deviceNames[manufacturer]?.[deviceType] || `${manufacturer} ${deviceType}`;
}

function generateDefaultRecyclingNotes(deviceType) {
  const recyclingInstructions = {
    'laptop': '1. Remove the battery carefully and dispose according to local regulations. 2. Separate components: casing, motherboard, RAM, hard drive, screen. 3. Wipe all storage devices for data security. 4. Package components properly to prevent damage. 5. Use certified e-waste recycler for responsible processing.',
    'desktop': '1. Disconnect all cables and remove components safely. 2. Remove hard drives and ensure data wiping. 3. Separate metal casing, motherboard, RAM, and other components. 4. Handle power supply with care. 5. Recycle through certified e-waste facility.',
    'monitor': '1. Handle screen carefully to avoid breakage. 2. Remove stand and cables. 3. Separate plastic casing from LCD/LED panel. 4. Dispose of backlight components properly. 5. Recycle through certified electronics recycler.'
  };
  
  return recyclingInstructions[deviceType] || recyclingInstructions['laptop'];
}

function generateDefaultDescription(itemName, serial) {
  return `Unlock the potential of this ${itemName || 'premium electronic device'}! While currently non-functional, this device offers valuable recyclable components. Its high-quality build and advanced features, once powering digital productivity, now provide excellent recycling value. Advanced components like processors, RAM, and storage drives are in high demand for responsible recycling and refurbishment. Let's responsibly reclaim these valuable resources and minimize e-waste environmental impact through proper recycling.`;
}

// Validation helper functions
function validateDeviceType(type) {
  const valid = ['laptop', 'desktop', 'monitor', 'printer', 'server', 'mobile', 'tablet', 'phone'];
  return valid.includes(type) ? type : null;
}

function validateStockType(type) {
  const valid = ['electronic', 'it', 'battery', 'medical', 'telecom', 'industrial'];
  return valid.includes(type) ? type : null;
}

function validateHazardLevel(level) {
  const valid = ['none', 'low', 'medium', 'high'];
  return valid.includes(level) ? level : null;
}

function validatePriority(priority) {
  const valid = ['low', 'medium', 'high'];
  return valid.includes(priority) ? priority : null;
}

function validateNumeric(value, min = 0, max = Infinity) {
  const num = Number(value);
  return (!isNaN(num) && num >= min && num <= max) ? num : null;
}

module.exports = router;