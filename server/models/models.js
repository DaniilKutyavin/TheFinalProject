const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type: DataTypes.STRING},
    email:{type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING},
    role:{type: DataTypes.STRING, defaultValue:"USER"},

})

const Organizers = sequelize.define('organizers', {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type: DataTypes.STRING},
    email:{type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING},
    short_desc:{type: DataTypes.STRING},
    website:{type: DataTypes.STRING},
    role:{type: DataTypes.STRING, defaultValue:"Organizers"},

})

const Types = sequelize.define('types', {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    type_name:{type: DataTypes.STRING},
    type_color:{type: DataTypes.STRING},
})

const Event = sequelize.define('event', {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    title:{type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING , allowNull: false},
    photo:{type: DataTypes.STRING},
    url:{type: DataTypes.STRING},
    regform:{type: DataTypes.STRING},
    price:{type: DataTypes.INTEGER, allowNull: false},
    date_time:{type: DataTypes.STRING, allowNull: false},
    locate:{type: DataTypes.STRING, allowNull: false},
    coordinates:{type: DataTypes.STRING, allowNull: false},
    time_start:{type: DataTypes.TIME, allowNull: false},
    time_end:{type: DataTypes.TIME, allowNull: false},
})

const Event_Reg = sequelize.define('event_reg', {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
})

Organizers.hasMany(Event)
Event.belongsTo(Organizers)

Types.hasMany(Event)
Event.belongsTo(Types)

Event.belongsToMany(User, {through: Event_Reg})
User.belongsToMany(Event, {through: Event_Reg})

module.exports = { 
    User,
    Organizers,
    Event,
    Types,
    Event_Reg
}