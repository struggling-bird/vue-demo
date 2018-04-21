/*
 * @Author: kangpeng
 * @Date: 2017-11-21 16:27:54
 * @Last Modified by: kangpeng
 * 导出vuex 的 store
 */
import Vue from 'vue'
import Vuex from 'vuex'

import demo from './modules/demo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    demo
  }
})
