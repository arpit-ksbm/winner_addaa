const express = require('express');
const apiRouter = express.Router();
const TeenPattiContrller= require('../controller/TeenPattiContrller');
const WalletController = require('../controller/WalletController');
const TournamentController = require('../controller/TounamentController');

apiRouter.get('/teenpatti/get', TeenPattiContrller.getTeenPattiGame);
apiRouter.post('/teenpatti/join', TeenPattiContrller.joinTeenPatti);
apiRouter.post('/wallet/add/request', WalletController.walletAddRequest);
apiRouter.post('/bonus/wallet/load/amount', WalletController.bonuswalletAmountLoad);
apiRouter.post('/bonus/wallet/withdraw/amount', WalletController.bonuswalletAmountWithdraw);
// apiRouter.post('/tournament/registration', TournamentController.tournamentRegistration);


module.exports = apiRouter;