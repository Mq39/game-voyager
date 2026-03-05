import App from '@/App.vue'
import Browse from '@/Browse.vue'
import Cart from '@/Cart.vue'
import Discover from '@/Discover.vue'
import Home from '@/Home.vue'
import Login from '@/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,

      meta: {
        title: 'Game Voyager'
      }
    },

    {
      path: '/discover',
      component: Discover,

      meta: {
        title: 'Discover'
      }
    },

    {
      path: '/browse',
      component: Browse,

      meta: {
        title: 'Browse'
      }
    },

    {
      path: '/cart',
      component: Cart,

      meta: {
        title: 'Cart'
      }
    },

    {
      path: '/login',
      component: Login,

      meta: {
        title: 'Login'
      }
    }

  ],
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title}`
  }
})

export default router
