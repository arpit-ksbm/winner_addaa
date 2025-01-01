const express = require('express');
const categoryRouter = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryRouter.post('/create', CategoryController.createCategory);
categoryRouter.get('/list', CategoryController.getCategories);
categoryRouter.get('/getCategory/:id', CategoryController.getCategoryById);
categoryRouter.put('/update/:id', CategoryController.updateCategory);
categoryRouter.delete('/delete/:id', CategoryController.deleteCategory);

module.exports = categoryRouter;