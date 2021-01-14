import DashBoard from '@/views/DashBoard.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'dash-board',
        component: DashBoard,
        meta: {
            title: 'Ometer'
        }
    },
    // {
    //     path: '/setup',
    //     name: 'Setup',
    //     component: () => import(
    //         /* webpackChunkName: "setup" */ '@/views/Setup.vue'
    //     )
    // }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.afterEach((to, _) => {
    Vue.nextTick(() => {
        document.title = to.meta.title;
    });
});

export default router;
