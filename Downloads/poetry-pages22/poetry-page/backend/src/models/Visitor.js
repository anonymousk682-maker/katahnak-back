const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
