const mongoose = require('mongoose');

const VersionControlSchema = new mongoose.Schema(
  {
    version_control: {
      type: String,
      required: true,
    },
    app_link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

const VersionControl = mongoose.model('VersionControl', VersionControlSchema);

module.exports = VersionControl;
