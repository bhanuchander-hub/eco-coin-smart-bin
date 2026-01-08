const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ profile: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { full_name, phone, address, username, profile_image_url, bio, email } = req.body;

    const updateData = {
      updated_at: new Date()
    };

    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (username !== undefined) updateData.username = username;
    if (profile_image_url !== undefined) updateData.profile_image_url = profile_image_url;
    if (bio !== undefined) updateData.bio = bio;
    if (email !== undefined) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile: user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update user stats (coins, recycled weight, eco points)
router.put('/stats', authMiddleware, async (req, res) => {
  try {
    const { coins, recycled_weight, eco_points } = req.body;

    const updateData = { updated_at: new Date() };

    if (coins !== undefined) updateData.coins = coins;
    if (recycled_weight !== undefined) updateData.recycled_weight = recycled_weight;
    if (eco_points !== undefined) updateData.eco_points = eco_points;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile: user, message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// Upload profile image (stores URL only)
router.post('/image', authMiddleware, async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profile_image_url: image_url, updated_at: new Date() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile: user, message: 'Profile image updated successfully' });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({ error: 'Failed to update profile image' });
  }
});

module.exports = router;
