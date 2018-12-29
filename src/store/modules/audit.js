import { axiosFormat, dataFormat, getSession } from '@/utils/util.js'
import URL from '@/api/audit.js'

const Audit = {
  state: {
    projectId: '',
    taskId: '',
    lastTaskDetailId: '',
    imgInfo: {
      width: 0,
      height: 0,
      countPage: 0,
      imageId: '',
      imageName: '',
      imagePath: '',
      taskDetailId: '',
      polygonMarkInfoRetModelList: [],
      squareInfoRetModelList: []
    },
    scale: 1,
    activeRectId: -1,
    activePolygonId: -1,
    projectPropertyId: [],  //每个框对应的属性
    propertyList: [],  //自定义属性
    rejectReason: [], //驳回理由
  },
  mutations: {
    updateAuditProjectId (state) {
      let projectId = getSession('projectId')
      state.projectId = projectId
    },
    updateAuditTaskId (state, taskId) {
      state.taskId = taskId
    },
    updateAuditImgInfo (state, imgObj) {
      state.imgInfo = imgObj
    },
    changeAuditScale (state, newScale) {
      state.scale = state.scale + newScale
    },
    changeAuditActiveRectId (state, id) {
      state.activeRectId = id
      state.activePolygonId = -1
    },
    changeAuditActivePolygonId (state, id) {
      state.activeRectId = -1
      state.activePolygonId = id
    },
    updateAuditProjectPropertyId (state, ary) {
      state.projectPropertyId = ary
    },
    updateAuditPropertyList (state, ary) {
      state.propertyList = ary
    },
    updateAuditRejectReason (state, ary) {
      state.rejectReason = ary
    },
    changeMarkStatus (state) {
      if (state.activeRectId !== -1) {
        state.imgInfo.squareInfoRetModelList.map((item) => {
          if (item.squareId === state.activeRectId) {
            item.squareStatus = 1
          }
        })
      } else if (state.activePolygonId !== -1) {
        state.imgInfo.polygonMarkInfoRetModelList.map((item) => {
          if (item.polygonMarkId === state.activePolygonId) {
            item.polygonMarkStatus = 1
          }
        })
      }
    }
  },
  actions: {
    getAuditPictureInfoAction (context) {
      let params = dataFormat({
        projectId: context.state.projectId,
        taskId: context.state.taskId,
        lastTaskDetailId: context.state.lastTaskDetailId,
      })
      return axiosFormat(`${URL.getAuditInfo}?${params}`, 'get')
    },
    // 获取自定义属性
    getProjectPropertyAction (context) {
      let params = dataFormat({projectId: context.state.projectId})
      return axiosFormat(`${URL.getProjectProperty}?${params}`, 'get')
    },
    // 获取驳回理由
    getRejectReasonAction (context) {
      let params = dataFormat({projectId: context.state.projectId})
      return axiosFormat(`${URL.getRejectReason}?${params}`, 'get')
    },
    // 添加驳回理由
    addRejectReasonAction (context, ary) {
      let params = dataFormat({projectId: context.state.projectId,rejectReasonNameList: ary})
      return axiosFormat(URL.addRejectReason, 'post', params)
    },
    // 驳回数据
    rejectDataAction (context, rejectReasonAry) {
      let projectId = context.state.projectId
      let taskDetailId = context.state.imgInfo.taskDetailId
      let squareId = context.state.activeRectId
      let polygonMarkId = context.state.activePolygonId
      let rejectReasonList = rejectReasonAry
      let params
      if (squareId === -1 && polygonMarkId === -1) {
        return {data: {result: false, message: '请选择框后再进行提交'}}
      } else if (rejectReasonList.length === 0) {
        return {data: {result: false, message: '驳回理由不能为空'}}
      } else {
        if (squareId !== -1) {
          params = dataFormat({projectId, taskDetailId, squareId, rejectReasonList})
        } else if (polygonMarkId !== -1) {
          params = dataFormat({projectId, taskDetailId, polygonMarkId, rejectReasonList})
        }
        return axiosFormat(URL.rejectData, 'post', params)
      }    
    },
    //获取下一张图片
    getNextPictureAction (context) {
      let params = dataFormat({
        projectId: context.state.projectId,
        taskId: context.state.taskId,
        lastTaskDetailId: context.state.imgInfo.taskDetailId
      })
      return axiosFormat(`${URL.getNextPicture}?${params}`, 'get')
    }
  },
  getters: {}
}

export default Audit