const { validations, Response, Error, ErrorCatch } = require('../utils/helper');
const User = require('../model/userModel/UserSchema');
const PlayerDetail = require('../model/playerModel/PlayerDetailsSchema');
const VersionControl = require('../model/VersionControlSchema');
const BoatControl = require('../model/BoatControlSchema');
const BonusWalletTransactionDetail = require('../model/walletModel/bonusWalletDetails');
const WalletDetail = require('../model/walletModel/walletDetailSchema');
const PromoWalletDetail = require('../model/walletModel/promoWalletDetails');
const BonusWalletDetail = require('../model/walletModel/bonusWalletDetails');
const configureMulter = require('../../configureMulter');
const multer = require('multer');
const PlayerNotification = require('../model/playerModel/PlayerNotification');

const uploadPlayerImage = configureMulter("src/uploads/players/", [
  { name: "profile_image", maxCount: 1 },
]);

class PlayerController {
    static async createPlayer(req, res) {
        try {
            const { user_id, first_name, last_name, refer_code, join_code, no_of_participate, no_of_loose, no_of_total_win, no_of_2win, no_of_4win, device_type, device_token, banned } = req.body;

            const validationResponse = validations(res, { user_id, first_name });
            if (validationResponse) return validationResponse;
        
            // Find the user by user_id
            const user = await User.findById(user_id);
            if (!user) {
              return res.status(404).json({ status: 'Error', message: 'User not found' });
            }
        
            // Create a new player record
            const player = new PlayerDetail({
              id: user.mobile_no, // Set `id` as the user's mobile number
              user_id: user_id,
              first_name: first_name,
              last_name: last_name,
              refer_code: refer_code,
              join_code: join_code,
              no_of_participate: no_of_participate,
              no_of_loose: no_of_loose,
              no_of_total_win: no_of_total_win,
              no_of_2win: no_of_2win,
              no_of_4win: no_of_4win,
              device_type: device_type,
              device_token: device_token,
              banned: banned || false, // Default banned to `false` if not provided
            });
        
            // Save the player record
            await player.save();
        
            return res.status(200).json({
              status: 'Success',
              message: 'Player created successfully',
              player: player,
            });
          } catch (error) {
            console.error('Error creating player:', error);
            return res.status(500).json({ status: 'Error', message: 'Internal server error' });
          }
    }

    static async updatePlayer(req, res) {
        try {
          const {
            user_id, // To identify the player
            first_name,
            last_name,
            refer_code,
            join_code,
            no_of_participate,
            no_of_loose,
            no_of_total_win,
            no_of_2win,
            no_of_4win,
            device_type,
            device_token,
            banned,
          } = req.body;
      
          // Validate input
          if (!user_id) {
            return res.status(400).json({ status: 'Error', message: 'User ID is required' });
          }
      
          // Find the player by user_id
          const player = await PlayerDetail.findOne({ user_id });
          if (!player) {
            return res.status(404).json({ status: 'Error', message: 'Player not found' });
          }
      
          // Update the player fields
          if (first_name) player.first_name = first_name;
          if (last_name) player.last_name = last_name;
          if (refer_code) player.refer_code = refer_code;
          if (join_code) player.join_code = join_code;
          if (no_of_participate) player.no_of_participate = no_of_participate;
          if (no_of_loose) player.no_of_loose = no_of_loose;
          if (no_of_total_win) player.no_of_total_win = no_of_total_win;
          if (no_of_2win) player.no_of_2win = no_of_2win;
          if (no_of_4win) player.no_of_4win = no_of_4win;
          if (device_type) player.device_type = device_type;
          if (device_token) player.device_token = device_token;
          if (banned !== undefined) player.banned = banned;
      
          // Save the updated player
          await player.save();
      
          return res.status(200).json({
            status: 'Success',
            message: 'Player updated successfully',
            player,
          });
        } catch (error) {
          console.error('Error updating player:', error);
          return res.status(500).json({ status: 'Error', message: 'Internal server error' });
        }
    }
      
    static async PlayerList(req, res) {
        try {
          const players = await PlayerDetail.find();
          
          return Response(res, true, 200, 'Players fetched successfully', players);
        } catch (error) {
          console.error('Error fetching players:', error);
          return ErrorCatch(res, error);
        }
    }

    static async getPlayerById(req, res) {
      try {
        const { player_id } = req.params;
    
        // Fetch player details
        const player = await PlayerDetail.findById(player_id);
        if (!player) {
          return res.status(404).json({ status: 'Error', message: 'Player not found' });
        }
    
        // Fetch related data
        const user = await User.findById(player.user_id);
        const mobileNumber = user ? user.mobile_no : null;
    
        const app = await VersionControl.findOne();
        const bot = await BoatControl.findOne();
        const coupon = await BonusWalletTransactionDetail.findOne({ player_id });
        const wallet = await WalletDetail.findOne({ player_id });
        const promoWallet = await PromoWalletDetail.findOne({ player_id });
        const bonusWallet = await BonusWalletDetail.findOne({ player_id });
    
        // Prepare the response
        return res.status(200).json({
          status: 'Success',
          message: 'Player details fetched successfully',
          data: {
            player,
            mobile: mobileNumber,
            wallet,
            bonus_wallet: bonusWallet,
            promo_wallet: promoWallet,
            coupon,
            app,
            bot,
          },
        });
      } catch (error) {
        console.error('Error fetching player details:', error);
        return res.status(500).json({ status: 'Error', message: 'Internal server error' });
      }
    } 

