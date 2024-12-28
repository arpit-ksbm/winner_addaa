const express = require('express');
const webRouter = express.Router();
const TeenPattiContrller= require('../controller/TeenPattiContrller');

webRouter.post('/teenpatti/add', TeenPattiContrller.createTeenPattiTable);
webRouter.get('/teenpatti/list', TeenPattiContrller.getTeenPattiTable);
webRouter.get('/teenpatti/edit/:teen_patti_id', TeenPattiContrller.updateTeenPattiTable);
webRouter.get('/teenpatti/delete/:teen_patti_id', TeenPattiContrller.deleteTeenPattiTable);

module.exports = webRouter;