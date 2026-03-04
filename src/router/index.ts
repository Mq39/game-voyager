import App from '@/App.vue'
import Browse from '@/Browse.vue'
import Discover from '@/Discover.vue'
import Home from '@/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,

      meta: {
        title: 'Home'
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
    }

  ],
})

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title}`
  }
})

export default router
