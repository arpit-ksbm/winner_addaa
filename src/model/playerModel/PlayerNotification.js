const mongoose = require('mongoose');

// Define the schema for player_notification
const playerNotificationSchema = new mongoose.Schema(
  {
    notification_detail_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to NotificationDetail model
      ref: 'NotificationDetail',
      required: true,
    },
    player_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming player_id is a reference to a Player model
      ref: 'Player',  // Make sure you have a Player model
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: null, // Optional: this field can be updated when the document is updated
    },
  },
  {
    timestamps: true, // Automatically handles created_at and updated_at
  }
);

// Create a model from the schema
const PlayerNotification = mongoose.model('PlayerNotification', playerNotificationSchema);

module.exports = PlayerNotification;
