const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create event (Manager)
router.post('/', auth, authorize('manager'), async (req, res) => {
  const { name, type, date, brideId, resources } = req.body;
  try {
    const bride = await User.findById(brideId);
    if (!bride || bride.role !== 'bride') return res.status(400).json({ message: 'Invalid bride' });

    const event = new Event({
      name,
      type,
      date,
      bride: brideId,
      manager: req.user.id,
      resources
    });
    await event.save();

    // Update bride with eventId
    bride.eventId = event._id;
    await bride.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events for manager
router.get('/manager', auth, authorize('manager'), async (req, res) => {
  try {
    const events = await Event.find({ manager: req.user.id }).populate('bride', 'name').populate('resources.resource', 'name description');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events (SystemAdmin/SuperAdmin) - includes manager-created events
router.get('/all', auth, authorize('systemadmin', 'superadmin'), async (req, res) => {
  try {
    const events = await Event.find()
      .populate('bride', 'name email')
      .populate('manager', 'name email')
      .populate('resources.resource', 'name description');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event for bride
router.get('/bride', auth, authorize('bride'), async (req, res) => {
  try {
    const event = await Event.findOne({ bride: req.user.id }).populate('resources.resource', 'name description').populate('manager', 'name');
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event resources (Manager)
router.put('/:id/resources', auth, authorize('manager'), async (req, res) => {
  const { resources } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.manager.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    event.resources = resources;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;