import { axiosFormat, getSession, axiosPostFile, dataFormat } from '@/utils/util.js'
import URL from '@/api/warehouse.js'
const WareHouse = {
  state: {
    loading: false,
    uploadLoading: false,
    searchInfo: {
      projectId: '',
      pageIndex: 1,
    },
    pageCount: 10
  },
  mutations: {
    getProjectIdMutation (state) {
      let projectId = getSession('projectId')
      state.searchInfo.projectId = projectId
    },
    updatePageCount (state, count) {
      state.pageCount = count
    },
    updatePageIndex (state, pageIndex) {
      state.searchInfo.pageIndex = pageIndex
    },
    changeWarehouseLoading (state) {
      state.loading = !state.loading
    },
    changeWarehouseUploadLoading (state) {
      state.uploadLoading = !state.uploadLoading
    }
  },
  actions: {
    uploadImageFileAction (context, file) {
      context.commit('changeWarehouseUploadLoading')
      let projectId = getSession('projectId')
      var formData = new FormData()
      formData.append('projectId', projectId)
      formData.append('file', file)
      return axiosPostFile(URL.uploadImageFile, formData)
    },
    getImageListAction (context) {
      context.commit('changeWarehouseLoading')
      let params = dataFormat(context.state.searchInfo)
      return axiosFormat(`${URL.getImageList}?${params}`, 'get')
    }
  },
  getters: {

  }
}

export default WareHouse