import Vue from 'vue'
import Router from 'vue-router'
import {router} from './constants'

import index from '../modules/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: router.index,
      component: index
    }
  ]
})
