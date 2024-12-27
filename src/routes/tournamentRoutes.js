const express = require('express');
const tournamentRouter = express.Router();
const TournamentController = require('../controller/TounamentController');

tournamentRouter.post('/create', TournamentController.createTournament);
tournamentRouter.get('/list', TournamentController.getTournament);
tournamentRouter.put('/update/:tournamentId', TournamentController.editTournament);
tournamentRouter.delete('/delete/:tournamentId', TournamentController.deleteTournament);
tournamentRouter.post('/registration', TournamentController.tournamentRegistration);

module.exports = tournamentRouter;