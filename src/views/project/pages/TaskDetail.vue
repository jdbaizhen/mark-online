<template>
  <section class="taskdetail-container"> 
    <Modal
      v-model="activeImageShow"
      title="图片详情"
      width="50%"
      footer-hide
      :styles="{top: '20px'}"
      >
      <img :src="activeImage" width="100%" alt="">
    </Modal>
    <header>
      <v-title title="任务详情"/>
      <Icon type="md-arrow-back" size="30" style="cursor:pointer" @click="goBack"/>
      <i-select
        v-model="taskDetailStatusId"
        @on-change="handleChangeTaskDetailStatus"
        style="width: 150px;float: right"
        placeholder="状态查询"
        >
        <i-option 
          v-for="(item, index) in taskdetail.taskDetailStatusList" 
          :key="index"
          :value="item.taskDetailStatusId">
          {{item.taskDetailStatusMeaning}}
        </i-option>
      </i-select>
    </header>
    <main ref="taskDetailTable">
      <Table 
        :loading="taskdetail.loading" 
        :columns="taskDetailListColumn" 
        :data="taskDetailList" 
        style="margin-right:20px"
        :height="618">
      </Table>
    </main>
    <footer>
      <Page 
        style="float:right" 
        :current="taskdetail.searchInfo.pageIndex"
        :total="taskdetail.pageCount" 
        show-sizer show-elevator 
        @on-change="handleChangePageIndex" 
        @on-page-size-change="handleChangePageSize"/>
    </footer>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    'v-title': Title
  },
  data () {
    return {
      taskDetailStatusId: '',
      taskDetailList: [],
      tableHeight: 0,
      taskDetailListColumn: [
        { title: '图片编号', key: "taskDetailId"},
        { 
          title: '图片', 
          key: "imagePath",
          render: (h, params) => {
            const row = params.row;
            const imgUrl = row.imagePath
            return h (
              "img",
              {
                attrs: {
                  src: imgUrl
                },
                style: {
                  width: '120px'
                },
                on: {
                  click: () => {
                    this.activeImage = imgUrl
                    this.activeImageShow = true
                  }
                }
              }
            )
          }
        },
        { 
          title: '图片状态',
          key: 'taskDetailStatusId',
          render: (h, params) => {
            const row = params.row;
            const color = 
              row.taskDetailStatusId === 1
                ? "#dcdee2"
                : row.taskDetailStatusId === 2
                ? "#2db7f5"
                : row.taskDetailStatusId === 3
                ? "#196e6b"
                : row.taskDetailStatusId === 4
                ? "#ed4014"
                : "cyan";
            return h (
              "tag",
              {
                props: {
                  color: color
                }
              },
              row.taskDetailStatusMeaning
            )
          }
        },
        { title: '更新时间', key: 'taskDetailUpdateTime'},
        { title: '创建时间', key: 'taskDetailDrawTime'}
      ],
      activeImageShow: false,
      activeImage: ''
    }
  },
  mounted () {
    this.getInitData()
  },
  methods: {
    ...mapMutations([
      'updateTaskDetailLoading', 
      'updateTaskId', 
      'updateTaskDetailProjectId', 
      'updateTaskDetailStatusList', 
      'updateTaskDetailStatusId',
      'updateTaskDetailPageIndex',
      'updateTaskDetailPageSize',
      'updateTaskDetailPageCount'
      ]),
    ...mapActions(['getTaskDetailListAction', 'getTaskDetailStatusListAction']),
    /**
     * 初始化页面
     */
    async getInitData () {
      await this.getTaskId()
      this.getTaskDetailStatusListData()
      this.getTaskDetailListData()
      this.getTableHeight()
    },
    getTableHeight () {
      let elem = this.$refs.taskDetailTable
      let height = elem.clientHeight
      this.tableHeight = height
    },
    // 回到上一页
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 查询条件
     */
    getTaskId () {
      let taskId = this.$route.query.taskId
      this.updateTaskId(taskId) //更新taskId
      this.updateTaskDetailProjectId()  //更新projectId
    },
    async handleChangeTaskDetailStatus () {
      await this.updateTaskDetailStatusId(this.taskDetailStatusId)
      this.getTaskDetailListData()
    },
    /**
     * 分页
     */
    async handleChangePageIndex (pageIndex) {
      await this.updateTaskDetailPageIndex(pageIndex)
      this.getTaskDetailListData()
    },
    async handleChangePageSize (pageSize) {
      await this.updateTaskDetailPageSize(pageSize)
      this.getTaskDetailListData()
    },
    /**
     * 获取数据
     */
    getTaskDetailListData () {
      this.getTaskDetailListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.taskDetailList = data.details
          this.updateTaskDetailPageCount(data.count)
          this.updateTaskDetailLoading()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    //获取详情状态列表
    getTaskDetailStatusListData () {
      this.getTaskDetailStatusListAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.updateTaskDetailStatusList(data)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  computed: mapState(['taskdetail'])
}
</script>

<style scoped lang="less">
.taskdetail-container {
  height: 100%;
  position: relative;
  main {
    position: absolute;
    top: 130px;
    bottom: 50px;
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