    static async updatePlayerImage(req, res) {
      uploadPlayerImage(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ success: false, message: "Multer error", error: err.message });
        } else if (err) {
          return res.status(500).json({ success: false, message: "Error uploading file", error: err.message });
        }
    
        try {
          const { player_id } = req.body;
    
          // Validate player_id
          if (!player_id) {
            return res.status(400).json({ success: false, message: "Player ID is required" });
          }
    
          // Find the player by ID
          const player = await PlayerDetail.findById({ _id: player_id });
          if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
          }
    
          if (req.files["profile_image"]) {
            // Get the uploaded file path
            const filePath = req.files["profile_image"][0].path;
    
            // Use relative path including `src/uploads/players`
            const relativePath = filePath.replace(/\\/g, "/");
    
            // Update player data
            player.profile_image = relativePath; // Save relative path in the database
            player.profile_url_image = ""; // Clear profile URL if profile image is uploaded
            await player.save();
    
            return res.status(200).json({
              success: true,
              message: "Player profile image updated successfully",
              profile_image: relativePath,
              player,
            });
          }
    
          // If no files are uploaded or profile image is missing
          return res.status(400).json({ success: false, message: "No profile image provided" });
        } catch (error) {
          console.error("Error updating player image:", error);
          return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
      });
    }
    
    static async getPlayerImage(req, res) {
      try {
        const { player_id } = req.body;
    
        // Validate player_id
        if (!player_id) {
          return res.status(400).json({ success: false, message: "Player ID is required" });
        }
    
        // Find the player by ID
        const player = await PlayerDetail.findById(player_id);
        if (!player) {
          return res.status(404).json({ success: false, message: "Player not found" });
        }
    
        // Prepare the image data
        let image;
        if (player.profile_url_image && player.profile_url_image.trim() !== "") {
          image = player.profile_url_image; // Use the profile URL if available
        } else {
          image = player.profile_image && player.profile_image.trim() !== ""
            ? `${req.protocol}://${req.get("host")}/${player.profile_image}` // Append base URL with `src/uploads/players`
            : ""; // Use the local file if available, otherwise empty string
        }
    
        // Respond with the image data
        return res.status(200).json({
          success: true,
          message: "Player profile image fetched successfully",
          data: { image },
        });
      } catch (error) {
        console.error("Error fetching player image:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
      }
    }

    static async updatePlayerName(req, res) {
      try {
        const { player_id, first_name } = req.body;
    
        // Validate player_id and first_name
        if (!player_id || !first_name) {
          return res.status(400).json({ success: false, message: "Player ID and first name are required" });
        }
    
        // Find the player by ID
        const player = await PlayerDetail.findById(player_id);
        if (!player) {
          return res.status(404).json({ success: false, message: "Player not found" });
        }
    
        // Update the player's first name
        player.first_name = first_name;
        await player.save();
    
        // Respond with success message
        return res.status(200).json({
          success: true,
          message: "Player name updated successfully",
        });
      } catch (error) {
        console.error("Error updating player name:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
      }
    }
    
    static async listNotification(req, res) {
      try {
        // Assuming `req.user` contains the authenticated user's information
        const player_id = req.user?.userId;

        console.log("Player ID:", player_id);
  
        if (!player_id) {
          return res.status(400).json({
            status: "Failure",
            message: "Player ID is required",
          });
        }
  
        // Perform the query to fetch notifications
        const rows = await PlayerNotification.aggregate([
          {
            $lookup: {
              from: "notificationdetails", // Name of the NotificationDetail collection
              localField: "notification_detail_id",
              foreignField: "_id",
              as: "notification_details",
            },
          },
          { $unwind: "$notification_details" }, // Unwind the joined array
          {
            $match: {
              player_id: player_id,
            },
          },
          {
            $project: {
              "notification_details.title": 1,
              "notification_details.desc": 1,
              "notification_details.status": 1,
              "notification_details.read_at": 1,
              "notification_details.created_at": 1,
              "notification_details.updated_at": 1,
              list_id: "$_id",
            },
          },
          { $sort: { "notification_details._id": -1 } }, // Sort in descending order
        ]);
  
        // Respond with the data
        return res.status(200).json({
          status: "Success",
          data: rows,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
          status: "Failure",
          message: "Internal Server Error",
          error: error.message,
        });
      }
    }
    
    
       
}

module.exports = PlayerController;

