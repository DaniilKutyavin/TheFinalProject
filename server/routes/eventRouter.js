const Router = require('express');
const router = new Router();
const EventController = require('../controllers/eventController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/auth-middlewares.js');
const { body } = require('express-validator');

router.post('/', checkRole('Organizers'), EventController.create);
router.get('/', EventController.getAll);
router.get('/active/:id', EventController.fetchActiveEvents);
router.get('/archived/:id', EventController.fetchArchivedEvents);
router.get('/:id', EventController.getOne);
router.delete('/:id', EventController.del);
router.post('/register',
    authMiddleware,
    body('userId').isInt(),
    body('eventId').isInt(),
    EventController.registerUserToEvent
);
router.post('/unregister',
    authMiddleware,
    body('userId').isInt(),
    body('eventId').isInt(),
    EventController.unregisterUserFromEvent
);

router.get('/user/active/:userId', authMiddleware, EventController.fetchActiveEventsForUser);
router.get('/user/archived/:userId', authMiddleware, EventController.fetchArchivedEventsForUser);
router.get('/registrations/:id', EventController.fetchEventRegistrations);

module.exports = router;
