<template>
  <section style="width: 100%;height: 100%">
    <v-mark :taskStatusId="taskStatusId" :imgData="imgData"/>
  </section>
</template>

<script>
import Mark from './MarkPage.vue'
import vm from '@/utils/vm.js'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    'v-mark': Mark
  },
  data () {
    return {
      taskStatusId: '',
      imgData: {}
    }
  },
  created () {
    vm.$on('updateMarkPicture', () => {
      this.getLabelPicture()
    })
  },
  mounted () {
    this.getInitMark()
  },
  methods: {
    ...mapMutations(['updateMarkProjectId', 'updateMarkTaskId', 'updateMarkImgInfo']),
    ...mapActions(['getLabelPictureAction']),
    //页面初始化
    async getInitMark () {
      let taskId = this.$route.query.taskId
      let taskStatusId = this.$route.query.taskStatusId
      this.taskStatusId = taskStatusId
      await this.updateMarkTaskId(taskId)
      await this.updateMarkProjectId()
      this.getLabelPicture()
    },
    /**
     * 获取页面初始数据
     */
    getLabelPicture () {
      this.getLabelPictureAction().then(res => {
        if (res.data.result) {
          if (res.data.code === '030') {
            this.$Message.success('任务完成')
            this.$router.push({path: '/main/project/task'})
          } else {
            let data = JSON.parse(res.data.data)
            this.imgData = data
            this.updateMarkImgInfo(data)
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  
}
</script>

<style>

</style>
