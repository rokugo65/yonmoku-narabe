import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SelectRoom from '@/components/SelectRoom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/SelectRoom',
      name: 'SelectRoom',
      component: SelectRoom
    },
  ]
})
