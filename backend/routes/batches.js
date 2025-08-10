const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const auth = authMiddleware.auth;
const { body, validationResult } = require('express-validator');

// @route   GET /api/batches
// @desc    Get all batches (admin) or user's batches (partner)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Partners can only see their own batches
    if (req.user.role === 'partner') {
      query.createdBy = req.user._id;
    }
    
    // Optional filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { batchId: searchRegex },
        { batchName: searchRegex },
        { contactPerson: searchRegex },
        { pickupLocation: searchRegex }
      ];
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const batches = await Batch.find(query)
      .populate('createdBy', 'firstName lastName email organizationName')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Batch.countDocuments(query);
    
    res.json({
      success: true,
      data: batches,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching batches'
    });
  }
});

// @route   GET /api/batches/:id
// @desc    Get single batch by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email organizationName')
      .populate('assignedTo', 'firstName lastName email')
      .populate('items.addedBy', 'firstName lastName email');
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Partners can only see their own batches
    if (req.user.role === 'partner' && batch.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching batch'
    });
  }
});

// @route   POST /api/batches
// @desc    Create new batch (partners only)
// @access  Private (Partner)
router.post('/', [
  auth,
  body('batchName').trim().isLength({ min: 1 }).withMessage('Batch name is required'),
  body('contactPerson').trim().isLength({ min: 1 }).withMessage('Contact person is required'),
  body('pickupLocation').trim().isLength({ min: 1 }).withMessage('Pickup location is required'),
  body('requestDate').isISO8601().withMessage('Valid request date is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    // Only partners can create batches
    if (req.user.role !== 'partner') {
      return res.status(403).json({
        success: false,
        message: 'Only service partners can create batch requests'
      });
    }
    
    const { batchName, contactPerson, pickupLocation, department, requestDate, notes } = req.body;
    
    // Generate unique batch ID
    const batchId = await generateUniqueBatchId(batchName, pickupLocation, requestDate);
    
    const batch = new Batch({
      batchId,
      batchName,
      contactPerson,
      pickupLocation,
      department: department || '',
      requestDate: new Date(requestDate),
      notes: notes || '',
      createdBy: req.user._id,
      status: 'pending'
    });
    
    await batch.save();
    
    // Populate the created batch
    await batch.populate('createdBy', 'firstName lastName email organizationName');
    
    res.status(201).json({
      success: true,
      message: 'Batch request created successfully',
      data: batch
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating batch'
    });
  }
});

// @route   PUT /api/batches/:id/status
// @desc    Update batch status (admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    // Only admins can update status
    if (!req.user.hasPermission('manage_batches')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    await batch.updateStatus(req.body.status, req.user._id);
    
    res.json({
      success: true,
      message: 'Batch status updated successfully',
      data: batch
    });
  } catch (error) {
    console.error('Error updating batch status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating batch status'
    });
  }
});

// @route   POST /api/batches/:id/items
// @desc    Add items to batch (admin only)
// @access  Private (Admin)
router.post('/:id/items', [
  auth,
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.itemName').trim().isLength({ min: 1 }).withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.condition').isIn(['working', 'non_working', 'broken', 'damaged']).withMessage('Invalid condition'),
  body('items.*.stockType').isIn(['electronic', 'it', 'battery', 'medical', 'telecom', 'industrial']).withMessage('Invalid stock type'),
  body('items.*.priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    // Only admins can add items
    if (!req.user.hasPermission('manage_items')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Add each item to the batch
    for (const itemData of req.body.items) {
      await batch.addItem(itemData, req.user._id);
    }
    
    // Populate the updated batch
    await batch.populate('createdBy', 'firstName lastName email organizationName');
    await batch.populate('items.addedBy', 'firstName lastName email');
    
    res.json({
      success: true,
      message: `${req.body.items.length} items added to batch successfully`,
      data: batch
    });
  } catch (error) {
    console.error('Error adding items to batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding items to batch'
    });
  }
});

// @route   DELETE /api/batches/:id
// @desc    Delete batch (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only super admins can delete batches
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    await batch.deleteOne();
    
    res.json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting batch'
    });
  }
});

// Helper function to generate unique batch ID
async function generateUniqueBatchId(batchName, location, date) {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const batchId = Batch.generateBatchId(batchName, location, date);
    
    // Check if batch ID already exists
    const existingBatch = await Batch.findOne({ batchId });
    
    if (!existingBatch) {
      return batchId;
    }
    
    attempts++;
  }
  
  // If all attempts failed, use timestamp as fallback
  const timestamp = Date.now();
  const batchInitials = batchName.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 3);
  return `${batchInitials}-${timestamp}`;
}

module.exports = router;

