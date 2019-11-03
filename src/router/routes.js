
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
        path: 'panel',
        component: () => import('pages/DevToolsPanel.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/DevToolsLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      }
    ]
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
