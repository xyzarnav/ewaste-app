const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['partner', 'admin', 'super_admin'],
    default: 'partner'
  },
  
  // Partner-specific fields
  organizationName: {
    type: String,
    trim: true
  },
  organizationType: {
    type: String,
    enum: ['hospital', 'college', 'university', 'corporate', 'government', 'nonprofit', 'other'],
    default: 'other'
  },
  department: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Admin-specific fields
  permissions: [{
    type: String,
    enum: [
      'manage_batches',
      'manage_users',
      'view_reports',
      'manage_items',
      'schedule_pickups',
      'system_admin'
    ]
  }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Login tracking
  lastLoginAt: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Password reset
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  
  // Email verification
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ organizationName: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
UserSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.emailVerificationToken;
    return ret;
  }
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return this.save();
};

UserSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  if (this.role === 'admin') {
    return this.permissions.includes(permission) || this.permissions.includes('system_admin');
  }
  return false;
};

UserSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return token;
};

UserSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Static methods
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

UserSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

module.exports = mongoose.model('User', UserSchema);

