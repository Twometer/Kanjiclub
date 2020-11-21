import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import store from '@/store/index';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: "/words/:strength",
        name: "Words",
        component: () => import('../views/Words.vue')
    },
    {
        path: "/practice/select",
        name: "PracticeSelect",
        component: () => import('../views/PracticeSelect.vue')
    },
    {
        path: "/practice",
        name: "Practice",
        component: () => import('../views/Practice.vue')
    },
    {
        path: "/edit/select",
        name: "EditSelect",
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
        name: "AddLanguage",
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
        component: () => import('../views/Login.vue'),
        meta: { unauthorizedOnly: true }
    },
    {
        path: "/register",
        name: "Register",
        component: () => import('../views/Register.vue'),
        meta: { unauthorizedOnly: true }
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

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.unauthorizedOnly)) {
        // This route is only accessible while not logged in

        if (store.getters.LoggedIn) {
            next({ name: 'Dashboard' })
        } else {
            next()
        }
    } else {
        // This route is only accessible while logged in

        if (!store.getters.LoggedIn) {
            next({ name: 'Login' })
        } else {
            next()
        }
    }
})

export default router;
