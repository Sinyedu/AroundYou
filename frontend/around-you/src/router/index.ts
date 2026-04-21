import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import ContentPlaceholderView from '../views/ContentPlaceholderView.vue'
import { hasAdminAccess } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
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
        description:
          'Denne side kan bruges til at oprette nye attraktioner, events eller lokationer, når formularflowet er klar.',
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContentPlaceholderView,
      props: {
        title: 'Kontakt Around You',
        description:
          'Brug denne side til supportoplysninger, kontaktformular og samarbejdshenvendelser.',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: ContentPlaceholderView,
      props: {
        title: 'Indstillinger',
        description:
          'Her kan du samle kontoindstillinger, præferencer og notifikationsvalg for den aktive bruger.',
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true },
    },
    //This path is just only for visual and testing purposes
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
