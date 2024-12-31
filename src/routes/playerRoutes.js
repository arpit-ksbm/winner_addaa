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
playerRouter.get('/latest-winner', PlayerController.latestWinnerList);
playerRouter.get('/coupon/list', PlayerController.couponList);
playerRouter.post('/coupon/check', PlayerController.couponCheck)
playerRouter.post('/bonus/claim', PlayerController.bonusClaim)
playerRouter.post('/spin/claim', PlayerController.spinClaim);
playerRouter.post('/spin/play', PlayerController.spinClaim);
playerRouter.post('/last-active', PlayerController.lastActive);
playerRouter.get('/leader-board-current-month', PlayerController.leaderBoardCurrentMonth);
playerRouter.get('/leader-board-last-month', PlayerController.leaderBoardLastMonth);

module.exports = playerRouter;