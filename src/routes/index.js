const router = require("express").Router();
const userRoutes = require('./userRoutes')
const playerRoutes = require('./playerRoutes');
const authRouter = require("./authRoutes");
const tournamentRouter = require("./tournamentRoutes");
const bannerRouter = require("./bannerRoutes");

router.use('/user', userRoutes)
router.use('/player', playerRoutes)
router.use('/auth', authRouter)
router.use('/tournament', tournamentRouter)
router.use('/banner', bannerRouter)

module.exports = router;