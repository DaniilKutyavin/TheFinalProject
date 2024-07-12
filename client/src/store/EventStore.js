import { makeAutoObservable } from 'mobx';
import { fetchTypes, fetchActiveEvents, fetchArchivedEvents, getOne, getAll } from '../http/eventApi'; 

export default class EventStore {
    constructor() {
        this._types = [];
        this._events = [];
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setEvents(events) {
        this._events = events;
    }

    async loadTypes() {
        const types = await fetchTypes();
        this.setTypes(types);
    }

    async loadActiveEvents(organizerId) {
        const events = await fetchActiveEvents({ organizerId });
        this.setEvents(events);
    }
    async loadActiveAllEvents(organizerId) {
        const events = await getAll();
        this.setEvents(events);
    }


    async loadArchivedEvents(organizerId) {
        const events = await fetchArchivedEvents({ organizerId });
        this.setEvents(events);
    }

    get types() {
        return this._types;
    }

    get events() {
        return this._events;
    }
}
