const { WalletDetail, PlayerModel, BonusWalletDetail, WalletTransactionDetail } = require('../model/index');
const moment = require('moment');

class WalletController {
    static async walletAddRequest(req, res) {
        try {
            // Validate the request body
            const { player_id } = req.body;

            if (!player_id) {
                return res.status(422).json({ errors: ['Player ID is required'] });
            }

            // Find the player using the player_id
            const player = await PlayerModel.findById(player_id);

            if (!player) {
                return res.status(404).json({ status: 'error', message: 'Player not found' });
            }

            console.log('Player:', player);

            // Retrieve wallet details associated with the player's `player_id`
            const walletAddRequests = await WalletDetail.find({ player_id });

            console.log('Wallet Add Requests:', walletAddRequests);

            if (walletAddRequests && walletAddRequests.length > 0) {
                return res.status(200).json({
                    status: 'Success',
                    message: 'Request Listed Successfully',
                    data: walletAddRequests,
                });
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Wallet Found',
                });
            }
        } catch (error) {
            console.error('Error processing wallet add request:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    }

    static async bonuswalletAmountLoad(req, res) {
        try {
            const { player_id, loaded_amount, use_of, notes } = req.body;

            // Validate request body
            if (!player_id || !loaded_amount) {
                return res.status(422).json({
                    errors: [
                        !player_id ? "Player ID is required" : null,
                        !loaded_amount ? "Loaded amount is required" : null,
                    ].filter(Boolean),
                });
            }

            // Get today's date
            const todayTime = moment().format('YYYY-MM-DD');

            // Find the player's bonus wallet
            const walletDetail = await BonusWalletDetail.findOne({ player_id });
            if (walletDetail) {
                // Update the bonus wallet details
                walletDetail.total_amt_added += loaded_amount;
                walletDetail.current_amount += loaded_amount;
                walletDetail.last_added_date = todayTime;
                await walletDetail.save();

                // Save transaction details
                const transactionDetail = new WalletTransactionDetail({
                    player_id,
                    wallet_id: walletDetail._id,
                    type: 'credit',
                    use_of,
                    notes,
                    trans_date: todayTime,
                    amount: loaded_amount,
                    wallet_type: 'bonus_balance',
                });
                await transactionDetail.save();

                return res.status(200).json({
                    status: 'Success',
                    message: 'Amount successfully added to bonus wallet',
                    data: transactionDetail,
                });
            } else {
                return res.status(422).json({
                    status: 'error',
                    message: 'No Bonus Wallet Found',
                });
            }
        } catch (error) {
            console.error('Error in bonuswalletAmountLoad:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    }

    static async bonuswalletAmountWithdraw(req, res) {
        try {
            const { player_id, withdraw_amount, use_of, notes } = req.body;

            // Validate request body
            if (!player_id || !withdraw_amount) {
                return res.status(422).json({
                    errors: [
                        !player_id ? "Player ID is required" : null,
                        !withdraw_amount ? "Withdraw amount is required" : null,
                    ].filter(Boolean),
                });
            }

            // Get today's date
            const todayTime = moment().format('YYYY-MM-DD');

            // Find the player's bonus wallet
            const walletDetail = await BonusWalletDetail.findOne({ player_id });
            if (walletDetail) {
                if (walletDetail.current_amount >= withdraw_amount) {
                    // Update the bonus wallet details
                    walletDetail.total_amt_used += withdraw_amount;
                    walletDetail.current_amount -= withdraw_amount;
                    walletDetail.last_used_date = todayTime;
                    await walletDetail.save();

                    // Save transaction details
                    const transactionDetail = new WalletTransactionDetail({
                        player_id,
                        wallet_id: walletDetail._id,
                        type: 'debit',
                        use_of,
                        notes,
                        trans_date: todayTime,
                        amount: withdraw_amount,
                        wallet_type: 'bonus_balance',
                    });
                    await transactionDetail.save();

                    return res.status(200).json({
                        status: 'Success',
                        message: 'Amount successfully withdrawn from bonus wallet',
                        data: transactionDetail,
                    });
                } else {
                    return res.status(422).json({
                        status: 'error',
                        message: 'Insufficient balance in bonus wallet',
                    });
                }
            } else {
                return res.status(422).json({
                    status: 'error',
                    message: 'No Bonus Wallet Found',
                });
            }
        } catch (error) {
            console.error('Error in bonuswalletAmountWithdraw:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    }
}

module.exports = WalletController;