const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all brides (for manager to select)
router.get('/brides', auth, authorize('manager'), async (req, res) => {
  try {
    const brides = await User.find({ role: 'bride' }).select('name email');
    res.json(brides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for systemadmin/superadmin)
router.get('/', auth, authorize('systemadmin', 'superadmin'), async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;