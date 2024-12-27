const mongoose = require('mongoose');

// Define the BannerDetails schema
const bannerDetailsSchema = new mongoose.Schema(
  {
    image1: {
      type: String,
    //   default: null,  // Image can be null
    },
    image2: {
      type: String,
    //   required: true,  // image2 is required
    },
    image3: {
      type: String,
    //   required: true,  // image3 is required
    },
    image4: {
      type: String,
    //   required: true,  // image4 is required
    },
  },
  {
    timestamps: true,  // This will automatically add createdAt and updatedAt fields
  }
);

// Create a model based on the schema
const BannerDetails = mongoose.model('BannerDetails', bannerDetailsSchema);

module.exports = BannerDetails;
