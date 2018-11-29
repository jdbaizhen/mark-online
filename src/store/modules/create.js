import { axiosFormat, dataFormat } from '@/utils/util.js'
import URL from '@/api/create.js'
const Create = {
  state: {
    current: 0,
    projectId: null,
    configForm: {
      projectName: '',
      cutOffDate: '',
      taskPictureNumber: '',
      picturePrice: '',
      projectProduce: '',
      markGoods: []
    },
    projectTypes: []
  },
  mutations: {
    updateMarkGoods (state, newMarkGoods) {
      state.configForm.markGoods = newMarkGoods
    },
    updateCurrent (state) {
      state.current += 1
    },
    confirmCurrent (state, data) {
      state.current = data.projectStep
      state.projectId = data.projectId
    },

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
      // for (let key in newConfigForm) {
      //   state.configForm[key] = newConfigForm[key]
      // }
      let data = {
        projectExpiryDate: newConfigForm.cutOffDate,
        projectName: newConfigForm.projectName,
        projectNumber: newConfigForm.taskPictureNumber,
        projectUnitPrice: newConfigForm.picturePrice,
        projectIntroduceInfo: newConfigForm.projectProduce
      }
      axiosFormat(URL.saveProjectInfo, 'post', data).then( res => {
        if (res.data.result) {
          context.commit('updateCurrent')
        }
      })
    },
    getAllMarkUtils (context) {
      axiosFormat(URL.getMarkUtils, 'get').then(res => {
        if (res.data.result) {
          let projectTypes = JSON.parse(res.data.data)
          context.state.projectTypes = projectTypes
        }
      }) 
    }
  },
  getters: {}
}

export default Create