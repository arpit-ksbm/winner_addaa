const User = require('../model/userModel/UserSchema');
const PlayerDetail = require('../model/playerModel/PlayerDetailsSchema');
const { validations } = require('../utils/helper');

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
      
    static async playerDeatils(req, res) {
        
    }
}

module.exports = PlayerController;

