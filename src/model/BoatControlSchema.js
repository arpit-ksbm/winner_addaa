const mongoose = require('mongoose');

const BoatControlSchema = new mongoose.Schema(
  {
    boat_status: {
      type: Boolean,
      required: true,
      default: false, // Maps to tinyint(1) DEFAULT 0 in MySQL
    },
    boat_complexity: {
      type: Number,
      required: true,
      default: 0, // Maps to int(11) DEFAULT 0 in MySQL
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

const BoatControl = mongoose.model('BoatControl', BoatControlSchema);

module.exports = BoatControl;
