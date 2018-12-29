<template>
  <section class="project-container">
    <section class="project-header">
      <Button @click="getProjectList" v-show="search_personal_project_list">所有项目</Button>
      <Button style="margin: 0 20px;" @click="handlePersonalProjectList" v-show="search_personal_project_list">我的项目</Button>
      <DatePicker 
        type="datetimerange" 
        :confirm="true"
        placeholder="选择起始时间" 
        style="width: 300px" 
        @on-change="handleChangeTime"
        @on-ok="handleConfirmTime"
        @on-clear="handleClearTime"
      />
    <i-select v-model="project.searchInfo.labelTypeId" clearable style="width:200px;margin-right:20px;" @on-change="handleChangeLabelType" placeholder="项目类型">
        <i-option v-for="item in labelTypeList" :value="item.labelTypeId" :key="item.labelTypeId">{{ item.labelTypeName }}</i-option>
    </i-select>
    </section>
    <section class="project-container-list">
      <Spin size="large" v-show="project.loading" fix></Spin>
      <project-panel 
        v-show="projectList.length>0" 
        v-for="(item, index) in projectList" 
        :key="index" :item="item"
        @applyJoinProject="applyJoinProject"
        />
      <nothing v-show="projectList.length===0" title="暂无数据"/>
      <Page 
        v-show="projectList.length>0" 
        :total="project.pageCount"
        :current="project.searchInfo.pageIndex"
        :page-size="project.searchInfo.pageSize" 
        show-elevator style="margin: 20px;" 
        @on-change="handleChangePage"/>
    </section> 
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { assignPrivilege, getSession } from '@/utils/util.js'
export default {
  components: {
    'project-panel': () => import('@/components/ProjectPanel.vue'),
    'nothing': () => import('@/components/Nothing.vue')
  },
  data () {
    return {
      projectList: [],
      times: [],
      labelTypeList: [],
      /**
       * 权限部分
       */
      search_personal_project_list: false
    }
  },
  mounted() {
    this.getProjectList()
    this.getLabelTypeList()
    this.getInitPrivilege()
  },
  watch: {
    '$route' () {
      this.getProjectList()
      this.getLabelTypeList()
      this.getInitPrivilege()
    }
  },
  methods: {
    ...mapActions(['getProjectListAction', 'getLabelTypes', 'getPersonalProjectListAction', 'applyProjectAction']),
    ...mapMutations(['changeLoading', 'getProjectListPageCount', 'changePageIndex', 'changeTime', 'clearTime', 'changeLabelType']),
    //初始化权限
    getInitPrivilege () {
      let privilegeList = getSession('privilegeList').split(',')
      this.search_personal_project_list = assignPrivilege(privilegeList, 'search_personal_project_list')    
    },
    //申请加入项目
    applyJoinProject (projectId) {
      this.applyProjectAction(projectId).then(res => {
        if (res.data.result) {
          this.getProjectList()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    getProjectList () {
      this.getProjectListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.projectList = data.details
          this.getProjectListPageCount(data.count)
          this.changeLoading()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    async handlePersonalProjectList () {
      await this.changePageIndex(1) // 每次获取第一页
      this.getPersonalProjectListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.projectList = data.details
          this.getProjectListPageCount(data.count)
          this.changeLoading()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    handleChangePage (pageIndex) {
      this.changePageIndex(pageIndex)
      this.getProjectList()
    },
    handleChangeTime (value) {
      this.times = value
    },
    async handleConfirmTime () {
      await this.changeTime(this.times)
      this.getProjectList()
    },
    async handleClearTime () {
      await this.clearTime()
      this.getProjectList()
    },
    getLabelTypeList () {
      this.getLabelTypes().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.labelTypeList = data
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    async handleChangeLabelType (value) {
      let labelTypeId = value ===undefined ? '' : value
      await this.changeLabelType(labelTypeId)
      this.getProjectList()
    }
  },
  computed: mapState(['project', 'privilegeList'])
}
</script>

<style scoped lang="less">
.project-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .project-header {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 60px;
    padding: 0px 30px;
    line-height: 60px;
    margin-bottom: 20px;
  }
  .project-container-list {
    position: relative;
    flex: 1;
    overflow-y: scroll;
  }
  .project-container-list::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .project-container-list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
  }
  .project-container-list::-webkit-scrollbar-track {/*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
  }
}
</style>
