import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
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
        return api.post('/users', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateUser(id, data) {
        data.append('_method', 'PUT')

        return api.post(`/users/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteUser(id) {
        return api.delete(`/users/${id}`);
    },
    toggleStatus(id) {
        return api.patch(`/users/${id}/toggle-status`);
    },
};
