const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  bride: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resource: { type: String, required: true },
  quantity: { type: Number, required: true },
  note: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'fulfilled', 'confirmed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);