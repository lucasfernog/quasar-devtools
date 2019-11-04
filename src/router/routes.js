
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
        component: () => import('pages/DevToolsApiPanel.vue')
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
