const express = require('express');
const playerRouter = express.Router();
const PlayerController = require('../controller/PlayerController');

playerRouter.post('/create-player', PlayerController.createPlayer);
playerRouter.post('/update-player', PlayerController.updatePlayer);
playerRouter.get('/player-list', PlayerController.PlayerList);
playerRouter.get('/player-details/:player_id', PlayerController.getPlayerById);

module.exports = playerRouter;