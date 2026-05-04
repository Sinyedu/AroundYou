import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import CreateContentView from '../views/CreateContentView.vue'
import { useAuthService } from '@/api/authService'
import ContentPlaceholderView from '../views/CreateContentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },

    { path: '/auth/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },

    { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
    {
      path: '/city/:cityName',
      name: 'single-city',
      component: () => import('../views/SingleCityView.vue'),
    },
    {
      path: '/user/user-profile',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/create',
      name: 'create',
      component: CreateContentView,
      meta: { requiresAuth: true },
    },

    {
      path: '/contact',
      name: 'contact',
      component: ContentPlaceholderView,
    },

    {
      path: '/settings',
      name: 'settings',
      component: ContentPlaceholderView,
      meta: { requiresAuth: true },
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true },
    },

    {
      path: '/map/mapview',
      name: 'mapview',
      component: () => import('../views/MapView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthService()

  if (!to.meta.requiresAuth && !to.meta.requiresAdmin) {
    return true
  }

  const isValidSession = await auth.checkSession()
  if (!isValidSession) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin.value) {
    return { name: 'home' }
  }

  return true
})

export default router
