import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/userStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/login",
            name: "login",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/LoginView.vue"),
        },
    ],
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.name !== "login" && !userStore.loggedIn) {
        return next({ name: "login" });
    } else if (to.name == "login" && userStore.loggedIn) {
        return next({ name: "home" });
    }

    next();
});

export default router;
