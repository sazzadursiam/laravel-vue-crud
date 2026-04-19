import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default {
    getCustomers() {
        return api.get('/customers');
    },
    getCustomer(id) {
        return api.get(`/customers/${id}`);
    },
    createCustomer(data) {
        return api.post('/customers', data);
    },
    updateCustomer(id, data) {
        return api.put(`/customers/${id}`, data);
    },
    deleteCustomer(id) {
        return api.delete(`/customers/${id}`);
    }
}
