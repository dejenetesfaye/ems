const express = require('express');
const Resource = require('../models/Resource');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create resource (System Admin/Super Admin)
router.post('/', auth, authorize('systemadmin', 'superadmin'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const resource = new Resource({ name, description });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Resource name already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resource (System Admin/Super Admin)
router.put('/:id', auth, authorize('systemadmin', 'superadmin'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resource (System Admin/Super Admin)
router.delete('/:id', auth, authorize('systemadmin', 'superadmin'), async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;