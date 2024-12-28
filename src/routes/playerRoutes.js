const express = require('express');
const playerRouter = express.Router();
const PlayerController = require('../controller/PlayerController');
const authenticateToken = require('../middleware/userAuth');

playerRouter.post('/create-player', PlayerController.createPlayer);
playerRouter.post('/update-player', PlayerController.updatePlayer);
playerRouter.get('/player-list', PlayerController.PlayerList);
playerRouter.get('/player-details/:player_id', PlayerController.getPlayerById);
playerRouter.post('/profile-image/save', PlayerController.updatePlayerImage);
playerRouter.post('/profile-image/get', PlayerController.getPlayerImage);
playerRouter.post('/profile-image/get', PlayerController.getPlayerImage);
playerRouter.post('/updateName', PlayerController.updatePlayerName);
playerRouter.get('/notification/list', authenticateToken, PlayerController.listNotification);

module.exports = playerRouter;