import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default {
    getUsers(params = {}) {
        return api.get('/users', { params });
    },
    getUser(id) {
        return api.get(`/users/${id}`);
    },
    createUser(data) {
        return api.post('/users', data);
    },
    updateUser(id, data) {
        return api.put(`/users/${id}`, data);
    },
    deleteUser(id) {
        return api.delete(`/users/${id}`);
    },
};
