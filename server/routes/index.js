const Router = require('express')
const router = new Router()
const eventRouter = require('./eventRouter')
const organizerRouter = require('./organizerRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/event', eventRouter)
router.use('/organizer', organizerRouter)

module.exports = router
