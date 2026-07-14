import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import BonusView from '@/views/BonusView.vue';
import PurchasesView from '@/views/PurchasesView.vue';
import ProfileView from '@/views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/bonus',
      name: 'bonus',
      component: BonusView,
      meta: { requiresAuth: true },
    },
    {
      path: '/purchases',
      name: 'purchases',
      component: PurchasesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/bonus',
    },
  ],
});

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login';
  }

  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return '/bonus';
  }

  return true;
});

export default router;
