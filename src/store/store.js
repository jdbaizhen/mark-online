import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Create from './modules/create.js'
import Login from './modules/login.js'

export default new Vuex.Store({
  state: {
    /** 
     * 全局主题配置
    */
    theme_switch: true, // true表示亮色
    theme_light: {
      background: '#fff',
      color: '#000'
    },
    theme_dark: {
      background: '#000',
      color: '#fff'
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {
    login: Login,
    create: Create
  }
})
