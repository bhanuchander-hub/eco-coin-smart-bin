const express = require('express');
const Product = require('../models/Product');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;

    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Get single product
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Seed products (run once to populate database)
router.post('/seed', async (req, res) => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return res.json({ message: 'Products already seeded', count: existingCount });
    }

    const mockProducts = [
      {
        name: "Recycled Plastic Phone Case",
        description: "Durable phone case made from 100% recycled ocean plastic",
        category: "Mobile Accessories",
        price_coins: 150,
        price_inr: 499,
        image_url: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=300&fit=crop",
        stock: 50,
        rating: 4.5,
        reviews: 128
      },
      {
        name: "Eco-Friendly Water Bottle",
        description: "Stainless steel bottle with recycled plastic cap",
        category: "Lifestyle",
        price_coins: 200,
        price_inr: 699,
        image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
        stock: 75,
        rating: 4.8,
        reviews: 256
      },
      {
        name: "Recycled Tote Bag",
        description: "Fashionable tote bag made from recycled PET bottles",
        category: "Fashion",
        price_coins: 120,
        price_inr: 399,
        image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop",
        stock: 100,
        rating: 4.6,
        reviews: 89
      },
      {
        name: "Solar Power Bank",
        description: "Portable charger with recycled plastic casing",
        category: "Electronics",
        price_coins: 350,
        price_inr: 1299,
        image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
        stock: 30,
        rating: 4.4,
        reviews: 67
      },
      {
        name: "Bamboo Cutlery Set",
        description: "Reusable cutlery set with recycled plastic case",
        category: "Kitchen",
        price_coins: 80,
        price_inr: 299,
        image_url: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4b?w=400&h=300&fit=crop",
        stock: 150,
        rating: 4.7,
        reviews: 203
      },
      {
        name: "Recycled Notebook",
        description: "A5 notebook made from 100% recycled paper",
        category: "Stationery",
        price_coins: 50,
        price_inr: 149,
        image_url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
        stock: 200,
        rating: 4.5,
        reviews: 312
      },
      {
        name: "Eco Plant Pot",
        description: "Decorative pot made from recycled ocean plastic",
        category: "Home & Garden",
        price_coins: 100,
        price_inr: 349,
        image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
        stock: 80,
        rating: 4.3,
        reviews: 45
      },
      {
        name: "Wireless Earbuds Case",
        description: "Protective case made from recycled materials",
        category: "Tech Accessories",
        price_coins: 90,
        price_inr: 299,
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
        stock: 60,
        rating: 4.4,
        reviews: 78
      }
    ];

    await Product.insertMany(mockProducts);

    res.status(201).json({ 
      message: 'Products seeded successfully', 
      count: mockProducts.length 
    });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

module.exports = router;
