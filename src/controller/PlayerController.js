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
const WalletTransactionDetail = require('../model/walletModel/walletTranscationDetails');
const CouponDetails = require('../model/CouponDetailSchema');
const GstTds = require('../model/GstTdsSchema');
const moment = require('moment');
const PlayerWinningDetail = require('../model/playerModel/PlayerWinningDetails')

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

    static async latestWinnerList(req, res) {
      try {
          // Fetch the latest 10 winners with the required details
          const players = await WalletTransactionDetail.aggregate([
              {
                  $match: {
                      use_of: 'winning',
                  },
              },
              {
                  $lookup: {
                      from: 'playerdetails', // Collection name in MongoDB
                      localField: 'player_id',
                      foreignField: '_id',
                      as: 'player_details',
                  },
              },
              {
                  $unwind: '$player_details', // Unwind to get the player details object
              },
              {
                  $project: {
                      first_name: '$player_details.first_name',
                      amount: 1,
                      notes: 1,
                  },
              },
              {
                  $sort: { _id: -1 }, // Sort by latest transaction
              },
              {
                  $limit: 10, // Limit to the latest 10 entries
              },
          ]);

          if (players && players.length > 0) {
              // Mask the last 4 characters of the first name
              const maskedPlayers = players.map(player => {
                  const firstName = player.first_name;
                  return {
                      ...player,
                      first_name: firstName.slice(0, -4) + 'xxxx',
                  };
              });

              return res.status(200).json({
                  status: 'Success',
                  players: maskedPlayers,
              });
          } else {
              return res.status(404).json({
                  status: 'fail',
                  message: 'No winners found',
              });
          }
      } catch (error) {
          console.error('Error fetching latest winner list:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Internal Server Error',
              error: error.message,
          });
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
    
    static async delNotification(req, res) {
      try {
          const userId = req.user.id; // Assuming you have middleware to add authenticated user's ID to `req.user`
          const { list_id } = req.body; // Get the notification ID from the request body

          if (!list_id) {
              return res.status(400).json({
                  status: 'error',
                  message: 'Notification ID is required',
              });
          }

          // Delete the notification for the authenticated user
          const result = await PlayerNotification.deleteOne({
              _id: list_id,
              player_id: userId,
          });

          if (result.deletedCount > 0) {
              return res.status(200).json({
                  status: 'Success',
                  message: 'Notification Deleted',
              });
          } else {
              return res.status(404).json({
                  status: 'error',
                  message: 'Notification not found',
              });
          }
      } catch (error) {
          console.error('Error deleting notification:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Internal Server Error',
              error: error.message,
          });
      }
  }

  static async couponList(req, res) {
    try {
        // Fetching coupons with a left join to player_coupon table
        const rows = await CouponDetails.aggregate([
            {
                $lookup: {
                    from: 'player_coupons', // MongoDB collection for PlayerCoupon
                    localField: '_id', // Field in CouponDetails
                    foreignField: 'coupon_id', // Field in PlayerCoupon
                    as: 'usedCoupons', // Alias for joined data
                },
            },
            {
                $match: { status: 1 }, // Only active coupons
            },
            {
                $project: {
                    _id: 1,
                    coupon_name: 1,
                    coupon_type: 1,
                    min: 1,
                    max: 1,
                    single_use: 1,
                    balance_type: 1,
                    expire_on: 1,
                    coupon_description: 1,
                    coupon_amount: 1,
                    status: 1,
                    used: {
                        $cond: {
                            if: { $gt: [{ $size: '$usedCoupons' }, 0] },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
        ]);

        const response = { status: 'Success', data: rows };
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching coupon list:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

static async couponCheck(req, res) {
  try {
    const { load_amount, coupon_name, coupon_wallet_type } = req.body;

    // Validate request body
    if (!load_amount || !coupon_name || !coupon_wallet_type) {
      return res.status(422).json({
        errors: [
          !load_amount ? "Load amount is required" : null,
          !coupon_name ? "Coupon name is required" : null,
          !coupon_wallet_type ? "Coupon wallet type is required" : null,
        ].filter(Boolean), // Filter out null values
      });
    }

    // Convert load_amount to integer for comparison
    const loadAmountInt = parseInt(load_amount, 10);

    // Log input values for debugging
    console.log('Input values:', { load_amount, coupon_name, coupon_wallet_type });

    // Query for the coupon
    const coupon = await CouponDetails.aggregate([
      {
        $match: {
          coupon_name: { $regex: new RegExp(`^${coupon_name}$`, 'i') }, // Case-insensitive match for coupon_name
          status: true, // Only active coupons
          min: { $lte: loadAmountInt }, // Ensure load_amount is greater than or equal to 'min'
          balance_type: coupon_wallet_type, // Ensure balance_type matches
        },
      },
      {
        $lookup: {
          from: 'playercoupons', // MongoDB collection name for player coupons
          localField: '_id',
          foreignField: 'coupon_id',
          as: 'used_coupons',
        },
      },
      { $sort: { min: 1 } },
      { $limit: 1 }, // Get the first matching result
    ]);

    if (coupon.length > 0) {
      // Check if coupon is used (if applicable)
      const isUsed = coupon[0].used_coupons.length > 0;
      if (isUsed) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coupon has already been used',
        });
      }

      return res.status(200).json({
        status: 'Success',
        data: coupon[0],
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid coupon code',
      });
    }
  } catch (error) {
    console.error('Error in couponCheck:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

static async bonusClaim(req, res) {
  try {
    const { player_id } = req.body;  // We no longer need bonus_updated_at from the user

    // Find the player by player_id
    const player = await PlayerDetail.findById(player_id);
    
    // Check if player exists
    if (!player) {
      return res.status(404).json({
        status: 'Error',
        message: 'Player details not found',
      });
    }

    // Update the bonus_updated_at field with current timestamp
    player.bonus_updated_at = Date.now();  // Automatically set the current time
    await player.save();

    // Get the daily bonus value from the gst_tds collection
    const gstTds = await GstTds.findOne().lean(); // Assuming there is only one document
    if (!gstTds) {
      return res.status(500).json({
        status: 'Error',
        message: 'GST TDS data not found',
      });
    }

    let bonus = gstTds.daily_bonus;

    // Find the bonus wallet details for the player
    const bonusWallet = await BonusWalletDetail.findOne({ player_id });
    
    // Check if the bonus wallet exists
    if (bonusWallet) {
      // Update the bonus in the wallet
      bonus = bonusWallet.current_amount + bonus;
      bonusWallet.current_amount = bonus;
      await bonusWallet.save();

      return res.status(200).json({
        status: 'Success',
        message: 'Bonus details updated successfully',
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Bonus wallet details not found',
      });
    }
  } catch (error) {
    console.error('Error in bonusClaim:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}


static async spinClaim(req, res) {
  try {
      const { player_id, bonus } = req.body;

      // Find the player by ID
      const player = await PlayerDetail.findById(player_id);

      if (player) {
          // Update the spin_updated_at field for the player
          player.spin_updated_at = Date.now();
          await player.save();

          // Find the bonus wallet for the player
          const bonusWallet = await BonusWalletDetail.findOne({ player_id });

          if (bonusWallet) {
              // Update the bonus amount
              bonusWallet.current_amount += bonus;
              await bonusWallet.save();

              // Send success response
              return res.status(200).json({
                  status: "Success",
                  message: "Bonus details updated successfully",
              });
          } else {
              // Bonus wallet not found
              return res.status(404).json({
                  status: "Error",
                  message: "Bonus wallet details not found",
              });
          }
      } else {
          // Player not found
          return res.status(404).json({
              status: "Error",
              message: "Player details not found",
          });
      }
  } catch (error) {
      console.error("Error in spinClaim:", error);
      return res.status(500).json({
          status: "Error",
          message: "Internal server error",
          error: error.message,
      });
  }
}

static async spinPlay(req, res) {
  try {
      const { player_id, bonus } = req.body;

      // Find the player by ID
      const player = await PlayerDetail.findById(player_id);

      if (player) {
          // Find the bonus wallet details for the player
          const bonusWallet = await BonusWalletDetail.findOne({ player_id });

          if (bonusWallet) {
              // Update the bonus amount
              bonusWallet.current_amount += bonus;
              await bonusWallet.save();

              // Send success response
              return res.status(200).json({
                  status: "Success",
                  message: "Bonus details updated successfully",
              });
          } else {
              // Bonus wallet not found
              return res.status(404).json({
                  status: "Error",
                  message: "Bonus wallet details not found",
              });
          }
      } else {
          // Player not found
          return res.status(404).json({
              status: "Error",
              message: "Player details not found",
          });
      }
  } catch (error) {
      console.error("Error in spinPlay:", error);
      return res.status(500).json({
          status: "Error",
          message: "Internal server error",
          error: error.message,
      });
  }
}

static async lastActive(req, res) {
  try {
      const { player_id, game_type } = req.body;

      // Validate required fields
      if (!player_id || !game_type) {
          return res.status(400).json({
              status: "Fail",
              message: "player_id and game_type are required",
          });
      }

      // Validate game_type (only 1 or 2 allowed)
      if (![1, 2].includes(game_type)) {
          return res.status(400).json({
              status: "Fail",
              message: "Invalid game_type. Valid values are 1 (Ludo) and 2 (Wheel).",
          });
      }

      // Find the player details
      const player = await PlayerDetail.findById(player_id);

      if (!player) {
          return res.status(404).json({
              status: "Fail",
              message: "Player not found",
          });
      }

      // Find the user associated with the player
      const user = await User.findById(player.user_id);

      if (user) {
          // Map game_type to string
          const gameTypeString = game_type === 1 ? "Ludo" : "Wheel";

          // Update the user's game_type and last_active_at fields
          user.game_type = game_type; // Store numeric value
          user.last_active_at = moment().format('YYYY-MM-DD HH:mm:ss');
          await user.save();

          return res.status(200).json({
              status: "Success",
              message: `Last activity updated. Game type set to ${gameTypeString}.`,
          });
      } else {
          return res.status(404).json({
              status: "Fail",
              message: "User associated with the player not found",
          });
      }
  } catch (error) {
      console.error("Error in lastActive:", error);
      return res.status(500).json({
          status: "Error",
          message: "Internal server error",
          error: error.message,
      });
  }
}

static async leaderBoardCurrentMonth(req, res) {
  try {
      // Get current month and year using moment.js
      const currentMonth = moment().format('MM'); // Current month in MM format
      const currentYear = moment().format('YYYY'); // Current year in YYYY format

      // Step 1: Fetch player winning details for the current month
      const winnings = await PlayerWinningDetail.find({
          winning_time: {
              $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`), // Start of the current month
              $lte: new Date(`${currentYear}-${currentMonth}-31T23:59:59.999Z`), // End of the current month
          },
      });

      // Step 2: Group by player_id and sum the total winnings manually
      const playerWinnings = {};

      winnings.forEach(winning => {
          if (!playerWinnings[winning.player_id]) {
              playerWinnings[winning.player_id] = 0;
          }
          playerWinnings[winning.player_id] += winning.winning_amount;
      });

      // Step 3: Convert the playerWinnings object into an array of players and sort by total_winning
      const sortedPlayers = Object.keys(playerWinnings)
          .map(playerId => ({
              player_id: playerId,
              total_winning: playerWinnings[playerId],
          }))
          .sort((a, b) => b.total_winning - a.total_winning); // Sort by total_winning descending

      // Step 4: Limit to top 15 players
      const topPlayers = sortedPlayers.slice(0, 15);

      // Step 5: Fetch player details for the top players
      const leaderboard = await PlayerDetail.find({
          _id: { $in: topPlayers.map(player => player.player_id) },
      });

      // Step 6: Map the aggregated data to include player details
      const leaderboardData = topPlayers.map(player => {
          const playerDetails = leaderboard.find(p => p._id.toString() === player.player_id.toString());
          return {
              player_id: player.player_id,
              total_winning: player.total_winning,
              player_name: playerDetails ? playerDetails.name : 'Unknown', // Assuming name field exists
              // Add other player details if necessary
          };
      });

      // Step 7: Send the response
      return res.status(200).json({
          status: 'Success',
          message: 'Leaderboard for current month fetched successfully',
          data: leaderboardData,
      });

  } catch (error) {
      console.error("Error in fetching leaderboard for current month:", error);
      return res.status(500).json({
          status: 'Error',
          message: 'Internal server error',
          error: error.message,
      });
  }
}


static async leaderBoardLastMonth(req, res) {
  try {
      // Step 1: Get the start and end dates for the last month
      const currentDate = moment();
      const startOfLastMonth = currentDate.clone().subtract(1, 'month').startOf('month').toDate(); // Start of last month
      const endOfLastMonth = currentDate.clone().subtract(1, 'month').endOf('month').toDate(); // End of last month

      // Step 2: Fetch player winning details for the last month
      const winnings = await PlayerWinningDetail.find({
          winning_time: {
              $gte: startOfLastMonth, // Start of last month
              $lte: endOfLastMonth, // End of last month
          },
      });

      // Step 3: Group by player_id and sum the total winnings manually
      const playerWinnings = {};

      winnings.forEach(winning => {
          if (!playerWinnings[winning.player_id]) {
              playerWinnings[winning.player_id] = 0;
          }
          playerWinnings[winning.player_id] += winning.winning_amount;
      });

      // Step 4: Convert the playerWinnings object into an array of players and sort by total_winning
      const sortedPlayers = Object.keys(playerWinnings)
          .map(playerId => ({
              player_id: playerId,
              total_winning: playerWinnings[playerId],
          }))
          .sort((a, b) => b.total_winning - a.total_winning); // Sort by total_winning descending

      // Step 5: Limit to top 15 players
      const topPlayers = sortedPlayers.slice(0, 15);

      // Step 6: Fetch player details for the top players
      const leaderboard = await PlayerDetail.find({
          _id: { $in: topPlayers.map(player => player.player_id) },
      });

      // Step 7: Map the aggregated data to include player details
      const leaderboardData = topPlayers.map(player => {
          const playerDetails = leaderboard.find(p => p._id.toString() === player.player_id.toString());
          return {
              player_id: player.player_id,
              total_winning: player.total_winning,
              player_name: playerDetails ? playerDetails.name : 'Unknown', // Assuming name field exists
              // Add other player details if necessary
          };
      });

      // Step 8: Send the response
      return res.status(200).json({
          status: 'Success',
          message: 'Leaderboard for last month fetched successfully',
          data: leaderboardData,
      });

  } catch (error) {
      console.error("Error in fetching leaderboard for last month:", error);
      return res.status(500).json({
          status: 'Error',
          message: 'Internal server error',
          error: error.message,
      });
  }
}

}

module.exports = PlayerController;

