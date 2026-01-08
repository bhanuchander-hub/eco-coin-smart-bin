const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickup_address: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  estimated_weight: {
    type: Number,
    default: 0
  },
  special_instructions: {
    type: String,
    default: ''
  },
  // E-commerce order fields
  product_id: {
    type: String,
    default: null
  },
  product_name: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 1
  },
  size: {
    type: String,
    default: ''
  },
  coins_spent: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries if needed
orderSchema.index({ latitude: 1, longitude: 1 });

// Update timestamp on save
orderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
