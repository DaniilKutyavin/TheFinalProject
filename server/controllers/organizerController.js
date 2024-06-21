const ApiError = require('../error/ApiError.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Organizers} = require('../models/models.js')

const generateJwt = (id , name, email, role, short_desc, website) => {
    return jwt.sign( {id, name, email, role, short_desc, website}, process.env.SECRET_KEY, {expiresIn:'24h'})
}

class OrganizerController{
    async registration(req, res, next) {
        const {name, email, password, role, short_desc, website} = req.body
        if (!email || !password){
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await Organizers.findOne({where:{email}})
        if (candidate){
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const org = await Organizers.create({name, email, short_desc, website, role, password: hashPassword})
        const token = generateJwt(org.id, org.name, org.email, org.short_desc, org.website, org.role)
        return res.json({token})

    }
    async login(req, res, next) {
        const {email, password} = req.body
        const org = await User.findOne({where:{email}})
        if(!org){
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, org.password)
        if(!comparePassword){
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(org.id, org.name, org.email, org.short_desc, org.website, org.role)
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJwt(req.org.id, req.org.name, req.org.email, req.org.short_desc, req.org.website, req.org.role)
        return res.json({token})
    }
}
module.exports = new OrganizerController()