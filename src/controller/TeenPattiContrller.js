const { TeenPattiGame } = require('../model');
const { generateToken } = require('../utils/helper');
const { PlayerModel, WalletDetail, BonusWalletDetail, PromoWalletDetail, WalletTransactionDetail } = require('../model/index');
const moment = require('moment');

class TeenPattiContrller {
    static async createTeenPattiTable(req, res) {
        // Automatically generate a new token for every request
        const token = generateToken();  

        try {
            const {
                level,
                pot_limit,
                boot,
                min_entry,
                commission,
                commission_amount,
                min_real_player,
                game_order,
                win_preference
            } = req.body;

            // Validation: Ensure all required fields are present
            if (!level || !pot_limit || !boot || !min_entry || !commission || !min_real_player || !game_order || !win_preference) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Create a new TeenPattiGame instance with the data received from the request
            const game = new TeenPattiGame({
                level,
                pot_limit,
                boot,
                min_entry,
                commission,
                commission_amount: commission_amount || null,  // Use null if commission_amount is not provided
                min_real_player,
                game_order,
                win_preference,
                created_at: new Date(),  // Automatically set created_at to current date
                updated_at: new Date()   // Automatically set updated_at to current date
            });

            // Save the game data to the database
            await game.save();

            // Respond with a success message and the created game data
            return res.status(201).json({
                message: "Teen Patti game created successfully",
                game,  // Return the created game object
                _token:token  // Return the generated token to the client
            });
        } catch (error) {
            // Handle any errors that occur during game creation
            console.error("Error creating TeenPatti game:", error);
            return res.status(500).json({ message: "Error creating TeenPatti game", error: error.message });
        }
    }

    static async getTeenPattiTable(req, res) {
        try {
            const games = await TeenPattiGame.find();

            if (!games.length) {
                return res.status(404).json({ message: "No Teen Patti games found" });
            }

            return res.status(200).json({ message: "Teen Patti games found", games });
        } catch (error) {
            console.error("Error fetching Teen Patti games:", error);
            return res.status(500).json({ message: "Error fetching Teen Patti games", error: error.message });
        }
    }

    static async updateTeenPattiTable(req, res) {
        const { teen_patti_id } = req.params;

        try {
            const game = await TeenPattiGame.findById(teen_patti_id);

            if (!game) {
                return res.status(404).json({ message: "Teen Patti game not found" });
            }

            // Update the game data with the new values
            game.set(req.body);

            // Set the updated_at field to the current date
            game.updated_at = new Date();

            // Save the updated game data
            await game.save();

            return res.status(200).json({ message: "Teen Patti game updated successfully", game });
        } catch (error) {
            console.error("Error updating Teen Patti game:", error);
            return res.status(500).json({ message: "Error updating Teen Patti game", error: error.message });
        }
    }

    static async deleteTeenPattiTable(req, res) {
        const { teen_patti_id } = req.params;

        try {
            const game = await TeenPattiGame.findById(teen_patti_id);

            if (!game) {
                return res.status(404).json({ message: "Teen Patti game not found" });
            }

            await game.deleteOne()

            return res.status(200).json({ message: "Teen Patti game deleted successfully" });
        } catch (error) {
            console.error("Error deleting Teen Patti game:", error);
            return res.status(500).json({ message: "Error deleting Teen Patti game", error: error.message });
        }
    }

    static async getTeenPattiGame(req, res) {
        try {
            // Fetch the TeenPattiGame collection and sort it by 'order' in ascending order
            const games = await TeenPattiGame.find().sort({ order: 1 });  // 1 for ascending order
    
            // Return the response in the desired format
            return res.status(200).json({
                status: true,
                response: games
            });
        } catch (error) {
            console.error("Error fetching Teen Patti games:", error);
            return res.status(500).json({
                status: false,
                message: "Error fetching Teen Patti games",
                error: error.message
            });
        }
    }

    static async joinTeenPatti(req, res) {
        try {
            // Destructure the request body
            const { user_id, amount, promo_amount, bonus_amount } = req.body;

            // Validate the input fields (could be extended to include more checks)
            if (!user_id || !amount) {
                return res.status(400).json({ status: false, msg: 'User ID and Amount are required' });
            }

            // Find the player by user_id
            const player = await PlayerModel.findOne({ user_id });
            console.log(player, "player");
            if (!player) {
                return res.status(404).json({ status: false, msg: 'Player not found' });
            }
            const player_id = player.id;

            // Find the wallet associated with the player
            const wallet = await WalletDetail.findOne({ player_id });
            if (!wallet) {
                return res.status(404).json({ status: false, msg: 'Player wallet not found' });
            }

            // Update the wallet by subtracting the bet amount
            wallet.current_amount -= amount;
            await wallet.save();

            // Handle the promo wallet if applicable
            if (promo_amount && promo_amount > 0) {
                const promoWallet = await PromoWalletDetail.findOne({ player_id });
                if (promoWallet) {
                    // Create transaction record for promo wallet
                    await WalletTransactionDetail.create({
                        player_id,
                        wallet_id: promoWallet.id,
                        amount: promo_amount,
                        trans_date: moment().format('YYYY-MM-DD'),
                        type: 'debit',
                        use_of: 'TEEN_PATTI_BET',
                        notes: 'TEEN_PATTI_BET',
                        wallet_type: 'promo_balance',
                        created_at: moment().toDate(),
                    });

                    // Update the promo wallet balance
                    promoWallet.current_amount -= promo_amount;
                    promoWallet.last_added_date = moment().format("YYYY-MM-DD");
                    await promoWallet.save();
                }
            }

            // Handle the bonus wallet if applicable
            if (bonus_amount && bonus_amount > 0) {
                const bonusWallet = await BonusWalletDetail.findOne({ player_id });
                if (bonusWallet) {
                    // Create transaction record for bonus wallet
                    await WalletTransactionDetail.create({
                        player_id,
                        wallet_id: bonusWallet.id,
                        amount: bonus_amount,
                        trans_date: moment().format('YYYY-MM-DD'),
                        type: 'debit',
                        use_of: 'TEEN_PATTI_BET',
                        notes: 'TEEN_PATTI_BET',
                        wallet_type: 'bonus_balance',
                        created_at: moment().toDate(),
                    });

                    // Update the bonus wallet balance
                    bonusWallet.current_amount -= bonus_amount;
                    bonusWallet.last_added_date = moment().format("YYYY-MM-DD");
                    await bonusWallet.save();
                }
            }

            // Create the transaction for the main wallet (play balance)
            await WalletTransactionDetail.create({
                player_id: player_id.toString(),
                wallet_id: wallet.id,
                amount: amount,
                trans_date: moment().format('YYYY-MM-DD'),
                type: 'debit',
                use_of: 'TEEN_PATTI_BET',
                notes: 'TEEN_PATTI_BET',
                wallet_type: 'play_balance',
                created_at: moment().toDate(),
            });

            // Return success response
            return res.status(200).json({ status: true, msg: 'TEEN_PATTI_BET success' });
        } catch (error) {
            console.error('Error during Teen Patti game join:', error);
            return res.status(500).json({ status: false, msg: 'Internal Server Error', error: error.message });
        }
    }
    
}

module.exports = TeenPattiContrller;