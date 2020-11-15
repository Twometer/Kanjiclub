import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: "/lessons",
        name: "Select lessons",
        component: () => import('../views/Lessons.vue')
    },
    {
        path: "/practice",
        name: "Practice",
        component: () => import('../views/Practice.vue')
    },
    {
        path: "/edit",
        name: "Edit",
        component: () => import('../views/Edit.vue')
    },
    {
        path: "/import",
        name: "Import",
        component: () => import('../views/Import.vue')
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import('../views/Profile.vue')
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('../views/Login.vue')
    },
    {
        path: "/register",
        name: "Register",
        component: () => import('../views/Register.vue')
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'active',
    routes
});

export default router;
