import { RouteLocationNormalized } from 'vue-router'
import { Cookies } from 'quasar';
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        beforeEnter: (to: RouteLocationNormalized) => {
          if(to.query?.api){
            Cookies.set('apiUrl', to.query.api as string, {
              expires: 60 * 60 * 24 * 14,
              path: '/',
            });
            return { path: to.path, query: {}, hash: to.hash }
          }
          return true;
        },
      },
      {
        path: '/settings',
        component: () => import('pages/settings.vue'),
      },
      {
        path: '/model/:model',
        component: () => import('pages/model/index.vue'),
        children: [
          {
            path: ':role',
            component: () => import('pages/model/role.vue'),
            children: [
              {
                path: ':type',
                component: () => import('pages/model/type.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth/',
    component: () => import('layouts/auth.vue'),
    children: [{ path: 'login', component: () => import('pages/login.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
