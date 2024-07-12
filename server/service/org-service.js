const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const OrgDto = require('../dtos/org-dto');
const { Organizers, TokenSchemaOrg } = require('../models/models');

class OrganizersService {
    async registration(email, password, name, short_desc, website, role) {
        if (!email || !password) {
            throw ApiError.badRequest('Некорректный email или password');
        }
        const candidate = await Organizers.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.badRequest('Пользователь с таким email уже существует');
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const org = await Organizers.create({ name, email, role, password: hashPassword, short_desc, website, activationLink });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/organizer/activate/${activationLink}`);

        const orgDto = new OrgDto(org);
        const tokens = tokenService.generateTokens({ ...orgDto });
        await tokenService.saveToken(TokenSchemaOrg, 'organizerId', orgDto.id, tokens.refreshToken);

        return { ...tokens, org: orgDto };
    }

    async activate(activationLink) {
        const org = await Organizers.findOne({ where: { activationLink } });
        if (!org) {
            throw ApiError.badRequest('Неккоректная ссылка активации');
        }

        org.isActivated = true;
        await org.save();
    }

    async login(email, password) {
        const org = await Organizers.findOne({ where: { email } });
        if (!org) {
            throw ApiError.badRequest('Пользователь с таким email не найден');
        }

        const isPassEquals = await bcrypt.compare(password, org.password);
        if (!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль');
        }
        const orgDto = new OrgDto(org);
        const tokens = tokenService.generateTokens({ ...orgDto });
        await tokenService.saveToken(TokenSchemaOrg, 'organizerId', orgDto.id, tokens.refreshToken);

        return { ...tokens, org: orgDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(TokenSchemaOrg, refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const orgData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(TokenSchemaOrg, refreshToken);
        if (!orgData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const org = await Organizers.findByPk(orgData.id);
        const orgDto = new OrgDto(org);
        const tokens = tokenService.generateTokens({ ...orgDto });
        await tokenService.saveToken(TokenSchemaOrg, 'organizerId', orgDto.id, tokens.refreshToken);

        return { ...tokens, org: orgDto };
    }

    async getOneOrgs(organizerId) {
        const orgs = await Organizers.findByPk(organizerId);
        return orgs;
    }

    async updateProfile(organizerId, name, short_desc, website) {
        const organizer = await Organizers.findByPk(organizerId);
        if (!organizer) {
            throw ApiError.badRequest('Организация не найдена');
        }

        organizer.name = name || organizer.name;
        organizer.short_desc = short_desc || organizer.short_desc;
        organizer.website = website || organizer.website;

        await organizer.save();
        return new OrgDto(organizer);
    }
}

module.exports = new OrganizersService();
