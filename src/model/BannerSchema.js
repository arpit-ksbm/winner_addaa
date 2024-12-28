const mongoose = require('mongoose');

// Define Banner schema
const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Single image
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', // Reference to Category model
        required: true 
    },
    banner_url: { type: String, default: null }, // Optional external URL
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const BannerModel = mongoose.model('Banner', bannerSchema);

module.exports = BannerModel;
