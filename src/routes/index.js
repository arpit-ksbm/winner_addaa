const router = require("express").Router();
const userRoutes = require('./userRoutes')
const playerRoutes = require('./playerRoutes')

router.use('/user', userRoutes)
router.use('/player', playerRoutes)

module.exports = router;