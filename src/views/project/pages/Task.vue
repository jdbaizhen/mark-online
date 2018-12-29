<template>
  <section class="task-container">
    <header>
      <v-title title="任务列表"/>
      <i-form inline :model="task.searchInfo" class="header-form">
        <FormItem prop="userRealName">
          <Input type="text" v-model="searchInfo.userRealName" placeholder="姓名">
            <Icon type="md-person" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <i-select placeholder="任务状态" style="width:160px" v-model="searchInfo.taskStatusId">
            <i-option
              v-for="(item, index) in task.taskStatusList"
              :key="index"
              :value="item.taskStatusId"
            >{{item.taskStatusMeaning}}</i-option>
          </i-select>
        </FormItem>
        <FormItem prop="times">
          <DatePicker
            type="datetimerange"
            :confirm="true"
            v-model="searchInfo.times"
            placeholder="选择起始时间"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button icon="ios-search" type="info" @click="handleSearchInfo">搜索</Button>
          <Button type="info" @click="handleClearSearchInfo">清空</Button>
          <Button type="warning" v-show="draw_label_task" @click="getAutoTask">领取标注任务</Button>
          <Button type="warning" v-show="draw_verify_task" @click="getAutoAudit">领取审核任务</Button>
        </FormItem>
      </i-form>
    </header>
    <main ref="taskTable">
       <Table :loading="task.loading" :height="taskTableHeight" :columns="taskTabelColumn" :data="taskListData"></Table>
    </main>
    <footer>
      <Page 
        style="float:right" 
        :current="task.searchInfo.pageIndex"
        :total="task.pageCount" 
        show-sizer show-elevator 
        @on-change="handleChangePageIndex" 
        @on-page-size-change="handleChangePageSize"/>
    </footer>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import { timeFormat, getSession, assignPrivilege } from '@/utils/util.js'
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    "v-title": Title
  },
  data() {
    return {
      /** 
       * 列表相关
      */
      searchInfo: { //搜索条件
        userRealName: "",
        taskStatusId: "",
        times: []
      },
      taskListData: [],   //列表数据
      taskTableHeight: 0, //列表高度
      taskTabelColumn: [  //列表表格模板
        { title: "任务编号", key: "taskId" },
        { title: "任务名", key: "taskName" },
        { title: "姓名", key: "userRealName" },
        { 
          title: "任务状态", 
          key: "taskStatusMeaning",
          render: (h, params) => {
            const row = params.row;
            const color = 
              row.taskStatusId == 1
                ? "#dcdee2"
                : row.taskStatusId == 2
                ? "#2db7f5"
                : row.taskStatusId == 3
                ? "#dcdee2"
                : row.taskStatusId == 4
                ? "#196e6b"
                : row.taskStatusId == 5
                ? "#ed4014"
                : row.taskStatusId == 6
                ? "#515a6e"
                : "cyan";
            return h (
              "tag",
              {
                props: {
                  color: color
                }
              },
              row.taskStatusMeaning
            )

          } 
        },
        { title: "图片数量", key: "taskCount" },
        { title: "更新时间", key: "taskUpdateTime" },
        { title: "创建时间", key: "taskDrawTime" },
        {
          title: "操作",
          render: (h, params) => {
            const row = params.row
            if (this.projectRoleId == 1) {
              return h (
              "div",
              [
                h (
              'Button',
              {
                props: {type: 'text',size: 'small'},
                style: {marginRight: '5px'},
                on: {click: () => {this.handleGoTaskDetail(row.taskId)}}
              },
              "详情"
            ),
            h (
              'Button',
              {
                props: {type: 'text',size: 'small', disabled: row.taskStatusId==3?false:true},
                on: {click: () => {
                  this.$router.push({path:'/main/audit', query: {taskId: row.taskId}})
                }}
              },
              "审核"
            )
              ]
            )
            } else if (this.projectRoleId == 2) {
              return h (
              "div",
              [
                h (
              'Button',
              {
                props: {type: 'text',size: 'small'},
                style: {marginRight: '5px'},
                on: {click: () => {this.handleGoTaskDetail(row.taskId)}}
              },
              "详情"
            ),
            h (
              'Button',
              {
                props: {type: 'text',size: 'small'},
                on: {click: () => {
                  this.$router.push({path:'/main/mark', query: {taskId: row.taskId, taskStatusId: row.taskStatusId}})
                }}
              },
              "标注"
            )
              ]
            )
            } else {
              return h (
              "div",
              [
                h (
              'Button',
              {
                props: {type: 'text',size: 'small'},
                style: {marginRight: '5px'},
                on: {click: () => {this.handleGoTaskDetail(row.taskId)}}
              },
              "详情"
            )
              ]
            )
            }
          }
        }
      ],
      draw_label_task: false,
      draw_verify_task: false,
      search_label_picture: false,
      projectRoleId: 0
    };
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    ...mapMutations(["updateTaskSearchInfo", "updateTaskProjectId", "changeTaskLoading", "updateTaskPageIndex", "updateTaskPageSize", "updateTaskPageCount", "updateTaskStatusList"]),
    ...mapActions(["getTaskStatusAction", "getTaskListAction", "getAutoTaskAction", "getAutoAuditAction"]),
    //初始化页面数据
    getInitData() {
      this.updateTaskProjectId(); //在搜索条件内初始化项目id
      this.getTaskListData(); //发送请求，获取列表数据
      this.getTaskStatusListData();
      this.getTableHeight();
      this.getInintPrivilege();
    },
    //获取权限
    getInintPrivilege () {
      try {
        let projectPrivilegeList = getSession('projectPrivilegeList').split(',')
        let projectRoleId = getSession('projectRoleId')
        this.projectRoleId = projectRoleId
        this.draw_label_task = assignPrivilege(projectPrivilegeList, 'draw_label_task')
        this.draw_verify_task = assignPrivilege(projectPrivilegeList, 'draw_verify_task')
        this.search_label_picture = assignPrivilege(projectPrivilegeList, 'search_label_picture')   
      } catch (e) {
        throw new Error('别看了，你这个号没权限')
      }
    },
    //计算列表高度
    getTableHeight () {
      let taskTable = this.$refs.taskTable
      this.taskTableHeight = taskTable.clientHeight
    },
    //获取任务状态列表
    getTaskStatusListData () {
      this.getTaskStatusAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.updateTaskStatusList(data)
        } else {
          this.$Message.error(res.data.message);
        } 
      })
    },
    //获取任务列表
    getTaskListData() {
      this.getTaskListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.taskListData = data.details
          this.updateTaskPageCount(data.count) //获取总条数，计算分页数
          this.changeTaskLoading(); //获取数据成功隐藏loading
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    //自动领取任务
    getAutoTask () {
      this.getAutoTaskAction().then(res => {
        if (res.data.result) {
          this.getTaskListData();
        } else {
          this.$Message.error(res.data.message);
        } 
      })
    },
    //自动领取审核任务
    getAutoAudit () {
      this.getAutoAuditAction().then(res => {
        if (res.data.result) {
          this.getTaskListData();
        } else {
          this.$Message.error(res.data.message);
        } 
      })
    },
    //搜索
    async handleSearchInfo () {
      let beginTime =
        this.searchInfo.times[0] !== ""
          ? timeFormat(this.searchInfo.times[0])
          : "";
      let endTime =
        this.searchInfo.times[1] !== ""
          ? timeFormat(this.searchInfo.times[1])
          : "";
      let obj = {
        userRealName: this.searchInfo.userRealName,
        taskStatusId: this.searchInfo.taskStatusId,
        beginTime: beginTime,
        endTime: endTime
      }
      await this.updateTaskSearchInfo(obj)
      this.getTaskListData(); 
    },
    handleClearSearchInfo () {
      this.searchInfo.userRealName = ""
      this.searchInfo.taskStatusId = ""
      this.searchInfo.times = []
      this.getTaskListData(); 
    },
    /**
     * 分页
     */
    async handleChangePageIndex (pageIndex) {
      await this.updateTaskPageIndex(pageIndex)
      this.getTaskListData()
    },
    async handleChangePageSize (pageSize) {
      await this.updateTaskPageSize(pageSize)
      this.getTaskListData()
    },
    /**
     * 跳页
     */
    handleGoTaskDetail (taskId) { //任务详情页
      this.$router.push({path: '/main/project/taskdetail', query: {taskId}})
    }
  },
  computed: mapState(["task"])
};
</script>

<style scoped lang="less">
.task-container {
  position: relative;
  height: 100%;
  .header-form {
    width: 100%;
    button {
      margin-left: 10px;
    }
  }
  main {
    position: absolute;
    top: 130px;
    bottom: 50px;
    width: 100%;
  }
  footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
}
</style>
