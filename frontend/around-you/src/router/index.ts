import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/auth/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
    },
    {
      path: "/user/user-profile",
      name: "user-profile",
      component: () => import("../views/UserProfileView.vue"),
    },
  ],
})

export default router
