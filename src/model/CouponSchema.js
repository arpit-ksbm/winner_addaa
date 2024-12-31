const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming `player_id` references a player document
      // required: true,
      ref: 'PlayerDetail', // Optional: Reference to the player collection
    },
    coupon_bonus: {
      type: Number,
      // required: true,
      default: 0, // Maps to int(1) DEFAULT 0
    },
    upi_money: {
      type: Number,
      // required: true,
      default: 0, // Maps to int(1) DEFAULT 0
    },
    offer: {
      type: Number,
      // required: true,
      default: 0, // Maps to int(1) DEFAULT 0
    },
    cool_twenty: {
      type: Number,
      // required: true,
      default: 0, // Maps to int(1) DEFAULT 0
    },
    win_twenty: {
      type: Number,
      // required: true,
      default: 0, // Maps to int(1) DEFAULT 0
    },
    upi_offer_lastused: {
      type: Date, // Maps to `date` type in MySQL
      default: null,
    },
    xtra_ten_lastused: {
      type: Date,
      default: null,
    },
    play_ten_lastused: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
