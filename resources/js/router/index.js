import { createRouter, createWebHistory} from "vue-router";
import UserIndex from "../pages/Users/Index.vue";

const routes = [
    {
        path: '/users',
        name: 'users.index',
        component: UserIndex
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
