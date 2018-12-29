<template>
  <section class="audit-container">
    <nav>
      <ColorPicker v-model="color"/>
      <i-select name="opacity" v-model="opacityNumber">
        <i-option v-for="(item, index) in opacity" :value="item" :key="index">{{item}}</i-option>
      </i-select>
    </nav>
    <main>
      <Spin size="large" fix v-if="imgLoading"></Spin>
      <svg
        ref="svgAudit"
        class="svg-container"
        :width="imgWidth"
        :height="imgHeight"
        :style="`background-image:url(${imgData.imagePath});left:${svgPos.svgLeft};top:${svgPos.svgTop}`"
        cursor="move"
      >
        <audit-rect
          :color="color"
          :opacityNumber="opacityNumber"
        ></audit-rect>
        <audit-polygon
          :color="color"
          :opacityNumber="opacityNumber"
        ></audit-polygon>
      </svg>
    </main>
    <aside>
      <audit-info @getNextPicture="getNextPicture"/>
    </aside>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import AuditRect from "./component/audit/AuditRect.vue";
import AuditPolygon from "./component/audit/AuditPolygon.vue";
import AuditInfo from "./component/audit/AuditInfo.vue";
export default {
  components: {
    "audit-rect": AuditRect,
    "audit-polygon": AuditPolygon,
    "audit-info": AuditInfo
  },
  data() {
    return {
      imgLoading: false,
      isMouseDown: false,
      initPos: {},
      svgPos: {
        svgLeft: 0,
        svgTop: 0
      },
      wheelDelta: 0.02,
      color: "#000000",
      opacityNumber: 0.3,
      opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
      imgData: {}
    };
  },
  created() {},
  mounted() {
    let svgElem = this.$refs.svgAudit;
    /**
     * 图片缩放
     */
    svgElem.addEventListener("mousewheel", event => {
      event.stopPropagation();
      event.preventDefault();
      // event.wheelDeltaY的正负表示放大还是缩小
      if (event.wheelDeltaY > 0) {
        this.changeAuditScale(this.wheelDelta);
      } else if (event.wheelDeltaY < 0 && 1920 * this.audit.scale > 320) {
        this.changeAuditScale(this.wheelDelta * -1);
      }
    });
    /**
     * 拖拽初始化
     */
    svgElem.addEventListener(
      "mousedown",
      event => {
        this.isMouseDown = true;
        // 鼠标相对于svg的位置差值
        this.initPos = {
          initX: event.offsetX,
          initY: event.offsetY
        };
      },
      false
    );
    /**
     * 拖拽
     */
    svgElem.addEventListener(
      "mousemove",
      event => {
        event.preventDefault();
        if (this.isMouseDown) {
          let moveX = event.clientX - 60;
          let moveY = event.clientY - 70;
          this.svgPos.svgLeft = moveX - this.initPos.initX;
          this.svgPos.svgTop = moveY - this.initPos.initY;
        }
      },
      false
    );
    /**
     * 拖拽结束
     */
    window.addEventListener("mouseup", event => {
      event.preventDefault();
      this.isMouseDown = false;
    });
    this.initAuditPage();
  },
  methods: {
    ...mapMutations([
      "updateAuditProjectId",
      "updateAuditTaskId",
      "updateAuditImgInfo",
      "changeAuditScale",
      "updateAuditPropertyList",
      "updateAuditRejectReason",
      "updateAuditProjectPropertyId"
    ]),
    ...mapActions([
      "getAuditPictureInfoAction",
      "getProjectPropertyAction",
      "getRejectReasonAction",
      "getNextPictureAction"
    ]),
    async initAuditPage() {
      let taskId = this.$route.query.taskId;
      await this.updateAuditProjectId();
      await this.updateAuditTaskId(taskId);
      this.getPictureInfo();
      this.getPropertyList();
      this.getRejectReason();
    },
    // 获取图片信息
    getPictureInfo() {
      this.imgLoading = true
      this.getAuditPictureInfoAction().then(res => {
        if (res.data.result) {
          this.updateAuditProjectPropertyId([]);  //切换图片清空选中框的属性
          if (res.data.code === '030') {
            this.$router.push({path: '/main/project/task'})
          } else {
            let data = JSON.parse(res.data.data);
            this.imgData = data;
            this.updateAuditImgInfo(data);
          }
          this.imgLoading = false
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    // 获取自定义属性
    getPropertyList() {
      this.getProjectPropertyAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.updateAuditPropertyList(data);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    // 获取驳回理由
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
    // 获取下一张图片
    getNextPicture() {
      this.imgLoading = true
      this.getNextPictureAction().then(res => {
        if (res.data.result) {
          this.updateAuditProjectPropertyId([]);
          if (res.data.code === '030') {
            this.$router.push({path: '/main/project/task'})
          } else {
            let data = JSON.parse(res.data.data);
            this.imgData = data;
            this.updateAuditImgInfo(data);
          }
          this.imgLoading = false
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  },
  computed: {
    ...mapState(["audit"]),
    imgWidth: function() {
      return this.audit.scale * this.audit.imgInfo.width;
    },
    imgHeight: function() {
      return this.audit.scale * this.audit.imgInfo.height;
    }
  }
};
</script>

<style scoped lang="less">
.audit-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  nav {
    width: 60px;
  }
  main {
    flex: 18;
    position: relative;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    .svg-container {
      position: absolute;
      background-size: 100% 100%;
    }
  }
  aside {
    flex: 5;
  }
}
</style>
