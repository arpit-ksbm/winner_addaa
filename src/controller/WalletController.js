const { WalletDetail, PlayerModel } = require('../model/index');

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
}

module.exports = WalletController;