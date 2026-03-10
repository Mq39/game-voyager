import App from '@/App.vue'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'
import Browse from '@/views/Browse.vue'
import Cart from '@/views/Cart.vue'
import Discover from '@/views/Discover.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { title: 'Game Voyager', breadcrumb: 'Home' }
    },

    {
      path: '/discover',
      component: Discover,
      meta: { title: 'Discover', breadcrumb: 'Discover' }
    },

    {
      path: '/browse',
      component: Browse,
      meta: { title: 'Browse', breadcrumb: 'Browse' }
    },

    {
      path: '/cart',
      component: Cart,
      meta: { title: 'Cart', breadcrumb: 'Cart' }
    },

    {
      path: '/login',
      component: Login,
      meta: { title: 'Login', breadcrumb: 'Home' }
    }

  ],
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title}`
  }
})

export default router
