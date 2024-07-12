const EventService = require('../service/event-service.js');
const ApiError = require('../error/ApiError.js');
const { validationResult } = require('express-validator');
const { Event_Reg } = require('../models/models.js');

class EventController {
    async create(req, res, next) {
        try {
            const event = await EventService.createEvent(req.body, req.files.photo);
            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const events = await EventService.fetchActiveAllEvents(req.query);
            return res.json(events);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const event = await EventService.getEventById(req.params.id);
            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async del(req, res, next) {
        try {
            const event = await EventService.deleteEvent(req.params.id);
            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async fetchActiveEvents(req, res, next) {
        try {
            const events = await EventService.fetchActiveEvents(req.params.id);
            return res.json(events);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async fetchArchivedEvents(req, res, next) {
        try {
            const events = await EventService.fetchArchivedEvents(req.params.id);
            return res.json(events);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async registerUserToEvent(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Validation error', errors.array()));
            }
            const { userId, eventId } = req.body;
            const registration = await EventService.registerUserToEvent(userId, eventId);
            return res.json(registration);
        } catch (e) {
            next(e);
        }
    }

    async unregisterUserFromEvent(req, res, next) {
        try {
            const { userId, eventId } = req.body;
            const unregistration = await EventService.unregisterUserFromEvent(userId, eventId);
            return res.json(unregistration);
        } catch (e) {
            next(e);
        }
    }

    async fetchActiveEventsForUser(req, res, next) {
        try {
            const events = await EventService.fetchActiveEventsForUser(req.params.userId);
            return res.json(events);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async fetchArchivedEventsForUser(req, res, next) {
        try {
            const events = await EventService.fetchArchivedEventsForUser(req.params.userId);
            return res.json(events);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async fetchEventRegistrations(req, res, next) {
        try {
            const eventId = req.params.id;
            const registrations = await Event_Reg.findAll({ where: { eventId } });
            return res.json(registrations);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new EventController();
