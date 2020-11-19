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
        path: "/practice/select",
        name: "Select lessons to practice",
        component: () => import('../views/PracticeSelect.vue')
    },
    {
        path: "/practice",
        name: "Practice",
        component: () => import('../views/Practice.vue')
    },
    {
        path: "/edit/select",
        name: "Select lessons to edit",
        component: () => import('../views/EditSelect.vue')
    },
    {
        path: "/edit/:lessonId",
        name: "Edit",
        component: () => import('../views/Edit.vue')
    },
    {
        path: "/import",
        name: "Import",
        component: () => import('../views/Import.vue')
    },
    {
        path: "/language",
        name: "Add language",
        component: () => import('../views/AddLanguage.vue')
    },
    {
        path: "/settings",
        name: "Settings",
        component: () => import('../views/Settings.vue')
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
    {
        path: "*",
        name: "NotFound",
        component: () => import('../views/PageNotFound.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'active',
    routes
});

export default router;
