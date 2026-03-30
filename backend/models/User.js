const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['systemadmin', 'superadmin', 'manager', 'bride', 'supervisor'], required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' } // for bride
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);