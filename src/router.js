import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/Login.vue'
import Main from './views/main/Main.vue'
import Mark from './views/mark/MarkPage.vue'
import Project from './views/project/Project.vue'
import Create from './views/project/Create.vue'
import Account from './views/account/Account.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login, 
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/main/mark',
          name: 'mark',
          component: Mark
        },
        {
          path: '/main/project',
          name: 'project',
          component: Project
        },
        {
          path: '/main/create_project',
          name: 'create',
          component: Create
        },
        {
          path: '/main/account',
          name: 'account',
          component: Account
        },
      ]
    }
  ]
})
