import { $authHost, $host } from ".";
import {jwtDecode} from "jwt-decode"; 

export const registrationOrg = async (name, email, password) => {
    try {
        const { data } = await $host.post('api/organizer/registration', { name, email, password });
        localStorage.setItem('accessToken', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginOrg = async (email, password) => {
    try {
        const { data } = await $host.post('api/organizer/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const checkOrg = async () => {
    try {
        const { data } = await $authHost.post('api/organizer/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (error) {
        console.error('Error during token refresh:', error);
        throw error;
    }
};

export const logoutOrg = async () => {
    try {
        await $authHost.post('api/organizer/logout');
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const updateProfileOrg = async (name, short_desc, website) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('short_desc', short_desc);
    formData.append('website', website);

    try {
        const { data } = await $authHost.put('api/organizer/profile', formData);
        return data;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const getOrganization = async (organizationId) => {
    const { data } = await $host.get(`api/organizer/${organizationId}`);
    return data;
};