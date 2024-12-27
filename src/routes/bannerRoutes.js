const express = require('express');
const bannerRouter = express.Router();
const BannerController = require('../controller/BannerController');

bannerRouter.post('/add-banner', BannerController.createBanner);

module.exports = bannerRouter;