
const routes = [
  {
    path: '/devtools',
    component: () => import('layouts/DevToolsLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/DevTools.vue')
      },
      {
        path: 'api',
        component: () => import('pages/DevToolsApiPage.vue')
      },
      {
        path: 'global',
        component: () => import('pages/DevToolsGlobalPage.vue')
      },
      {
        path: 'panel',
        redirect: 'api'
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      }
    ]
  },
  {
    path: '/popup',
    component: () => import('pages/Popup.vue')
  },
  {
    path: '/options',
    component: () => import('pages/Options.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes