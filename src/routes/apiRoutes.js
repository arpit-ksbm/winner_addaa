const express = require('express');
const apiRouter = express.Router();
const TeenPattiContrller= require('../controller/TeenPattiContrller');
const WalletController = require('../controller/WalletController');

apiRouter.get('/teenpatti/get', TeenPattiContrller.getTeenPattiGame);
apiRouter.post('/teenpatti/join', TeenPattiContrller.joinTeenPatti);
apiRouter.post('/wallet/add/request', WalletController.walletAddRequest);

module.exports = apiRouter;