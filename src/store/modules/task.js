import { axiosFormat, getSession, dataFormat } from '@/utils/util.js'
import URL from '@/api/task.js'

const Task = {
  state: {
    /**
     * 列表分页
     */
    loading: false,
    searchInfo: {
      pageIndex: 1,
      pageSize: 10,
      projectId: '',
      userRealName: '',
      taskStatusId: '',
      beginTime: '',
      endTime: ''
    },
    pageCount: 10,
    /**
     * 任务状态
     */
    taskStatusList: []
  },
  mutations: {
    /** 
     * 搜索条件修改
    */
    updateTaskSearchInfo (state, searchInfo) {
      for (let key in searchInfo) {
        state.searchInfo[key] = searchInfo[key]
      }
    },
    updateTaskProjectId (state) {
      let projectId = getSession('projectId')
      state.searchInfo.projectId = projectId
    },
    updateTaskPageIndex (state, pageIndex) {
      state.searchInfo.pageIndex = pageIndex
    },
    updateTaskPageSize (state, pageSize) {
      state.searchInfo.pageSize = pageSize
    },
    changeTaskLoading (state) {
      state.loading = !state.loading
    },
    updateTaskPageCount (state, pageCount) {
      state.pageCount = pageCount
    },
    /**
     * 更新任务状态列表
     */
    updateTaskStatusList (state, list) {
      state.taskStatusList = list
    }
  },
  actions: {
    getTaskStatusAction (context) {
      let params = dataFormat({projectId: context.state.searchInfo.projectId})
      return axiosFormat(`${URL.getTaskStatus}?${params}`, 'get')
    },
    getTaskListAction (context) {
      context.commit('changeTaskLoading')
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getTaskList}?${params}`, 'get')
    },
    getAutoTaskAction (context) {
      let params = dataFormat({projectId: context.state.searchInfo.projectId})
      return axiosFormat(URL.getAutoTask, 'post', params)
    },
    getAutoAuditAction (context) {
      let params = dataFormat({projectId: context.state.searchInfo.projectId})
      return axiosFormat(URL.getAutoAduit, 'post', params)
    },
  },
  getters: {

  }
}

export default Task