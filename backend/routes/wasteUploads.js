const express = require('express');
const WasteUpload = require('../models/WasteUpload');
const User = require('../models/User');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all waste uploads for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const uploads = await WasteUpload.find({ user_id: req.userId })
      .sort({ created_at: -1 });

    res.json({ uploads });
  } catch (error) {
    console.error('Get waste uploads error:', error);
    res.status(500).json({ error: 'Failed to load waste uploads' });
  }
});

// Create new waste upload
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      image_url,
      image_path,
      gemini_analysis,
      waste_type,
      classification,
      weight_grams,
      pickup_location_lat,
      pickup_location_lng,
      pickup_address
    } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Calculate coins earned based on weight and waste type
    let coinsEarned = 0;
    if (weight_grams > 0) {
      const baseCoins = Math.floor(weight_grams / 100); // 1 coin per 100g
      const multiplier = waste_type?.toLowerCase().includes('plastic') ? 1.5 : 1;
      coinsEarned = Math.floor(baseCoins * multiplier);
    } else {
      coinsEarned = Math.floor(Math.random() * 50) + 10; // Random 10-60 coins
    }

    const upload = new WasteUpload({
      user_id: req.userId || null,
      image_url,
      image_path: image_path || '',
      gemini_analysis: gemini_analysis || {},
      waste_type: waste_type || '',
      classification: classification || '',
      weight_grams: weight_grams || 0,
      pickup_location_lat: pickup_location_lat || null,
      pickup_location_lng: pickup_location_lng || null,
      pickup_address: pickup_address || '',
      coins_earned: coinsEarned
    });

    await upload.save();

    // Update user coins if authenticated
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { 
          coins: coinsEarned,
          recycled_weight: (weight_grams || 0) / 1000,
          eco_points: Math.floor(coinsEarned * 1.2)
        }
      });
    }

    res.status(201).json({ 
      upload, 
      coins_earned: coinsEarned,
      message: 'Waste upload recorded successfully' 
    });
  } catch (error) {
    console.error('Create waste upload error:', error);
    res.status(500).json({ error: 'Failed to record waste upload' });
  }
});

// Get waste upload statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const uploads = await WasteUpload.find({ user_id: req.userId });
    
    const stats = {
      total_uploads: uploads.length,
      total_weight: uploads.reduce((sum, u) => sum + (u.weight_grams || 0), 0),
      total_coins_earned: uploads.reduce((sum, u) => sum + (u.coins_earned || 0), 0),
      waste_types: {}
    };

    uploads.forEach(upload => {
      const type = upload.waste_type || 'Unknown';
      stats.waste_types[type] = (stats.waste_types[type] || 0) + 1;
    });

    res.json({ stats });
  } catch (error) {
    console.error('Get waste stats error:', error);
    res.status(500).json({ error: 'Failed to load statistics' });
  }
});

module.exports = router;
