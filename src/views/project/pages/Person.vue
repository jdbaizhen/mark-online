<template>
  <section class="person-container">
    <Modal v-model="invitePersonShow">
      <p slot="header" style="color:green;text-align:center">
        <Icon type="ios-key"></Icon>
        <span>邀请新成员</span>
      </p>
      <div style="text-align:center">
        <Input
          type="text"
          placeholder="请输入被邀请人邮箱"
          v-model="currentEmail"
          style="width:80%;margin-left:10%;margin-bottom:20px;"
        >
          <Icon type="md-mail" slot="prepend"></Icon>
        </Input>
        <h4
          style="padding: 5px 0px; background: rgba(25,190,107,0.5);width:80%;margin-left:10%;"
        >邀请人列表</h4>
        <h4 style="margin-top: 10px; color: #ddd;" v-if="inviteUserEmail.length===0">暂无数据</h4>
        <ul class="invite-list" v-else>
          <li v-for="(item, index) in inviteUserEmail" :key="index">
            <span>邮箱: {{item}}</span>
            <span>
              <Icon type="md-close" style="cursor:pointer" @click="handleDeleteEmail(index)"/>
            </span>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="info" size="small" @click="handleAddEmailList">
          <Icon type="md-add"/>添加
        </Button>
        <Button type="success" size="small" @click="handleSubmitEmailList">提交</Button>
      </div>
    </Modal>
    <Row style="height: 100%;">
      <i-col span="16" style="height: 100%;">
        <v-title title="人员列表"/>
        <header class="person-list-header">
          <i-form inline :model="person.searchInfo">
            <FormItem prop="userName">
              <Input type="text" v-model="searchInfo.userName" placeholder="账号">
                <Icon type="ios-person" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="userRealName">
              <Input type="text" v-model="searchInfo.userRealName" placeholder="姓名">
                <Icon type="md-person" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="userEmail">
              <Input type="text" v-model="searchInfo.userEmail" placeholder="邮箱">
                <Icon type="md-mail" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <i-select placeholder="角色选择" style="width:160px">
                <i-option
                  v-for="(item, index) in personProjectRoleList"
                  :key="index"
                  :value="item.projectRoleId"
                >{{item.projectRoleName}}</i-option>
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
          </i-form>
          <section class="person-list-btns">
            <Button icon="ios-search" type="info" @click="handleSearch">搜索</Button>
            <Button type="info" @click="handleClearForm">清空</Button>
            <Button type="success" @click="handleShowInviteModel">邀请新成员</Button>
          </section>
        </header>
        <main>
          <Table :loading="person.loading" :columns="personListcolumns" :data="personList"></Table>
        </main>
        <footer>
          <Page
            :total="person.pageCount"
            :current="person.searchInfo.pageIndex"
            show-elevator
            style="margin-top: 20px;"
            @on-change="handleChangePersonPage"
            class="page-position"
          />
        </footer>
      </i-col>
      <i-col span="7" offset="1" style="height: 100%;">
        <v-title title="申请列表"/>
        <main class="apply-conatiner">
          <Spin fix v-if="person.applyLoading"></Spin>
          <header
            style="width:100%;height:40px;line-height:40px;border:1px solid rgba(215,215,224,1);padding-left:20px;background:#f8f8f9;color:#515a6e;font-size:12px;font-weight:550;"
          >申请详情</header>
          <section class="apply-list-container">
            <card-apply
              v-for="(item, index) in personApplyList"
              :key="index"
              :applyInfo="item"
              @handleSubmitApplyPerson="handleApplyPerson"
            />
          </section>
          <h4 v-show="personApplyList.length === 0">暂无数据</h4>
        </main>
        <footer>
          <Page
            :total="person.applyPageCount"
            :current="person.applyInfo.pageIndex"
            show-elevator
            style="margin-top: 20px;"
            @on-change="handleChangeApplyPage"
            class="page-position"
          />
        </footer>
      </i-col>
    </Row>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { timeFormat } from "@/utils/util.js";
