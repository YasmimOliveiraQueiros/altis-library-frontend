import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },

  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'editoras', component: () => import('@/pages/PublisherPage.vue') },
      { path: 'livros', component: () => import('@/pages/BooksPage.vue') },
      { path: 'alugueis', component: () => import('@/pages/LoansPage.vue') },
      { path: 'usuarios', component: () => import('@/pages/UserPage.vue') },
    ],
  },

  {
    path: '/login',
    component: () => import('@/pages/Auth/Login.vue'),
  },

  {
    path: '/cadastro',
    component: () => import('@/pages/Auth/Register.vue'),
  },

  {
    path: '/recuperar-senha',
    component: () => import('@/pages/Auth/PasswordRecovery.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
