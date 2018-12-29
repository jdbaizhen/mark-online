import { axiosFormat, dataFormat, getSession } from '@/utils/util.js'
import URL from '@/api/detail.js'
const Detail = {
  state: {
    loading: false
  },
  mutations: {
    closeLoading (state) {
      state.loading = false
    }
  },
  actions: {
    getProjectIntroduce (context) {
      context.state.loading = true
      let projectId = getSession('projectId')
      let params = dataFormat({projectId: projectId})
      return axiosFormat(`${URL.getProjectIntroduce}?${params}`, 'get')
    },
    getUserRoles (context, projectId) {
      let params = dataFormat({projectId})
      return axiosFormat(`${URL.getUserRoles}?${params}`, 'get')
    }
  },
  getters: {}
}

export default Detail