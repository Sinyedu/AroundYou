import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import ContentPlaceholderView from '../views/CreateContentView.vue'
import { hasAdminAccess } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/user/user-profile',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
    },

    {
      path: '/create',
      name: 'create',
      component: ContentPlaceholderView,
      props: {
        title: 'Tilføj nye oplevelser',
        description: 'Opret attraktioner, events eller lokationer.',
      },
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

router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !hasAdminAccess()) {
    return { name: 'home' }
  }

  return true
})

export default router
