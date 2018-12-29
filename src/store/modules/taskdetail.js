import { axiosFormat, dataFormat, getSession } from '@/utils/util.js'
import URL from '@/api/taskdetail.js'

const TaskDetail = {
  state: {
    loading: false,
    searchInfo: {
      pageIndex: 1,
      pageSize: 10,
      taskId: '',
      projectId: '',
      taskDetailStatusId: ''
    },
    pageCount: 10,
    taskDetailStatusList: []
  },
  mutations: {
    updateTaskDetailLoading (state) {
      state.loading = !state.loading
    },
    /**
     * 更新searchInfo的数据
     */
    updateTaskId (state, taskId) {
      state.searchInfo.taskId = taskId
    },
    updateTaskDetailProjectId (state) {
      let projectId = getSession('projectId')
      state.searchInfo.projectId = projectId
    },
    updateTaskDetailStatusId (state, taskDetailStatusId) {
      state.searchInfo.taskDetailStatusId = taskDetailStatusId
    },
    updateTaskDetailPageIndex (state, pageIndex) {
      state.searchInfo.pageIndex = pageIndex
    },
    updateTaskDetailPageSize (state, pageSize) {
      state.searchInfo.pageSize = pageSize
    },
    updateTaskDetailPageCount (state, pageCount) {
      state.pageCount = pageCount
    },
    /**
     * 更新查询状态列表
     */
    updateTaskDetailStatusList (state, list) {
      state.taskDetailStatusList = list
    }
  },
  actions: {
    getTaskDetailListAction (context) {
      context.commit('updateTaskDetailLoading')
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getTaskDetailList}?${params}`, 'get')
    },
    getTaskDetailStatusListAction (context) {
      let params = dataFormat({projectId: context.state.searchInfo.projectId})
      return axiosFormat(`${URL.getTaskDetailStatusList}?${params}`, 'get')
    }
  },
  getters: {

  }
}

export default TaskDetail