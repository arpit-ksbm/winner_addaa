const express = require('express');
const webRouter = express.Router();
const TeenPattiContrller= require('../controller/TeenPattiContrller');
const CouponController = require('../controller/CouponController');
const TrasactionController = require('../controller/TransactionController');

webRouter.post('/teenpatti/add', TeenPattiContrller.createTeenPattiTable);
webRouter.get('/teenpatti/list', TeenPattiContrller.getTeenPattiTable);
webRouter.get('/teenpatti/edit/:teen_patti_id', TeenPattiContrller.updateTeenPattiTable);
webRouter.get('/teenpatti/delete/:teen_patti_id', TeenPattiContrller.deleteTeenPattiTable);

//coupon
webRouter.post('/coupon/create', CouponController.createCoupon);
webRouter.get('/coupon/list', CouponController.couponList);
webRouter.post('/coupon/update/:id', CouponController.updateCoupon);
webRouter.delete('/coupon/delete/:id', CouponController.deleteCoupon);
webRouter.post('/transaction/gst-tds', TrasactionController.storeGstTds);


module.exports = webRouter;