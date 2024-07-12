const ApiError = require('../error/ApiError.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Organizers} = require('../models/models.js')
const orgService = require('../service/org-service.js')
const {validationResult} = require('express-validator')

class OrganizersController{
    async registration(req, res, next) {
       try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, name,short_desc, website, role} = req.body
            const orgData = await orgService.registration(email, password, name,short_desc, website, role) 
            res.cookie('refreshToken', orgData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(orgData)
       } catch (e) {
            next(e)
       }

    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const orgData  = await orgService.login(email, password)
            res.cookie('refreshToken', orgData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(orgData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await orgService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
       try {
            const {refreshToken} = req.cookies
            const orgData  = await orgService.refresh(refreshToken)
            res.cookie('refreshToken', orgData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(orgData)
       } catch (e) {
            next(e)
       } 
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await orgService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)         
        } catch (e) {
            next(e)
        } 
     }
    

    async getOrganizer(req, res, next) {
        try {
            const orgs = await orgService.getOneOrgs(req.params.id);
            return res.json(orgs);
        } catch (e) {
            next(e)
        }
    }

    async updateProfile(req, res, next) {
        try {
            const organizerId = req.user.id; 
            const { name, short_desc, website } = req.body;

            const updatedOrganizer = await orgService.updateProfile(organizerId, name, short_desc, website);

            return res.json(updatedOrganizer);
        } catch (e) {
            next(e);
        }
    }
}
module.exports = new OrganizersController()