const { Event, Event_Reg, User } = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError.js');

class EventService {
    async createEvent(data, photo) {
        const { title, description, price, date_time, locate, coordinates, time_start, time_end, organizerId, typeId, capacity, capacityAll} = data;
        let fileName = uuid.v4() + ".jpg";
        photo.mv(path.resolve(__dirname, '..', 'static', fileName));
        const event = await Event.create({ title, description, photo: fileName, price, date_time, locate, coordinates, time_start, time_end, organizerId, typeId,capacity, capacityAll });
        return event;
    }

    async getEventById(id) {
        const event = await Event.findOne({ where: { id } });
        return event;
    }

    async deleteEvent(id) {
        const event = await Event.destroy({ where: { id } });
        return event;
    }

    async fetchActiveEvents(organizerId) {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
    
        const events = await Event.findAll({
            where: {
                organizerId,
                [Op.and]: [
                    { date_time: { [Op.gte]: currentDate } },
                    { 
                        [Op.or]: [
                            { date_time: { [Op.gt]: currentDate } }, 
                            { 
                                date_time: currentDate, 
                                time_start: { [Op.gte]: currentTime } 
                            }
                        ]
                    }
                ]
            }
        });
        return events;
    }

    async fetchActiveAllEvents() {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
    
        const events = await Event.findAll({
            where: {
                [Op.and]: [
                    { date_time: { [Op.gte]: currentDate } },
                    { 
                        [Op.or]: [
                            { date_time: { [Op.gt]: currentDate } }, 
                            { 
                                date_time: currentDate, 
                                time_start: { [Op.gte]: currentTime } 
                            }
                        ]
                    }
                ]
            }
        });
        return events;
    }

    async fetchArchivedEvents(organizerId) {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        const events = await Event.findAll({
            where: {
                organizerId,
                [Op.or]: [
                    { date_time: { [Op.lt]: currentDate } }, 
                    { 
                        date_time: currentDate, 
                        time_start: { [Op.lt]: currentTime } 
                    }
                ]
            }
        });
        return events;
    }

    async registerUserToEvent(userId, eventId) {
        if (!userId || !eventId) {
            throw ApiError.badRequest('User ID and Event ID are required');
        }

        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);
        
        if (!user || !event) {
            throw ApiError.badRequest('User or Event not found');
        }

        if (event.capacity <= 0) {
            throw ApiError.badRequest('Нет доступных мест для регистрации');
        }
        
        const registration = await Event_Reg.create({ userId, eventId });

        await Event.update(
            { capacity: event.capacity - 1 },
            { where: { id: eventId } }
        );

        return registration;
    }

    async unregisterUserFromEvent(userId, eventId) {
        if (!userId || !eventId) {
            throw ApiError.badRequest('User ID and Event ID are required');
        }
    
        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);
    
        if (!user || !event) {
            throw ApiError.badRequest('User or Event not found');
        }
    
        const registration = await Event_Reg.findOne({ where: { userId, eventId } });
        if (!registration) {
            throw ApiError.badRequest('User is not registered for this event');
        }
    
        await registration.destroy();

      
        await Event.update(
            { capacity: event.capacity + 1 },
            { where: { id: eventId } }
        );

        return { message: 'User unregistered successfully' };
    }


    async fetchActiveEventsForUser(userId) {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        const events = await Event.findAll({
            include: [{
                model: Event_Reg,
                where: { userId }
            }],
            where: {
                [Op.and]: [
                    { date_time: { [Op.gte]: currentDate } },
                    { 
                        [Op.or]: [
                            { date_time: { [Op.gt]: currentDate } }, 
                            { 
                                date_time: currentDate, 
                                time_start: { [Op.gte]: currentTime } 
                            }
                        ]
                    }
                ]
            }
        });
        return events;
    }

    async fetchArchivedEventsForUser(userId) {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        const events = await Event.findAll({
            include: [{
                model: Event_Reg,
                where: { userId }
            }],
            where: {
                [Op.or]: [
                    { date_time: { [Op.lt]: currentDate } }, 
                    { 
                        date_time: currentDate, 
                        time_start: { [Op.lt]: currentTime } 
                    }
                ]
            }
        });
        return events;
    }
    
}

module.exports = new EventService();
