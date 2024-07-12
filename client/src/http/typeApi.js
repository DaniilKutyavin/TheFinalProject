import { $authHost, $host } from ".";

export const createType = async (data) => {
    const response = await $authHost.post('/api/type', data);
    return response.data;
};

export const fetchTypes = async () => {
    const response = await $authHost.get('/api/type');
    return response.data;
};