const Router = require('express')
const router = new Router()
const OrganizerController = require('../controllers/organizerController')
const authMiddleware = require('../middleware/authMiddleware.js')

router.post('/registration', OrganizerController.registration)
router.post('/login', OrganizerController.login)
router.get('/auth', authMiddleware, OrganizerController.check)

module.exports = router
