<template>
  <section class="audit-info">
    <Modal v-model="addRejectPersonShow">
      <p slot="header" style="color:green;text-align:center">
        <Icon type="md-add"></Icon>
        <span>添加驳回理由</span>
      </p>
      <div style="text-align:center">
        <Input
          type="text"
          placeholder="请输入驳回理由"
          v-model="rejectString"
          style="width:80%;margin-left:10%;margin-bottom:20px;"
        >
          <Icon type="md-mail" slot="prepend"></Icon>
        </Input>
        <h4
          style="padding: 5px 0px; background: rgba(25,190,107,0.5);width:80%;margin-left:10%;"
        >理由列表</h4>
        <h4 style="margin-top: 10px; color: #ddd;" v-if="rejectReasonAry.length===0">暂无数据</h4>
        <ul class="reject-list" v-else>
          <li v-for="(item, index) in rejectReasonAry" :key="index">
            <span>理由: {{item}}</span>
            <span>
              <Icon
                type="md-close"
                style="cursor:pointer"
                @click="handleDeleteRejectReason(index)"
              />
            </span>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="info" size="small" @click="handleAddReasonString">
          <Icon type="md-add"/>添加
        </Button>
        <Button type="success" size="small" @click="handleSubmitRejectReasonAry">提交</Button>
      </div>
    </Modal>
    <header>
      <Tag color="cyan" class="header-tag">剩余量 : {{audit.imgInfo.countPage}}</Tag>
    </header>
    <main>
      <h2>属性确认</h2>
      <section  v-if="projectPropertyId.length>0" >
        <section v-for="(item, index) in projectPropertyId" :key="index">
          <select-list
            :SelectList="audit.propertyList"
            :projectPropertyId="item.projectPropertyId"
            :disabled="true"
          />
        </section>
      </section>
      <section v-else>
        <select-list
            :SelectList="audit.propertyList"
            :projectPropertyId="[]"
            :disabled="true"
          />
      </section>
    </main>
    <footer>
      <h2>操作区域</h2>
      <div class="reject-container">
        <div class="reject-select">
          <i-select :multiple="true" placeholder="驳回理由选择" v-model="rejectReasonData">
            <i-option
              v-for="item in audit.rejectReason"
              :key="item.rejectReasonId"
              :value="item.rejectReasonId"
            >{{item.rejectReasonName}}</i-option>
          </i-select>
        </div>
        <Tooltip content="添加驳回理由" placement="top">
          <Button type="info" ghost class="reject-add" icon="md-add" @click="showAddModel"></Button>
        </Tooltip>
      </div>
      <div class="operate-btns">
        <Button type="error" @click="handleReject">驳回</Button>
        <Button type="success" @click="handleNext">下一张</Button>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import SelectList from "@/components/SelectList.vue";
export default {
  components: {
    "select-list": SelectList
  },
  data() {
    return {
      addRejectPersonShow: false,
      rejectString: "",
      rejectReasonAry: [],
      rejectReasonData: []
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["updateAuditRejectReason", 'changeMarkStatus' ]),
    ...mapActions(["addRejectReasonAction", "getRejectReasonAction", 'rejectDataAction']),
    showAddModel() {
      this.addRejectPersonShow = true;
    },
    handleDeleteRejectReason(index) {
      this.rejectReasonAry.splice(index, 1);
    },
    handleAddReasonString() {
      this.rejectReasonAry.push(this.rejectString);
      this.rejectString = undefined;
    },
    handleSubmitRejectReasonAry() {
      this.addRejectReasonAction(this.rejectReasonAry).then(res => {
        if (res.data.result) {
          this.getRejectReason();
          this.addRejectPersonShow = false;
          this.rejectReasonAry = [];
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    getRejectReason() {
      this.getRejectReasonAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.updateAuditRejectReason(data);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    handleReject() {
      this.$Modal.confirm({
        title: '确认驳回？',
        onOk: () => {
          this.rejectDataAction(this.rejectReasonData).then(res => {
            if (res.data.result) {
              this.$Message.success('驳回成功');
              this.rejectReasonData = [];
              this.changeMarkStatus() //修改框的颜色
            } else {
              this.$Message.error(res.data.message);
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消驳回');
        }
      });
    },
    handleNext () {
      this.$Modal.confirm({
        title: '确认本图已审核完成？',
        onOk: () => {
          this.$emit('getNextPicture')
        },
        onCancel: () => {
          this.$Message.info('取消');
        }
      });
    }
  },
  computed: {
    ...mapState(["audit"]),
    'projectPropertyId': function () {
      return this.audit.projectPropertyId
    }
  }
};
</script>

<style scoped lang="less">
.reject-list {
  width: 80%;
  margin-left: 10px;
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
.audit-info {
  position: relative;
  height: 100%;
  padding: 20px 0px;
  h2 {
    color: #13c2c2;
    margin-bottom: 10px;
    font-weight: 520;
  }
  header {
    margin-bottom: 20px;
    .header-tag {
      margin-left: 10%;
      width: 80%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
    }
  }
  main {
    padding: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #87e8de;
  }
  footer {
    width: 100%;
    padding: 20px;
    .reject-container {
      display: flex;
      flex-direction: row;
      .reject-select {
        flex: 9;
      }
      .reject-add {
        width: 40px;
      }
    }
  }
  .operate-btns {
      position: absolute;
      bottom: 50px;
      left: 10px;
      right: 10px;
      button {
        width: 46%;
        margin: 0% 2%;
      }
    }
}
</style>
