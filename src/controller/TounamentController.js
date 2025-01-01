const { TournamentModel, WalletDetail, TournamentRegistration, WalletTransactionDetail, PromoWalletDetail, BonusWalletDetail } = require('../model/index');
const { validations } = require('../utils/helper');
const moment = require('moment');

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

                    const transactionDetail = new WalletTransactionDetail({
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

                        const promoTransaction = new WalletTransactionDetail({
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

                        const bonusTransaction = new WalletTransactionDetail({
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

                    const transactionDetail = new WalletTransactionDetail({
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

                        const promoTransaction = new WalletTransactionDetail({
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

                        const bonusTransaction = new WalletTransactionDetail({
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

    static async tournamentRegistrationList (req, res) {
        try {
            // Validate the input
            const { player_id } = req.body;
    
            if (!player_id) {
                return res.status(422).json({
                    errors: ['The player_id field is required'],
                });
            }
    
            // Get today's date
            const todayDate = moment().format('YYYY-MM-DD');
    
            // Fetch tournament registrations for the player for today's date
            const tournaments = await TournamentRegistration.find({
                player_id,
                register_date: todayDate,
            });
    
            // Send response
            return res.status(200).json({
                status: 'Success',
                message: 'Tournament Registered',
                data: tournaments,
            });
        } catch (error) {
            console.error('Error fetching tournament registrations:', error);
            return res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    };

    static async tournamentRegistrationCount (req, res) {
        try {
            // Validate the input
            const { tournament_id } = req.body;
    
            if (!tournament_id) {
                return res.status(422).json({
                    errors: ['The tournament_id field is required'],
                });
            }
    
            // Count the number of tournament registrations for the given tournament_id
            const tournamentCount = await TournamentRegistration.countDocuments({ tournament_id });
    
            // Send response
            return res.status(200).json({
                status: 'Success',
                message: 'Tournament Registered Count',
                data: tournamentCount,
            });
        } catch (error) {
            console.error('Error fetching tournament registration count:', error);
            return res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    };

    static async tournamentRegistrationOverallList (req, res) {
        try {
            // Get the current date
            const todayDate = moment().format('YYYY-MM-DD');
    
            // Fetch all tournament registrations for the current date
            const tournaments = await TournamentRegistration.find({ register_date: todayDate });
    
            // Send response
            return res.status(200).json({
                status: 'Success',
                message: 'Tournament Registered List',
                data: tournaments,
            });
        } catch (error) {
            console.error('Error fetching tournament registration list:', error);
            return res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
                error: error.message,
            });
        }
    };

    static async tournamentUpdate(req, res) {
        try {
            const { tournament_id, player_id } = req.body;
            if (!tournament_id || !player_id) {
                return res.status(422).json({
                    errors: ['The tournament_id and player_id fields are required'],
                });
            }   
            const todayTime = moment();
    
            // Find the tournament by ID
            const tournament = await TournamentModel.findById(tournament_id);
            if (!tournament) {
                return res.status(404).json({
                    status: false,
                    message: 'Not Found Data Tournament',
                });
            }
    
            // Calculate start and end times
            const startTime = moment(`${todayTime.format('YYYY-MM-DD')} ${tournament.start_time}`, 'YYYY-MM-DD HH:mm:ss');
            const endTime = startTime.clone().add(tournament.tournament_interval, 'minutes');
    
            // Calculate remaining time
            const totalSeconds = Math.max(0, endTime.diff(todayTime, 'seconds'));
    
            // Get registration counts
            const tournamentCount = await TournamentRegistration.countDocuments({ tournament_id });
            const registeredCheckCount = await TournamentRegistration.countDocuments({ player_id, tournament_id });
    
            const tournamentRegistration = await TournamentRegistration.findOne({ player_id, tournament_id });
    
            let operator = '';
            let playMoney = '';
            let bonusMoney = '';
    
            if (tournamentRegistration) {
                operator = tournamentRegistration.type || '';
                playMoney = tournamentRegistration.play_money || '';
                bonusMoney = tournamentRegistration.bonus_money || '';
            }
    
            // Convert ID to string for consistency
            tournament.id = tournament._id.toString();
    
            // Response
            const response = {
                status: 'Success',
                data: tournament,
                remainingtime: totalSeconds,
                count: tournamentCount,
                registered: registeredCheckCount,
                operator: operator,
                playmoney: playMoney,
                bonusmoney: bonusMoney,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournamentUpdate:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    static async tournament15Min (req, res) {
        try {
            const todayTime = moment();
    
            // Fetch the tournament with a 3-minute interval
            const tournament3Min = await TournamentModel.findOne({ tournament_interval: '3' });
            if (!tournament3Min) {
                return res.status(404).json({
                    status: false,
                    message: 'Tournament with 3-minute interval not found',
                });
            }
    
            // Calculate the remaining duration for the 3-minute interval tournament
            const start3 = moment(`${todayTime.format('YYYY-MM-DD')} ${tournament3Min.start_time}`, 'YYYY-MM-DD HH:mm:ss');
            const end3 = start3.clone().add(tournament3Min.tournament_interval, 'minutes');
            const totalDuration3 = Math.max(0, end3.diff(todayTime, 'seconds'));
    
            // Fetch the tournament with a 5-minute interval
            const tournament5Min = await TournamentModel.findOne({ tournament_interval: '5' });
            if (!tournament5Min) {
                return res.status(404).json({
                    status: false,
                    message: 'Tournament with 5-minute interval not found',
                });
            }
    
            // Calculate the remaining duration for the 5-minute interval tournament
            const start5 = moment(`${todayTime.format('YYYY-MM-DD')} ${tournament5Min.start_time}`, 'YYYY-MM-DD HH:mm:ss');
            const end5 = start5.clone().add(tournament5Min.tournament_interval, 'minutes');
            const totalDuration5 = Math.max(0, end5.diff(todayTime, 'seconds'));
    
            // Response
            const response = {
                status: 'Success',
                '3min': totalDuration3,
                '5min': totalDuration5,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament15Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };

    static async tournament30Min (req, res) {
        try {
            const todayTime = moment();
            const start = todayTime.format('YYYY-MM-DD HH:mm:ss');
            const end = moment(start, 'YYYY-MM-DD HH:mm:ss').add(1, 'minutes');
            const endTime = moment(start, 'YYYY-MM-DD HH:mm:ss').add(30, 'minutes');
    
            // Update the tournament with a 30-minute interval
            await TournamentModel.updateMany(
                { tournament_interval: 30 },
                {
                    $set: {
                        end_time: endTime.toISOString(),
                        start_time: end.toISOString(),
                    },
                }
            );
    
            // Retrieve updated tournaments with a 30-minute interval
            const tournaments = await TournamentModel.find({ tournament_interval: 30 });
    
            // Delete all registrations for these tournaments
            for (const tournament of tournaments) {
                await TournamentRegistration.deleteMany({ tournament_id: tournament._id });
            }
    
            // Response
            const response = {
                status: 'Success',
                message: 'Tournament Completed',
                data: tournaments,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament30Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };
    
    static async tournament5Min (req, res) {
        try {
            const todayTime = moment();
            const start = todayTime.format('YYYY-MM-DD HH:mm:ss');
            const end = moment(start, 'YYYY-MM-DD HH:mm:ss');
            const endTime = moment(start, 'YYYY-MM-DD HH:mm:ss').add(5, 'minutes');
    
            // Update the tournament with a 5-minute interval
            await TournamentModel.updateMany(
                { tournament_interval: 5 },
                {
                    $set: {
                        end_time: endTime.toISOString(),
                        start_time: end.toISOString(),
                    },
                }
            );
    
            // Retrieve updated tournaments with a 5-minute interval
            const tournaments = await TournamentModel.find({ tournament_interval: 5 });
    
            // Delete all registrations for these tournaments
            for (const tournament of tournaments) {
                await TournamentRegistration.deleteMany({ tournament_id: tournament._id });
            }
    
            // Response
            const response = {
                status: 'Success',
                message: 'Tournament Completed',
                data: tournaments,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament5Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };
    
    static async tournament3Min (req, res) {
        try {
            const todayTime = moment();
            const start = todayTime.format('YYYY-MM-DD HH:mm:ss');
            const end = moment(start, 'YYYY-MM-DD HH:mm:ss');
            const endTime = moment(start, 'YYYY-MM-DD HH:mm:ss').add(3, 'minutes');
    
            // Update the tournament with a 3-minute interval
            await TournamentModel.updateMany(
                { tournament_interval: 3 },
                {
                    $set: {
                        end_time: endTime.toISOString(),
                        start_time: end.toISOString(),
                    },
                }
            );
    
            // Retrieve updated tournaments with a 3-minute interval
            const tournaments = await TournamentModel.find({ tournament_interval: 3 });
    
            // Delete all registrations for these tournaments
            for (const tournament of tournaments) {
                await TournamentRegistration.deleteMany({ tournament_id: tournament._id });
            }
    
            // Response
            const response = {
                status: 'Success',
                message: 'Tournament Completed',
                data: tournaments,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament3Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };
    
    static async tournament8Min (req, res) {
        try {
            const todayTime = moment();
            const start = todayTime.format('YYYY-MM-DD HH:mm:ss');
            const end = moment(start, 'YYYY-MM-DD HH:mm:ss');
            const endTime = moment(start, 'YYYY-MM-DD HH:mm:ss').add(8, 'minutes');
    
            // Update the tournament with an 8-minute interval
            await TournamentModel.updateMany(
                { tournament_interval: 8 },
                {
                    $set: {
                        end_time: endTime.toISOString(),
                        start_time: end.toISOString(),
                    },
                }
            );
    
            // Retrieve updated tournaments with an 8-minute interval
            const tournaments = await TournamentModel.find({ tournament_interval: 8 });
    
            // Delete all registrations for these tournaments
            for (const tournament of tournaments) {
                await TournamentRegistration.deleteMany({ tournament_id: tournament._id });
            }
    
            // Response
            const response = {
                status: 'Success',
                message: 'Tournament Completed',
                data: tournaments,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament8Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };

    static async tournament1Min (req, res) {
        try {
            const todayTime = moment();
            const start = todayTime.format('YYYY-MM-DD HH:mm:ss');
            const end = moment(start, 'YYYY-MM-DD HH:mm:ss');
            const endTime = moment(start, 'YYYY-MM-DD HH:mm:ss').add(1, 'minute');
    
            // Update tournaments with a 1-minute interval
            await TournamentModel.updateMany(
                { tournament_interval: 1 },
                {
                    $set: {
                        end_time: endTime.toISOString(),
                        start_time: end.toISOString(),
                    },
                }
            );
    
            // Retrieve updated tournaments with a 1-minute interval
            const tournaments = await TournamentModel.find({ tournament_interval: 1 });
    
            // Delete all registrations for these tournaments
            for (const tournament of tournaments) {
                await TournamentRegistration.deleteMany({ tournament_id: tournament._id });
            }
    
            // Response
            const response = {
                status: 'Success',
                message: 'Tournament Completed',
                data: tournaments,
            };
    
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error in tournament1Min:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    };
    
    

}

module.exports = TournamentController;
