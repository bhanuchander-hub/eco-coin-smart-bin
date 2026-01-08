const mongoose = require('mongoose');

const wasteUploadSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  image_url: {
    type: String,
    required: true
  },
  image_path: {
    type: String,
    default: ''
  },
  gemini_analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  waste_type: {
    type: String,
    default: ''
  },
  classification: {
    type: String,
    default: ''
  },
  weight_grams: {
    type: Number,
    default: 0
  },
  pickup_location_lat: {
    type: Number,
    default: null
  },
  pickup_location_lng: {
    type: Number,
    default: null
  },
  pickup_address: {
    type: String,
    default: ''
  },
  coins_earned: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
wasteUploadSchema.index({ pickup_location_lat: 1, pickup_location_lng: 1 });

module.exports = mongoose.model('WasteUpload', wasteUploadSchema);
