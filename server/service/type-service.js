const { Types } = require('../models/models.js');

class TypeService {
    async createType(data) {
        const { type_name, type_color } = data;
        const types = await Types.create({ type_name, type_color });
        return types;
    }

    async getAllTypes() {
        const types = await Types.findAll();
        return types;
    }

    async getTypeById(id) {
        const type = await Types.findOne({ where: { id } });
        return type;
    }

    async deleteType(id) {
        const type = await Types.destroy({ where: { id } });
        return type;
    }
}

module.exports = new TypeService();
