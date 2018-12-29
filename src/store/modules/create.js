import { axiosFormat } from '@/utils/util.js'
import URL from '@/api/create.js'
const Create = {
  state: {
    current: 0,
    projectId: null,
    projectPropertyVOList: [],
    projectTypes: [],
    labelToolInfoList: [],
    pictureInfo: [],
    labelTypeId: 1
  },
  mutations: {
    updateMarkGoods (state, newVOList) {
      state.projectPropertyVOList = newVOList
    },
    updateCurrent (state) {
      state.current += 1
    },
    finishCurrent (state) {
      state.current = 0
    },
    updateProjectId (state, projectId) {
      state.projectId =projectId
    },
    confirmCurrent (state, data) {
      state.current = data.projectStep
      state.projectId = data.projectId
    },
    updateLabelTools (state, newValue) {
      if (newValue instanceof Array) {
        state.labelToolInfoList = newValue
      } else {
        state.labelToolInfoList = [newValue]
      }
    },
    clearLabelTools (state) {
      state.labelToolInfoList = []
    },
    updatePictureInfo (state, pictureList) {
      state.pictureInfo = pictureList
    },
    updateLabelTypeId (state, id) {
      state.labelTypeId = id
    }
  },
  actions: {
    createSchedule (context) {
      axiosFormat(URL.createSchedule, 'get').then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          context.commit('confirmCurrent', data)
          if (data.projectStep === 1) {
            context.dispatch('getAllMarkUtils')
          }
        }
      })
    },
    updateConfigForm (context, newConfigForm) {
      let data = {
        projectExpiryDate: newConfigForm.cutOffDate,
        projectName: newConfigForm.projectName,
        projectNumber: newConfigForm.taskPictureNumber,
        projectUnitPrice: newConfigForm.picturePrice,
        projectIntroduceInfo: newConfigForm.projectProduce
      }
      return axiosFormat(URL.saveProjectInfo, 'post', data)
    },
    getAllMarkUtils (context) {
      axiosFormat(URL.getMarkUtils, 'get').then(res => {
        if (res.data.result) {
          let projectTypes = JSON.parse(res.data.data)
          context.state.projectTypes = projectTypes
        }
      }) 
    },
    addProjectStepTwo (context) {
      if (context.state.projectId !== null && context.state.labelToolInfoList.length > 0 && context.state.pictureInfo.length > 0 && context.state.projectPropertyVOList.length > 0) {
        let data = {
          projectId: context.state.projectId,
          labelToolId: context.state.labelToolInfoList,
          pictureInfo: context.state.pictureInfo,
          projectPropertyVOList: context.state.projectPropertyVOList,
          labelTypeId: context.state.labelTypeId
        }
        return axiosFormat(URL.addProjectStepTwo, 'post', data)
      }
    }
  },
  getters: {
  }
}

export default Create