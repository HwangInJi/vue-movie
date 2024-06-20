import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import SearchView from '@/views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movie/:id',
      name: 'about',
      component: AboutView,
      drops: true
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      props: (route) => ({ query: route.query.q })
    }
  ]
})

export default router
