import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/Login.vue'
import Main from './views/main/Main.vue'
import Mark from './views/mark/Mark.vue'
import Audit from './views/mark/Audit.vue'
import Create from './views/create/Create.vue'
import Account from './views/account/Account.vue'
import ProjectIndex from './views/project/Index.vue'
import ProjectList from './views/project/pages/ProjectList.vue'
import ProjectDetail from './views/project/pages/Detail.vue'
import ProjectTask from './views/project/pages/Task.vue'
import ProjectTaskDetail from './views/project/pages/TaskDetail.vue'
import ProjectStatistics from './views/project/pages/Statistics.vue'
import ProjectPerson from './views/project/pages/Person.vue'
import ProjectWarehouse from './views/project/pages/Warehouse.vue'

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
          path: '/main/audit',
          name: 'audit',
          component: Audit
        },
        {
          path: '/main/project/list', 
          name: 'projectlist', 
          component: ProjectList
        },
        {
          path: '/main/project',
          name: 'projectindex',
          component: ProjectIndex,
          children: [
            {path: '/main/project/detail', name: 'projectdetail', component: ProjectDetail},
            {path: '/main/project/task', name: 'projecttask', component: ProjectTask},
            {path: '/main/project/taskdetail', name: 'projecttaskdetail', component: ProjectTaskDetail},
            {path: '/main/project/statistics', name: 'projectstatistics', component: ProjectStatistics},
            {path: '/main/project/person', name: 'projectperson', component: ProjectPerson},
            {path: '/main/project/warehouse', name: 'projectwarehouse', component: ProjectWarehouse},
          ]
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
        }
      ]
    }
  ]
})
