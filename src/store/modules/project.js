import { axiosFormat, dataFormat, setSession } from '@/utils/util.js'
import URL from '@/api/project.js'
const Project = {
  state: {
    loading: false,
    pageCount: 1,
    searchInfo: {
      pageIndex: 1,
      pageSize: 5,
      labelTypeId: '',
      beginTime: '',
      endTime: ''
    },
    projectId: ''
  },
  mutations: {
    changeLoading (state) {
      state.loading = false
    },
    getProjectListPageCount (state, pageCount) {
      state.pageCount = pageCount
    },
    changePageIndex (state, pageIndex) {
      state.searchInfo.pageIndex = pageIndex
    },
    changeTime (state, times) {
      state.searchInfo.beginTime = times[0]
      state.searchInfo.endTime = times[1]
      state.searchInfo.pageIndex = 1
    },
    clearTime (state) {
      state.searchInfo.beginTime = ''
      state.searchInfo.endTime = ''
    },
    updateProjectId (state, projectId) {
      setSession('projectId', projectId)
      state.projectId = projectId
    },
    changeLabelType (state, labelTypeId) {
      state.searchInfo.labelTypeId = labelTypeId
      state.searchInfo.pageIndex = 1
    }
  },
  actions: {
    getProjectListAction (context) {
      context.state.loading = true
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getProjectList}?${params}`, 'get')
    },
    getLabelTypes () {
      return axiosFormat(URL.getLabelType, 'get')
    },
    getPersonalProjectListAction (context) {
      context.state.loading = true
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getPersonalProject}?${params}`, 'get')
    },
    applyProjectAction (context, projectId) {
      let params =  dataFormat({projectId})
      return axiosFormat(URL.applyProject, 'post', params)
    }
  }
}

export default Project