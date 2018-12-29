import { axiosFormat, dataFormat, getSession } from '@/utils/util.js'
import URL from '@/api/person.js'

const Person = {
  state: {
    loading: false,
    applyLoading: false,
    searchInfo: {
      projectId: '',
      userName: '',
      userRealName: '',
      userEmail: '',
      beginTime: '',
      endTime: '',
      pageIndex: 1,
      pageSize: 10
    },
    applyInfo: {
      pageIndex: 1,
      projectId: ''
    },
    pageCount: 10,
    applyPageCount: 10
  },
  mutations: {
    updateSearchInfo (state, searchInfo) {
      for (let key in searchInfo) {
        state.searchInfo[key] = searchInfo[key]
      }
    },
    getProjectId (state) {
      let projectId = getSession('projectId')
      state.searchInfo.projectId = projectId
      state.applyInfo.projectId = projectId
    },
    closeLoading (state) {
      state.loading = false
    },
    closeApplyLoading (state) {
      state.applyLoading = false
    },
    getPageCount (state, count) {
      state.pageCount = count
    },
    getApplyPageCount (state, count) {
      state.applyPageCount = count
    },
    updatePersonPageIndex (state, pageIndex) {
      state.searchInfo.pageIndex = pageIndex
    },
    updateApplyPageIndex (state, pageIndex) {
      state.applyInfo.pageIndex = pageIndex
    }
  },
  actions: {
    getPersonList (context) {
      context.state.loading = true
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getPersonList}?${params}`, 'get')
    },
    getProjectRoleList () {
      return axiosFormat(URL.getProjectRoles, 'get')
    },
    getProjectApplyList (context) {
      context.state.applyLoading = true
      let params = dataFormat(context.state.applyInfo)
      return axiosFormat(`${URL.getApplyList}?${params}`, 'get')
    },
    invitePersonAction (context, email) {
      let params = {
        projectId: getSession('projectId'),
        userEmailList: email
      }
      return axiosFormat(URL.invitePerson, 'post', params)
    },
    addPersonRoleAction (context, rolesInfo) {
      return axiosFormat(URL.addPersonRole, 'post', rolesInfo)
    },
    applyPersonPassAction (context, userApplyId) {
      let params = dataFormat({userApplyId: userApplyId})
      return axiosFormat(URL.applyPersonPass, 'post', params)
    }
  },
  getters: {

  }
}

export default Person