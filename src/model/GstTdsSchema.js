const mongoose = require('mongoose');

const GstTdsSchema = new mongoose.Schema({
  gst: { type: Number, required: true }, // GST value
  daily_bonus: { type: Number, required: true }, // Daily bonus value
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('GstTds', GstTdsSchema);
