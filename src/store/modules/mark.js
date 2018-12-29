import { dataFormat, axiosFormat, getSession, axiosProjectFormat } from '@/utils/util.js'
import URL from '@/api/mark.js'

const Mark = {
  state: {
    projectId: '',
    taskId: '',
    imgInfo: { 
      imageId: '',
      imageName: '',
      imagePath: '',
      height: '',
      width: '',
      taskDetailId: '',
      taskStatusId: '',
      countPage: '',
      pictureCount: '',
      polygonMarkInfoRetModelList: [],
      squareInfoRetModelList: []
    },
    lastTaskDetailId: '',
    propertyList: [],  //自定义属性
    currentPropertyList: [], // 已选择的属性
    activeRectId: '',
    rejectReasonList: [], // 驳回理由
  },
  mutations: {
    updateMarkProjectId (state) {
      let projectId = getSession('projectId')
      state.projectId = projectId
    },
    updateMarkTaskId (state, taskId) {
      state.taskId = taskId
    },
    updateMarkImgInfo (state, imgInfo) {   
       state.imgInfo = imgInfo
    },
    updateMarkProperty (state, propertyList) {
      state.propertyList = propertyList
    },
    updateActiveRectId (state, id) {
      state.currentPropertyList = []
      state.activeRectId = id
      state.imgInfo.squareInfoRetModelList.map((item) => {
        if (item.squareId === id) {
          state.rejectReasonList = item.rejectReasonList
          item.projectMaterialRetModelList.map((ite) => {
            state.currentPropertyList.push(ite.projectPropertyId)
          })
        }
      })
    },
    changeCurrentPropertyList (state, ary) {
      state.currentPropertyList[0] = ary
    } 
  },
  actions: {
    //获取图片
    getLabelPictureAction (context) {
      let params = dataFormat({
        projectId: context.state.projectId,
        taskId: context.state.taskId
      })
      return axiosFormat(`${URL.searchLabelPicture}?${params}`, 'get')
    },
    //获取标注工具集
    searchProjectLabelToolAction () {
      let projectId = getSession('projectId')
      let params = dataFormat({projectId: projectId})
      return axiosFormat(`${URL.searchProjectLabelTool}?${params}`, 'get')
    },
    //获取自定义属性
    searchProjectPropertyAction () {
      let projectId = getSession('projectId')
      let params = dataFormat({projectId: projectId})
      return axiosFormat(`${URL.searchProjectProperty}?${params}`, 'get')
    },
    //提交数据
    submitMarkDataAction (context, params) {
      let projectId = getSession('projectId')
      let data = {
        taskDetailId: context.state.imgInfo.taskDetailId,
        squareInfoList: params.squareInfoList,
        polygonMarkVOList: params.polygonInfoVOList,
        pointMarkInfoVO: {}
      }
      return axiosProjectFormat(URL.submitMarkInfo, 'post', projectId, data)
    },
    /**
     * 审核之后
     */
    //获取图片数据
    getSearchNextPictureAction (context) {
      let params = dataFormat({
        projectId: context.state.projectId,
        taskId: context.state.taskId,
        lastTaskDetailId: context.state.lastTaskDetailId
      })
      return axiosFormat(`${URL.getSearchNextPicture}?${params}`, 'get')
    },
    // 提交单个框数据
    submitOneMarkInfoAction (context, obj) {
      let projectId = getSession('projectId')
      let data = {
        squareX: obj.x,
        squareY: obj.y,
        squareW: obj.w,
        squareH: obj.h,
        squareId: obj.id,
        projectPropertyId: context.state.currentPropertyList[0],
        taskDetailId: context.state.imgInfo.taskDetailId
      }
      return axiosProjectFormat(URL.submitOneMarkInfo, 'post', projectId, data)
    }
  },
  getters: {}
}

export default Mark