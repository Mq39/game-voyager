import Browse from '@/views/Browse.vue'
import Cart from '@/views/Cart.vue'
import Discover from '@/views/Discover.vue'
import Game from '@/views/Game.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
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
      meta: { title: 'Login', breadcrumb: 'Login' }
    },

    {
      path: '/register',
      component: Register,
      meta: { title: 'Register', breadcrumb: 'Register' }
    },

    {
      path: '/games/:id',
      component: Game,
      meta: { title: "Game Details", breadcrumb: [] }
    },

  ],
})

router.afterEach((to) => {
  const defaultTitle = "Game Voyager"

  if (typeof to.meta.title === "string" && to.meta.title.trim()) {
    document.title = to.meta.title
  } else {
    document.title = defaultTitle
  }
})

export default router
