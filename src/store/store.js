import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Create from './modules/create.js'
import Login from './modules/login.js'
import Project from './modules/project.js'
import Detail from './modules/detail.js'
import Person from './modules/person.js'
import WareHouse from './modules/warehouse.js'
import Task from './modules/task.js'
import TaskDetail from './modules/taskdetail.js'
import Mark from './modules/mark.js'
import Audit from './modules/audit.js'

export default new Vuex.Store({
  state: {
    privilegeList: []
  },
  mutations: {
    updatePriviledgeList (state, privilegeList) {
      state.privilegeList = privilegeList
    },
    clearPriviledgeList (state) {
      state.privilegeList = []
    }
  },
  actions: {

  },
  modules: {
    login: Login,
    create: Create,
    project: Project,
    detail: Detail,
    person: Person,
    warehouse: WareHouse,
    task: Task,
    taskdetail: TaskDetail,
    mark: Mark,
    audit: Audit
  }
})
