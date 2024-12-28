const express = require('express');
const categoryRouter = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryRouter.post('/create', CategoryController.createCategory);
categoryRouter.get('/list', CategoryController.getCategories);

module.exports = categoryRouter;