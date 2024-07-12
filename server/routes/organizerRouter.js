const Router = require('express')
const router = new Router()
const organizerController = require('../controllers/organizerController.js')
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middlewares.js')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:8, max:20}),
    organizerController.registration)
router.post('/login', organizerController.login)
router.post('/logout', organizerController.logout)
router.get('/activate/:link', organizerController.activate)
router.post('/refresh', organizerController.refresh)
router.get('/:id', organizerController.getOrganizer)
router.put('/profile', authMiddleware, organizerController.updateProfile);

module.exports = router
