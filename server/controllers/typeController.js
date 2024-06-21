const {Types} = require('../models/models.js')
const ApiError = require('../error/ApiError.js');

class TypeController{
    async create(req, res, next) {
        try {
            const {type_name, type_color} = req.body
            const types = await Types.create({type_name, type_color})
            return res.json(types)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let type
            type = await Types.findAndCountAll()
            return res.json(type)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const type = await Types.findOne({where:{id}})
            return res.json(type)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async del(req, res, next) {
        try {
            const {id} = req.params
            const type = await Types.findByIdAndDelete(id)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new TypeController()