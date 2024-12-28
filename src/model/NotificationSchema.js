const mongoose = require('mongoose');

const notificationDetailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    notification_image: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      // required: true,
    },
    read_at: {
      type: Date,
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now, // Automatically set when the document is created
    },
    updated_at: {
      type: Date,
      default: null, // Optional: Set this when the document is updated
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const NotificationDetail = mongoose.model('NotificationDetail', notificationDetailSchema);

module.exports = NotificationDetail;
