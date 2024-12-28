const configureMulter = require('../../configureMulter');
const {BannerModel , Category} = require('../model/index');  // Assuming you have this model defined correctly

// Configure Multer for up to 4 images
const uploadBannerImage = configureMulter("src/uploads/banners/", [
    { name: "bannerImage", maxCount: 1 },
]);

class BannerController {
    // Method to create a banner
    static async createBanner(req, res) {
        uploadBannerImage(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading image',
                    error: err.message,
                });
            }

            try {
                const { category_id } = req.body;

                // Validate category_id
                if (!category_id) {
                    return res.status(400).json({ success: false, message: 'Category ID is required' });
                }

                // Check if the category exists
                const category = await Category.findById(category_id);
                if (!category) {
                    return res.status(404).json({ success: false, message: 'Category not found' });
                }

                // Ensure a banner image is uploaded
                const bannerImage = req.files?.['bannerImage']?.[0];
                if (!bannerImage) {
                    return res.status(400).json({ success: false, message: 'Banner image is required' });
                }

                // Get the uploaded file path
                const imagePath = bannerImage.path.replace(/\\/g, '/'); // Normalize file path
                const fullImageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;

                // Create a new Banner document
                const newBanner = new BannerModel({
                    image: imagePath, // Store the relative file path
                    category_id, // Link the category
                    banner_url: null, // Optional banner URL
                });

                // Save the banner to the database
                const savedBanner = await newBanner.save();

                // Return success response
                return res.status(201).json({
                    success: true,
                    message: 'Banner created successfully',
                    banner: {
                        id: savedBanner._id,
                        category_id: savedBanner.category_id,
                        image: fullImageUrl, // Return the full image URL
                        banner_url: savedBanner.banner_url,
                    },
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: error.message,
                });
            }
        });
    }

    // Method to get a banner by ID and populate category details
    static async getBanners(req, res) {
        try {
            // Fetch all banners and populate category details
            const banners = await BannerModel.find()
                .populate('category_id', 'category_name'); // Populate only category_name
    
            // If no banners found
            if (!banners || banners.length === 0) {
                return res.status(404).json({
                    status: "Failure",
                    message: "No banners found",
                    data: []
                });
            }
    
            // Format the response data
            const responseData = banners.map(banner => {
                return {
                    category_id: banner.category_id?._id, // ID of the category
                    category_label: banner.category_id?.category_name, // Name of the category
                    image: `${req.protocol}://${req.get('host')}/${banner.image.replace(/\\/g, '/')}`, // Full image URL
                    banner_url: banner.banner_url || null // Optional banner URL
                };
            });
    
            // Return the formatted response
            return res.status(200).json({
                status: "Success",
                message: "Banner Listed Successfully",
                data: responseData
            });
    
        } catch (error) {
            console.error("Error fetching banners:", error);
            return res.status(500).json({
                status: "Failure",
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
    
    
}

module.exports = BannerController;