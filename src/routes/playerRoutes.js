const express = require('express');
const playerRouter = express.Router();
const PlayerController = require('../controller/PlayerController');

playerRouter.post('/create-player', PlayerController.createPlayer);
playerRouter.post('/update-player', PlayerController.updatePlayer);

module.exports = playerRouter;