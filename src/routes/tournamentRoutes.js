const express = require('express');
const tournamentRouter = express.Router();
const TournamentController = require('../controller/TounamentController');

tournamentRouter.post('/create', TournamentController.createTournament);
tournamentRouter.get('/list', TournamentController.getTournament);
tournamentRouter.put('/update/:tournamentId', TournamentController.editTournament);
tournamentRouter.delete('/delete/:tournamentId', TournamentController.deleteTournament);
tournamentRouter.post('/registration', TournamentController.tournamentRegistration);
tournamentRouter.post('/registration/list', TournamentController.tournamentRegistrationList)
tournamentRouter.post('/registration/count', TournamentController.tournamentRegistrationCount)
tournamentRouter.post('/registration/overall/list', TournamentController.tournamentRegistrationOverallList)
tournamentRouter.post('/update', TournamentController.tournamentUpdate)
tournamentRouter.get('/update/15min', TournamentController.tournament15Min)
tournamentRouter.get('/update/30min', TournamentController.tournament30Min)
tournamentRouter.get('/update/5min', TournamentController.tournament5Min)
tournamentRouter.get('/update/3min', TournamentController.tournament3Min)
tournamentRouter.get('/update/8min', TournamentController.tournament8Min)
tournamentRouter.get('/update/1min', TournamentController.tournament1Min)


module.exports = tournamentRouter;