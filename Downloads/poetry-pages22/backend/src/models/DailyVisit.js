const mongoose = require('mongoose');

const dailyVisitSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  visitorId: { type: String, required: true },
  path: { type: String, default: '/' }
}, { timestamps: true });

dailyVisitSchema.index({ date: 1, visitorId: 1 }, { unique: true });

module.exports = mongoose.model('DailyVisit', dailyVisitSchema);
