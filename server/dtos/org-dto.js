module.exports = class OrgDto {
    name;
    email;
    id;
    short_desc;
    website;
    isActivated;
    role;

    constructor(model){
        this.name = model.name
        this.email = model.email
        this.id = model.id
        this.short_desc = model.short_desc
        this.website = model.website
        this.isActivated = model.isActivated
        this.role = model.role
    }
}