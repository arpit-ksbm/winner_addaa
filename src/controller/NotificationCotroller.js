const multer = require('multer');
const configureMulter = require('../../configureMulter');
const { NotificationDetail } = require('../model/index');

    const uploadNotificationImage = configureMulter("src/uploads/notification/", [
        { name: "notification_image", maxCount: 1 },
    ]);

class NotificationController {
    static async createNotification(req, res) {
        uploadNotificationImage(req, res, async function (err) {
          if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, message: "Multer error", error: err.message });
          } else if (err) {
            return res.status(500).json({ success: false, message: "Error uploading file", error: err.message });
          }
    
          try {
            const { title, desc, status } = req.body;
    
            // Validate required fields
            if (!title || !desc ) {
              return res.status(400).json({ success: false, message: "Title, description, and status are required" });
            }
    
            // Get the uploaded image path, if provided
            let notification_image = null;
            if (req.files && req.files["notification_image"]) {
              const filePath = req.files["notification_image"][0].path;
              notification_image = filePath.replace(/\\/g, "/"); // Normalize path for cross-platform support
            }
    
            // Create a new notification document
            const notification = new NotificationDetail({
              title,
              desc,
              status,
              notification_image: notification_image, // Store the image path
            });
    
            // Save the notification to the database
            const savedNotification = await notification.save();
    
            // Send success response
            return res.status(201).json({
              success: true,
              message: "Notification created successfully",
              notification: {
                id: savedNotification._id,
                title: savedNotification.title,
                desc: savedNotification.desc,
                notification_image: notification_image ? `${req.protocol}://${req.get('host')}/${notification_image}` : null,
                status: savedNotification.status,
                created_at: savedNotification.created_at,
                updated_at: savedNotification.updated_at,
              },
            });
          } catch (error) {
            console.error("Error creating notification:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
          }
        });
      }
    
    static async getNotifications(req, res) {
        try {
        const notifications = await NotificationDetail.find();
        return res.status(200).json({ notifications });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
    
    static async getNotificationById(req, res) {
        try {
        const { id } = req.params;
        const notification = await NotificationDetail.findById(id);
        return res.status(200).json({ notification });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
    
    static async updateNotification(req, res) {
        try {
        const { id } = req.params;
        const { title, desc, image_url, status } = req.body;
        const notification = await NotificationDetail.findByIdAndUpdate(id, { title, desc, image_url, status }, { new: true });
        return res.status(200).json({ message: 'Notification updated successfully', notification });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
    
    static async deleteNotification(req, res) {
        try {
        const { id } = req.params;
        await NotificationDetail.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = NotificationController;