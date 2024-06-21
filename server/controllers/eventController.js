const {Event} = require('../models/models.js')
const ApiError = require('../error/ApiError.js');
const uuid = require('uuid')
const path = require('path')

class EventController{
    async create(req, res, next) {
        try {
            const {title, description, url, regform, price, date_time, locate, coordinates,time_start,time_end, organizerId, typeId} = req.body
            const {photo} = req.files
            let fileName = uuid.v4() + ".jpg"
            photo.mv(path.resolve(__dirname, '..', 'static', fileName))
            const event = await Event.create({title, description, photo:fileName, url, regform, price, date_time, locate, coordinates,time_start,time_end, organizerId, typeId})
            return res.json(event)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        try {
            let {organizerId, typeId} = req.query
            let event
            if(!organizerId && !typeId){
                event = await Event.findAndCountAll()
            }

            if(organizerId && !typeId){
                event = await Event.findAndCountAll({where:{organizerId}})
            }

            if(!organizerId && typeId){
                event = await Event.findAndCountAll({where:{typeId}})
            }

            if(organizerId && typeId){
                event = await Event.findAndCountAll({where:{typeId, organizerId}})
            }
            
            return res.json(event)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params
            const event = await Event.findOne({where:{id}})
            return res.json(event)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async del(req, res, next) {
        try {
            const {id} = req.params
            const event = await Event.findByIdAndDelete(id)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new EventController()