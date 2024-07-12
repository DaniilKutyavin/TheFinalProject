import { makeAutoObservable } from 'mobx';

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this);
        this.loadUserFromLocalStorage();
    }

    setIsAuth(bool) {
        this._isAuth = bool;
        localStorage.setItem('userIsAuth', JSON.stringify(bool));
    }

    setUser(user) {
        this._user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    loadUserFromLocalStorage() {
        const user = localStorage.getItem('user');
        const isAuth = localStorage.getItem('userIsAuth');

        if (user) {
            this._user = JSON.parse(user);
        }

        if (isAuth) {
            this._isAuth = JSON.parse(isAuth);
        }
    }

    clearUser() {
        this._user = {};
        this._isAuth = false;
        localStorage.removeItem('user');
        localStorage.removeItem('userIsAuth');
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }
}
