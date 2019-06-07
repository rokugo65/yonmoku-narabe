import Vue from 'vue'
import Router from 'vue-router'
import Top from '@/components/Top'
import Room from '@/components/Room'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top
    },
    {
      path: '/Room',
      name: 'Room',
      component: Room
    },
  ]
})
