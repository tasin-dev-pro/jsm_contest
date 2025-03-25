import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Food from '../models/Food.js';
import Order from '../models/OrderSchema.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create admin account (protected by secret key)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, adminSecretKey } = req.body;
    
    // Verify admin secret key
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const newFood = new Food({
      name,
      description,
      price,
      category,
      image
    });
    await newFood.save();
    res.status(201).json({ message: 'Product added successfully', food: newFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const products = await Food.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending orders
router.get('/orders/pending', verifyAdmin, async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('items.productId');
    res.json(pendingOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/orders/:orderId', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Food.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    res.json({
      totalUsers,
      totalProducts,
      pendingOrders,
      completedOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
