const { TournamentModel } = require('../model/index');
const { validations } = require('../utils/helper');

class TournamentController {
    // Method to create a new tournament
    static async createTournament(req, res) {
        try {

            const { level, tournament_name, bet_amount, no_players, min_player, no_of_winners, commission, commission_amount, win_preference, order } = req.body;

            const validationResponse = validations(res, { level, tournament_name, bet_amount, no_players, min_player, no_of_winners });
            if (validationResponse) return validationResponse;

            // Create a new tournament document
            const tournament = new TournamentModel({
                level,
                tournament_name,
                bet_amount,
                no_players,
                min_player,
                no_of_winners,
                commission,
                commission_amount,
                win_preference,
                two_player_winning: null,
                three_player_winning_1: null,
                three_player_winning_2: null,
                four_player_winning_1: null,
                four_player_winning_2: null,
                four_player_winning_3: null,
                start_time: null,
                end_time: null,
                tournament_interval: null,
                status: 1, // default: 1 (yet_to_start)
                bot: 1, // default: 1
                order: order,
            });

            // Save the tournament to the database
            await tournament.save();

            // Return a success response
            return res.status(201).json({
                message: 'Tournament created successfully!',
                tournament,
            });
        } catch (error) {
            console.error('Error creating tournament:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getTournament(req, res) {
        try {
            const tournaments = await TournamentModel.find();
            return res.status(200).json({ tournaments });
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async tournamentRegistration(req, res) {
        try {
            // Input validation
            const { player_id, tournament_id, use_of, notes, play_amount, promo_amount, bonus_amount, refund } = req.body;
            if (!player_id || !tournament_id || !use_of || !notes || !play_amount || !promo_amount || !bonus_amount) {
                return res.status(422).json({ errors: 'All fields are required.' });
            }

            const todayTime = moment().format("YYYY-MM-DD");

            if (refund) {
                // Refund process: Remove existing registration and update wallet
                await TournamentRegistration.deleteOne({ player_id, tournament_id });

                // Update the player's main wallet
                const walletDetail = await WalletDetail.findOne({ player_id });
                if (walletDetail && play_amount !== '0') {
                    walletDetail.total_amt_load += parseFloat(play_amount);
                    walletDetail.current_amount += parseFloat(play_amount);
                    walletDetail.no_of_load += 1;
                    walletDetail.last_load_date = todayTime;
                    await walletDetail.save();

                    const transactionDetail = new WalletTransactionDetails({
                        player_id,
                        wallet_id: walletDetail._id,
                        type: 'credit',
                        use_of,
                        notes,
                        trans_date: todayTime,
                        amount: play_amount,
                        wallet_type: 'play_balance',
                    });
                    await transactionDetail.save();
                }

                // Handle promo amount and bonus amount if provided
                if (promo_amount !== '0') {
                    const promoWallet = await PromoWalletDetail.findOne({ player_id });
                    if (promoWallet) {
                        promoWallet.current_amount -= parseFloat(promo_amount);
                        promoWallet.last_added_date = todayTime;
                        await promoWallet.save();

                        const promoTransaction = new WalletTransactionDetails({
                            player_id,
                            wallet_id: promoWallet._id,
                            amount: promo_amount,
                            trans_date: todayTime,
                            type: 'debit',
                            use_of: 'LUDO_REFUNDED',
                            notes: 'LUDO_REFUNDED',
                            wallet_type: 'promo_balance',
                        });
                        await promoTransaction.save();
                    }
                }

                if (bonus_amount !== '0') {
                    const bonusWallet = await BonusWalletDetail.findOne({ player_id });
                    if (bonusWallet) {
                        bonusWallet.current_amount -= parseFloat(bonus_amount);
                        bonusWallet.last_added_date = todayTime;
                        await bonusWallet.save();

                        const bonusTransaction = new WalletTransactionDetails({
                            player_id,
                            wallet_id: bonusWallet._id,
                            amount: bonus_amount,
                            trans_date: todayTime,
                            type: 'debit',
                            use_of: 'LUDO_REFUNDED',
                            notes: 'LUDO_REFUNDED',
                            wallet_type: 'bonus_balance',
                        });
                        await bonusTransaction.save();
                    }
                }

                return res.status(200).json({ status: 'refunded' });
            } else {
                // No refund, proceed with new registration
                let tourRegistration = await TournamentRegistration.findOne({ tournament_id, register_date: todayTime }).sort({ _id: -1 });

                let type = '';
                let room_no = 1;

                if (!tourRegistration) {
                    type = 'creater';
                } else {
                    const room = tourRegistration.room_no;
                    if (req.body.players === '2') {
                        if (tourRegistration.type === 'creater') {
                            type = 'joiner';
                            room_no = room;
                        } else {
                            type = 'creater';
                            room_no = room + 1;
                        }
                    } else {
                        if (tourRegistration.type === 'creater') {
                            type = 'joiner_1';
                            room_no = room;
                        } else if (tourRegistration.type === 'joiner_1') {
                            type = 'joiner_2';
                            room_no = room;
                        } else if (tourRegistration.type === 'joiner_2') {
                            type = 'joiner_3';
                            room_no = room;
                        } else if (tourRegistration.type === 'joiner_3') {
                            type = 'creater';
                            room_no = room + 1;
                        }
                    }
                }

                const registration = new TournamentRegistration({
                    player_id,
                    tournament_id,
                    type,
                    register_date: todayTime,
                    play_money: play_amount,
                    bonus_money: bonus_amount,
                    room_no,
                });

                await registration.save();

                // Update Wallet Details for the player
                const walletDetail = await WalletDetail.findOne({ player_id });
                if (walletDetail && play_amount !== '0') {
                    walletDetail.total_amt_withdraw += parseFloat(play_amount);
                    walletDetail.current_amount -= parseFloat(play_amount);
                    walletDetail.no_of_withdraw += 1;
                    walletDetail.last_withdraw_date = todayTime;
                    await walletDetail.save();

                    const transactionDetail = new WalletTransactionDetails({
                        player_id,
                        wallet_id: walletDetail._id,
                        type: 'debit',
                        use_of,
                        notes,
                        trans_date: todayTime,
                        amount: play_amount,
                        wallet_type: 'play_balance',
                    });
                    await transactionDetail.save();
                }

                // Handle promo and bonus money if available
                if (promo_amount !== '0') {
                    const promoWallet = await PromoWalletDetail.findOne({ player_id });
                    if (promoWallet) {
                        promoWallet.current_amount -= parseFloat(promo_amount);
                        promoWallet.last_added_date = todayTime;
                        await promoWallet.save();

                        const promoTransaction = new WalletTransactionDetails({
                            player_id,
                            wallet_id: promoWallet._id,
                            amount: promo_amount,
                            trans_date: todayTime,
                            type: 'debit',
                            use_of: 'LUDO_JOIN',
                            notes: 'LUDO_JOIN',
                            wallet_type: 'promo_balance',
                        });
                        await promoTransaction.save();
                    }
                }

                if (bonus_amount !== '0') {
                    const bonusWallet = await BonusWalletDetail.findOne({ player_id });
                    if (bonusWallet) {
                        bonusWallet.current_amount -= parseFloat(bonus_amount);
                        bonusWallet.last_added_date = todayTime;
                        await bonusWallet.save();

                        const bonusTransaction = new WalletTransactionDetails({
                            player_id,
                            wallet_id: bonusWallet._id,
                            amount: bonus_amount,
                            trans_date: todayTime,
                            type: 'debit',
                            use_of: 'LUDO_JOIN',
                            notes: 'LUDO_JOIN',
                            wallet_type: 'bonus_balance',
                        });
                        await bonusTransaction.save();
                    }
                }

                return res.status(200).json({
                    status: 'Success',
                    operator: type,
                    room_no,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static async editTournament(req, res) {
        try {
            const { tournamentId } = req.params;
            const updateData = req.body; // Assuming the updated data comes from the request body
    
            console.log('tournamentId', tournamentId);
            console.log('updateData', updateData);  // Log the update data for debugging
    
            if (!tournamentId) {
                return res.status(422).json({ message: 'Tournament ID is required' });
            }
    
            // Find the tournament by ID and update it with the new data
            const updatedTournament = await TournamentModel.findByIdAndUpdate(
                tournamentId, 
                updateData, 
                { new: true } // `new: true` ensures the updated document is returned
            );
    
            if (!updatedTournament) {
                return res.status(404).json({ message: 'Tournament not found' });
            }
    
            // Send back the updated tournament data along with the action
            const action = "1"; // Assuming action is predefined, modify if needed
            return res.status(200).json({
                tournament: updatedTournament,
                action
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static async deleteTournament(req, res) {
        try {
            const { tournamentId } = req.params;
    
            if (!tournamentId) {
                return res.status(422).json({ message: 'Tournament ID is required' });
            }
    
            // Find the tournament by ID and delete it
            const deletedTournament = await TournamentModel.findByIdAndDelete(tournamentId);
    
            if (!deletedTournament) {
                return res.status(404).json({ message: 'Tournament not found' });
            }
    
            // Send back the deleted tournament data
            return res.status(200).json({
                message: 'Tournament deleted successfully',
                tournament: deletedTournament
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}

module.exports = TournamentController;
