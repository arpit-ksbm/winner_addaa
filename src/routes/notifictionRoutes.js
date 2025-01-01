const express = require('express');
const   notficatioRouter = express.Router();
const NotificationController = require('../controller/NotificationCotroller');

notficatioRouter.post('/create', NotificationController.createNotification);
notficatioRouter.get('/list', NotificationController.getNotifications);
notficatioRouter.get('/notification/:id', NotificationController.getNotificationById);
notficatioRouter.put('/update/:id', NotificationController.updateNotification);
notficatioRouter.delete('/delete/:id', NotificationController.deleteNotification);

module.exports = notficatioRouter;