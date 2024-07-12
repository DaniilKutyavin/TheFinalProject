import { $authHost, $host } from ".";

export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type);
    return data;
};

export const fetchTypes = async () => {
    const { data } = await $host.get('api/type');
    return data; 
};

export const createEvent = async (event) => {
    const { data } = await $authHost.post('api/event/', event);
    return data;
};

export const fetchActiveEvents = async ({ organizerId }) => {
    const { data } = await $host.get(`api/event/active/${organizerId}`);
    return data; 
};

export const fetchArchivedEvents = async ({ organizerId }) => {
    const { data } = await $host.get(`api/event/archived/${organizerId}`); 
    return data; 
};

export const getOne = async (eventId) => {
    const { data } = await $host.get(`api/event/` + eventId);
    return data; 
};

export const getAll = async () => {
    const { data } = await $host.get(`api/event/`);
    return data; 
};

export const registerUserToEvent = async (userId, eventId) => {
    const { data } = await $authHost.post('api/event/register', { userId, eventId });
    return data;
};

export const unregisterUserFromEvent = async (userId, eventId) => {
    const { data } = await $authHost.post('api/event/unregister', { userId, eventId });
    return data;
};

export const fetchActiveEventsForUser = async (userId) => {
    const { data } = await $authHost.get(`/api/event/user/active/${userId}`);
    return data;
};

export const fetchArchivedEventsForUser = async (userId) => {
    const { data } = await $authHost.get(`/api/event/user/archived/${userId}`);
    return data;
};

export const fetchEventRegistrations = async (eventId) => {
    const { data } = await $authHost.get(`api/event/registrations/${eventId}`);
    return data;
};