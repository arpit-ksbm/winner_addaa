const configureMulter = require('../../configureMulter');
const {BannerModel} = require('../model/index');

// Configure Multer for up to 4 images
const uploadBannerImage = configureMulter("src/uploads/banners/", [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]);

class BannerController {
    static async createBanner(req, res) {
        // Use Multer to upload the images
        uploadBannerImage(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading images', error: err.message });
            }

            try {
                // Check if images are uploaded
                const images = [];

                // Access each image field safely
                if (req.files && req.files['image1']) images.push(req.files['image1'][0].path);
                if (req.files && req.files['image2']) images.push(req.files['image2'][0].path);
                if (req.files && req.files['image3']) images.push(req.files['image3'][0].path);
                if (req.files && req.files['image4']) images.push(req.files['image4'][0].path);

                // Validate that at least one image is uploaded
                if (images.length === 0) {
                    return res.status(400).json({ message: 'At least one image must be uploaded' });
                }

                // Create a new BannerDetails document with the uploaded image paths
                const newBanner = new BannerModel({
                    bannerImages: images
                });

                // Save the banner to the database
                const savedBanner = await newBanner.save();

                // Send a success response with the saved banner data
                return res.status(201).json({
                    message: 'Banner created successfully',
                    banner: savedBanner
                });

            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }

}

module.exports = BannerController;
