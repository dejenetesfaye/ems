const express = require('express');
const Request = require('../models/Request');
const Event = require('../models/Event');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create request (Bride)
router.post('/', auth, authorize('bride'), async (req, res) => {
  const { resource, quantity, note } = req.body;
  try {
    const event = await Event.findOne({ bride: req.user.id });
    if (!event) return res.status(400).json({ message: 'No event found' });

    const request = new Request({
      event: event._id,
      bride: req.user.id,
      resource,
      quantity,
      note
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get requests for manager
router.get('/manager', auth, authorize('manager'), async (req, res) => {
  try {
    const events = await Event.find({ manager: req.user.id });
    const eventIds = events.map(e => e._id);
    const requests = await Request.find({ event: { $in: eventIds } }).populate('bride', 'name').populate('event', 'name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject request (Manager)
router.put('/:id/status', auth, authorize('manager'), async (req, res) => {
  const { status } = req.body; // approved or rejected
  try {
    const request = await Request.findById(req.params.id).populate('event');
    if (!request || request.event.manager.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get approved requests for supervisor
router.get('/supervisor', auth, authorize('supervisor'), async (req, res) => {
  try {
    const requests = await Request.find({ status: 'approved' }).populate('event', 'name').populate('bride', 'name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fulfill request (Supervisor)
router.put('/:id/fulfill', auth, authorize('supervisor'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.status !== 'approved') return res.status(400).json({ message: 'Invalid request' });

    request.status = 'fulfilled';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm request (Bride)
router.put('/:id/confirm', auth, authorize('bride'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request || request.bride.toString() !== req.user.id || request.status !== 'fulfilled') return res.status(403).json({ message: 'Not authorized' });

    request.status = 'confirmed';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get requests for bride
router.get('/bride', auth, authorize('bride'), async (req, res) => {
  try {
    const requests = await Request.find({ bride: req.user.id }).populate('event', 'name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;