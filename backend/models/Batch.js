const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  modelSerial: {
    type: String,
    trim: true,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  condition: {
    type: String,
    required: true,
    enum: ['working', 'non_working', 'broken', 'damaged']
  },
  stockType: {
    type: String,
    required: true,
    enum: ['electronic', 'it', 'battery', 'medical', 'telecom', 'industrial']
  },
  estimatedValue: {
    type: Number,
    min: 0,
    default: 0
  },
  co2Estimate: {
    type: Number,
    min: 0,
    default: 0
  },
  greenhouseGasInfo: {
    type: String,
    trim: true,
    default: ''
  },
  hazardLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    default: 'none'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  recyclingNotes: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const BatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  batchName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  requestDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  items: [ItemSchema],
  
  // Tracking fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Pickup scheduling
  scheduledPickupDate: {
    type: Date
  },
  actualPickupDate: {
    type: Date
  },
  
  // Environmental tracking
  totalEstimatedValue: {
    type: Number,
    default: 0
  },
  totalCO2Impact: {
    type: Number,
    default: 0
  },
  
  // Processing dates
  processedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
BatchSchema.index({ batchId: 1 });
BatchSchema.index({ status: 1 });
BatchSchema.index({ createdBy: 1 });
BatchSchema.index({ requestDate: 1 });
BatchSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate totals
BatchSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalEstimatedValue = this.items.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
    this.totalCO2Impact = this.items.reduce((sum, item) => sum + (item.co2Estimate || 0), 0);
  }
  next();
});

// Virtual for item count
BatchSchema.virtual('itemCount').get(function() {
  return this.items ? this.items.length : 0;
});

// Virtual for total quantity
BatchSchema.virtual('totalQuantity').get(function() {
  return this.items ? this.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
});

// Ensure virtuals are included in JSON output
BatchSchema.set('toJSON', { virtuals: true });
BatchSchema.set('toObject', { virtuals: true });

// Static methods
BatchSchema.statics.generateBatchId = function(batchName, location, date) {
  // Get batch name initials (first letter of each word, max 3 letters)
  const batchInitials = batchName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3);
  
  // Get location abbreviation (first letter of each word, max 4 characters)
  const locationAbbr = location
    .split(/[\s,.-]+/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 4);
  
  // Format date as MMDDYYYY
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formattedDate = `${month}${day}${year}`;
  
  // Generate sequence number (will be replaced with actual counter in implementation)
  const sequence = Math.floor(Math.random() * 999) + 1;
  
  return `${batchInitials}-${sequence}-${locationAbbr}-${formattedDate}`;
};

// Instance methods
BatchSchema.methods.addItem = function(itemData, userId) {
  this.items.push({
    ...itemData,
    addedBy: userId,
    addedAt: new Date()
  });
  
  // Update status to in_progress if it was pending
  if (this.status === 'pending') {
    this.status = 'in_progress';
  }
  
  return this.save();
};

BatchSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  
  if (newStatus === 'completed') {
    this.completedAt = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Batch', BatchSchema);

