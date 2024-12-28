const router = require("express").Router();
const userRoutes = require('./userRoutes')
const playerRoutes = require('./playerRoutes');
const authRouter = require("./authRoutes");
const tournamentRouter = require("./tournamentRoutes");
const bannerRouter = require("./bannerRoutes");
const categoryRouter = require("./categoryRoutes");
const notficatioRouter = require("./notifictionRoutes");
const webRouter = require("./webRoutes");
const apiRouter = require("./apiRoutes");

router.use('/user', userRoutes)
router.use('/player', playerRoutes)
router.use('/auth', authRouter)
router.use('/tournament', tournamentRouter)
router.use('/banner', bannerRouter)
router.use('/category', categoryRouter)
router.use('/notification', notficatioRouter)
router.use('/', webRouter)
router.use('/', apiRouter)

module.exports = router;