import Title from "@/components/Title.vue";
import CardApply from "@/components/CardApply.vue";
export default {
  components: {
    "v-title": Title,
    "card-apply": CardApply
  },
  data() {
    return {
      searchInfo: {
        userName: "",
        userRealName: "",
        userEmail: "",
        times: []
      },
      personList: [],
      personProjectRoleList: [], //角色列表
      personApplyList: [], //申请列表
      personListcolumns: [
        { title: "Id", key: "userId", width: 80 },
        { title: "账号", key: "userName", width: 120 },
        { title: "姓名", key: "userRealName", width: 80 },
        { title: "邮箱", key: "userEmail", width: 180 },
        {
          title: "当前状态",
          key: "inviteStatus",
          width: 155,
          render: (h, params) => {
            const row = params.row;
            const color =
              row.inviteStatus === 1
                ? "primary"
                : row.inviteStatus === 2
                ? "success"
                : "error";
            const text =
              row.inviteStatus === 1
                ? "未分配角色"
                : row.inviteStatus === 2
                ? "已分配角色"
                : "Fail";

            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
          }
        },
        { title: "邀请时间", key: "inviteCreateTime", width: 180 },
        { title: "更新时间", key: "inviteUpdateTime", width: 180 },
        {
          title: "操作",
          key: "",
          fixed: 'right',
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            return row.inviteStatus === 1
              ? h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                        ghost: true
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.handleAddRoles("2", row.inviteId);
                        }
                      }
                    },
                    "标注"
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "success",
                        size: "small",
                        ghost: true
                      },
                      on: {
                        click: () => {
                          this.handleAddRoles("1", row.inviteId);
                        }
                      }
                    },
                    "审核"
                  )
                ])
              : h("div", "暂无操作");
          }
        }
      ],
      invitePersonShow: false,
      currentEmail: undefined, //当前正在输入的邮箱
      inviteUserEmail: []
    };
  },
  mounted() {
    this.getProjectId();
    this.getPersonListData();
    this.getProjectRoleListData();
    this.getPersonApplyList();
  },
  watch: {
    $route() {
      this.getProjectId();
      this.getPersonListData();
      this.getProjectRoleListData();
      this.getPersonApplyList();
    }
  },
  methods: {
    ...mapMutations([
      "updateSearchInfo",
      "getProjectId",
      "closeLoading",
      "getPageCount",
      "getApplyPageCount",
      "closeApplyLoading",
      "updatePersonPageIndex",
      "updateApplyPageIndex"
    ]),
    ...mapActions([
      "getPersonList",
      "getProjectRoleList",
      "getProjectApplyList",
      "invitePersonAction",
      "addPersonRoleAction",
      "applyPersonPassAction"
    ]),
    /**
     * 人员列表
     */
    getPersonListData() {
      this.getPersonList().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.personList = data.details;
          this.getPageCount(data.count);
          this.closeLoading();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    async handleSearch() {
      let beginTime =
        this.searchInfo.times[0] !== ""
          ? timeFormat(this.searchInfo.times[0])
          : "";
      let endTime =
        this.searchInfo.times[1] !== ""
          ? timeFormat(this.searchInfo.times[1])
          : "";
      let obj = {
        userName: this.searchInfo.userName,
        userRealName: this.searchInfo.userRealName,
        userEmail: this.searchInfo.userEmail,
        beginTime: beginTime,
        endTime: endTime
      };
      await this.updateSearchInfo(obj);
      this.getPersonListData();
    },
    getProjectRoleListData() {
      this.getProjectRoleList().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.personProjectRoleList = data;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    async handleChangePersonPage(pageIndex) {
      await this.updatePersonPageIndex(pageIndex);
      this.getPersonListData();
    },
    handleClearForm() {
      this.searchInfo = {
        userName: "",
        userRealName: "",
        userEmail: "",
        times: ["", ""]
      };
      this.handleSearch();
    },
    /**
     * 获取申请列表
     */
    getPersonApplyList() {
      this.getProjectApplyList().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.personApplyList = data.details;
          this.getApplyPageCount(data.count);
          this.closeApplyLoading();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    handleApplyPerson(userApplyId) {
      //申请通过
      this.applyPersonPassAction(userApplyId).then(res => {
        if (res.data.result) {
          this.getPersonApplyList();
          this.getPersonListData();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    async handleChangeApplyPage(pageIndex) {
      await this.updateApplyPageIndex(pageIndex);
      this.getPersonApplyList();
    },
    /**
     * 邀请用户加入项目
     */
    handleShowInviteModel() {
      this.invitePersonShow = true;
    },
    handleAddEmailList() {
      let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!emailReg.test(this.currentEmail)) {
        this.$Message.error("邮箱格式错误");
        return false;
      }
      this.inviteUserEmail.push(this.currentEmail);
      this.currentEmail = undefined;
    },
    handleDeleteEmail(index) {
      this.inviteUserEmail.splice(index, 1);
    },
    handleSubmitEmailList() {
      this.invitePersonAction(this.inviteUserEmail).then(res => {
        if (res.data.result) {
          this.invitePersonShow = false;
          this.inviteUserEmail = [];
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    //为项目成员赋予角色
    handleAddRoles(projectRoleId, inviteId) {
      let obj = { projectRoleId, inviteId };
      this.addPersonRoleAction(obj).then(res => {
        if (res.data.result) {
          this.getPersonListData();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  },
  computed: mapState(["person"])
};
</script>

<style scoped lang="less">
.person-container {
  height: 100%;
  .person-list-header {
    display: flex;
    flex-direction: row;
    padding-bottom: 0px;
    form {
      flex: 3;
    }
    .person-list-btns {
      flex: 1;
      button {
        margin-right: 10px;
        margin-bottom: 24px;
      }
    }
  }
  .apply-conatiner {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 70px;
    bottom: 50px;
    h4 {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      font-size: 24px;
      color: #ccc;
    }
    .apply-list-container {
      position: absolute;
      top: 40px;
      bottom: 0px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      overflow-y: scroll;
    }
    .apply-list-container::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .apply-list-container::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .apply-list-container::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
.page-position {
  position: absolute;
  bottom: 0;
  right: 0;
}
.invite-list {
  width: 80%;
  margin-left: 10%;
  margin-top: 10px;
  text-align: left;
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    list-style: none;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ddd;
  }
}
</style>
