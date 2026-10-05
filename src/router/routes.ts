import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'editoras', component: () => import('@/pages/PublisherPage.vue') },
      { path: 'livros', component: () => import('@/pages/BooksPage.vue') },
      { path: 'alugueis', component: () => import('@/pages/LoansPage.vue') },
      { path: 'usuarios', component: () => import('@/pages/UserPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;