import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: 'usuarios', component: () => import('@/pages/UserPage.vue') },
      { path: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'alugueis', component: () => import('@/pages/LoansPage.vue') },
      { path: 'livros', component: () => import('@/pages/BooksPage.vue') },
      { path: 'editoras', component: () => import('@/pages/PublisherPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;