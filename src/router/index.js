import Vue from 'vue'
import Router from 'vue-router'

import index from '../modules/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index
    }
  ]
})
