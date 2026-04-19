import { createRouter, createWebHistory } from 'vue-router';
import UserIndex from '../pages/Users/Index.vue';
import CustomerIndex from '../pages/Customers/Index.vue';

const routes = [
    {
        path: '/',
        name: 'users.index',
        component: UserIndex,
    },
    {
        path: '/customers',
        name: 'customers.index',
        component: CustomerIndex,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
