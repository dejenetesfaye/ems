const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  bride: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resources: [{
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number, default: function() { return this.quantity * this.unitCost; } }
  }],
  totalCost: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate totalCost
eventSchema.pre('save', function(next) {
  this.totalCost = this.resources.reduce((sum, resource) => sum + resource.totalCost, 0);
  next();
});

module.exports = mongoose.model('Event', eventSchema);