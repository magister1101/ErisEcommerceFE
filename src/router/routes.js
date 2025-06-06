const routes = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'highlight/:game', component: () => import('pages/highlightPage.vue') },
      { path: 'cards', component: () => import('src/pages/menu/cardProductPage.vue') },
      { path: 'preOrders', component: () => import('src/pages/menu/cardProductPreOrderPage.vue') },
      { path: 'others', component: () => import('src/pages/menu/otherProductPage.vue') },
      { path: 'login', component: () => import('src/pages/user/loginPage.vue') },
      { path: 'signup', component: () => import('src/pages/user/signupPage.vue') },
      { path: 'cart', component: () => import('src/pages/user/cartPage.vue') },
      { path: 'myProfile', component: () => import('src/pages/user/myProfile.vue') },

    ]
  },
  {
    path: '/secret',
    component: () => import('layouts/blankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/adminLogin.vue') }
    ]
  },

  {
    path: '/admin/',
    component: () => import('layouts/adminLayout.vue'),
    children: [
      { path: 'cardList', component: () => import('pages/admin/cardList.vue') },
      { path: 'config', component: () => import('pages/admin/configPage.vue') },
      { path: 'order', component: () => import('pages/admin/orderPage.vue') },
    ]
  },

  // {
  //   path: '/main',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/IndexPage.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
