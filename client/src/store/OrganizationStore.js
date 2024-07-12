import { makeAutoObservable } from 'mobx';

export default class OrganizationStore {
    constructor() {
        this._isAuth = false;
        this._organization = {};
        makeAutoObservable(this);
        this.loadOrganizationFromLocalStorage();
    }

    setIsAuth(bool) {
        this._isAuth = bool;
        localStorage.setItem('orgIsAuth', JSON.stringify(bool));
    }

    setOrganization(organization) {
        this._organization = organization;
        localStorage.setItem('organization', JSON.stringify(organization));
    }

    loadOrganizationFromLocalStorage() {
        const organization = localStorage.getItem('organization');
        const isAuth = localStorage.getItem('orgIsAuth');

        if (organization) {
            this._organization = JSON.parse(organization);
        }

        if (isAuth) {
            this._isAuth = JSON.parse(isAuth);
        }
    }

    clearOrganization() {
        this._organization = {};
        this._isAuth = false;
        localStorage.removeItem('organization');
        localStorage.removeItem('orgIsAuth');
    }

    get isAuth() {
        return this._isAuth;
    }

    get organization() {
        return this._organization;
    }
}
