const express = require('express');
const   notficatioRouter = express.Router();
const NotificationController = require('../controller/NotificationCotroller');

notficatioRouter.post('/create', NotificationController.createNotification);
// notficatioRouter.get('/list', CategoryController.getCategories);

module.exports = notficatioRouter;