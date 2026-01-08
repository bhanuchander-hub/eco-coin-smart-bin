const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all orders for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.userId })
      .sort({ created_at: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to load order' });
  }
});

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      pickup_address,
      latitude,
      longitude,
      estimated_weight,
      special_instructions,
      product_id,
      product_name,
      quantity,
      size,
      coins_spent
    } = req.body;

    const order = new Order({
      user_id: req.userId,
      pickup_address: pickup_address || '',
      latitude: latitude || null,
      longitude: longitude || null,
      estimated_weight: estimated_weight || 0,
      special_instructions: special_instructions || '',
      product_id: product_id || null,
      product_name: product_name || '',
      quantity: quantity || 1,
      size: size || '',
      coins_spent: coins_spent || 0
    });

    await order.save();

    // If coins were spent, deduct from user
    if (coins_spent > 0) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { coins: -coins_spent }
      });
    }

    res.status(201).json({ order, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      { status, updated_at: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Cancel order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId, status: 'pending' },
      { status: 'cancelled', updated_at: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }

    // Refund coins if applicable
    if (order.coins_spent > 0) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { coins: order.coins_spent }
      });
    }

    res.json({ order, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
