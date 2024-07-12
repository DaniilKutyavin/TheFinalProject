const TypeService = require('../service/type-service.js');
const ApiError = require('../error/ApiError.js');

class TypeController {
    async create(req, res, next) {
        try {
            const types = await TypeService.createType(req.body);
            return res.json(types);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await TypeService.getAllTypes();
            return res.json(types);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const type = await TypeService.getTypeById(req.params.id);
            return res.json(type);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async del(req, res, next) {
        try {
            const type = await TypeService.deleteType(req.params.id);
            return res.json(type);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new TypeController();
