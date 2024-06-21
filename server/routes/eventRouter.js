const Router = require('express')
const router = new Router()
const EventController = require('../controllers/eventController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('Organizers') ,EventController.create)
router.get('/', EventController.getAll)
router.get('/:id', EventController.getOne)
router.delete('/:id', EventController.del)

module.exports = router
