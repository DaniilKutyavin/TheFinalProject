const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING }
});

const Organizers = sequelize.define('organizers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    short_desc: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "Organizers" },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING }
});

const Types = sequelize.define('types', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type_name: { type: DataTypes.STRING },
    type_color: { type: DataTypes.STRING }
});

const Event = sequelize.define('event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    date_time: { type: DataTypes.DATEONLY, allowNull: false },
    locate: { type: DataTypes.STRING, allowNull: false },
    capacityAll: { type: DataTypes.INTEGER, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    coordinates: { type: DataTypes.STRING, allowNull: false },
    time_start: { type: DataTypes.TIME, allowNull: false },
    time_end: { type: DataTypes.TIME, allowNull: false }
});

const Event_Reg = sequelize.define('event_reg', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const TokenSchema = sequelize.define('token_schema', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.TEXT, require: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

const TokenSchemaOrg = sequelize.define('token_org_schema', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.TEXT, require: true },
    organizerId: { type: DataTypes.INTEGER, allowNull: false }
});

// Ассоциации
Organizers.hasMany(Event, { foreignKey: 'organizerId' });
Event.belongsTo(Organizers, { foreignKey: 'organizerId' });

Types.hasMany(Event, { foreignKey: 'typeId' });
Event.belongsTo(Types, { foreignKey: 'typeId' });

Event.belongsToMany(User, { through: Event_Reg, foreignKey: 'eventId' });
User.belongsToMany(Event, { through: Event_Reg, foreignKey: 'userId' });

User.hasOne(TokenSchema, { foreignKey: 'userId' });
TokenSchema.belongsTo(User, { foreignKey: 'userId' });

Organizers.hasOne(TokenSchemaOrg, { foreignKey: 'organizerId' });
TokenSchemaOrg.belongsTo(Organizers, { foreignKey: 'organizerId' });

// Ассоциация Event_Reg с Event
Event.hasMany(Event_Reg, { foreignKey: 'eventId' });
Event_Reg.belongsTo(Event, { foreignKey: 'eventId' });

// Ассоциация Event_Reg с User
User.hasMany(Event_Reg, { foreignKey: 'userId' });
Event_Reg.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Organizers,
    Event,
    Types,
    Event_Reg,
    TokenSchema,
    TokenSchemaOrg
};
