<template>
  <section class="mark-info-container">
    <header>
      <i-circle :percent="percent" :size="120" dashboard>
        <div>
          <p>完成度</p>
          <span>
            <i>{{percent | formatCompleteNumber}}%</i>
          </span>
        </div>
      </i-circle>
    </header>
    <main>
      <section
        v-for="(item, index) in squareInfoList"
        :key="item.squareX+'-'+item.squareY"
        @click="activeRectIndex(index)"
      >
        <section class="mark-info-chose">
          <p>矩形{{index+1}}号:</p>
          <select-list
            :SelectList="selectListData"
            @listFormat="rectListFormat"
            :projectPropertyId="item.projectPropertyId"
          />
        </section>
      </section>
      <section
        v-for="(item, index) in polygonInfoVOList"
        :key="item.polygonInfoList[0].polygonX+'-'+item.polygonInfoList[0].polygonY"
        @click="activePolygonIndex(index)"
      >
        <section class="mark-info-chose">
          <p>多边形{{index+1}}号:</p>
          <select-list
            :SelectList="selectListData"
            @listFormat="polygonsListFormat"
            :projectPropertyId="item.projectPropertyId"
          />
        </section>
      </section>
    </main>
    <footer>
      <Button long ghost type="success" @click="submitMarkData" :loading="submitLoading">提交数据</Button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import vm from "@/utils/vm";
import SelectList from "@/components/SelectList.vue";
export default {
  props: {
    rects: Array,
    polygons: Array,
    dots: Array
  },
  components: {
    "select-list": SelectList
  },
  data() {
    return {
      submitLoading: false,
      selectListData: [],
      rectIndex: "",
      squareInfoList: [],
      polygonsIndex: "",
      polygonInfoVOList: [],
      pointMarkInfoVO: []
    };
  },
  mounted() {
    this.getProperty();
  },
  watch: {
    rects: function(newList) {
      this.initSquareInfoList(newList);
    },
    polygons: function(newList) {
      this.polygonsFormat(newList);
    },
    dots: function(newList) {
      this.dotsFormat(newList);
    }
  },
  methods: {
    ...mapMutations(['updateMarkProperty']),
    ...mapActions(["searchProjectPropertyAction", "submitMarkDataAction"]),
    //获取自定义属性
    getProperty() {
      this.searchProjectPropertyAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.selectListData = data;
          this.updateMarkProperty(data);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    //激活对应的矩形
    activeRectIndex(index) {
      this.rectIndex = index;
      vm.$emit("changeActiveRect", index);
    },
    //初始化矩形数据
    initSquareInfoList(list) {
      let newList = [];
      let squareInfoList = this.squareInfoList;
      list.map((item, index) => {
        let projectPropertyId;
        try {
          projectPropertyId = squareInfoList[index].projectPropertyId;
        } catch (e) {
          projectPropertyId = [];
        }
        let obj = {
          squareX: item.x * this.scaleWidth,
          squareY: item.y * this.scaleHeight,
          squareW: item.w * this.scaleWidth,
          squareH: item.h * this.scaleHeight,
          projectPropertyId: projectPropertyId
        };
        newList.push(obj);
        obj = null;
      });
      this.squareInfoList = newList;
    },
    //添加矩形对应属性
    rectListFormat(value) {
      let index = this.rectIndex;
      this.squareInfoList[index].projectPropertyId = value;
    },
    //激活对应多边形
    activePolygonIndex(index) {
      this.polygonsIndex = index;
      vm.$emit("changeActivePolygon", index);
    },
    //初始化多边形数据
    polygonsFormat(list) {
      let polygonInfoVOList = this.polygonInfoVOList;
      let polygonList = [];
      list.map((item, index) => {
        let polygonInfoList = [];
        let projectPropertyId;
        try {
          projectPropertyId = polygonInfoVOList[index].projectPropertyId;
        } catch (e) {
          projectPropertyId = [];
        }
        item.map(ite => {
          let obj = {
            polygonX: ite.x * this.scaleWidth,
            polygonY: ite.y * this.scaleHeight
          };
          polygonInfoList.push(obj);
          obj = null;
        });
        let obj = {
          projectPropertyId,
          polygonInfoList
        };
        polygonList.push(obj);
        obj = null;
      });
      this.polygonInfoVOList = polygonList;
    },
    //添加多边形属性
    polygonsListFormat(value) {
      let index = this.polygonsIndex;
      this.polygonInfoVOList[index].projectPropertyId = value;
    },
    //初始化点数据
    dotsFormat(list) {
      let pointInfoList = [];
      list.map(item => {
        let obj = {
          pointX: item.x * this.scaleWidth,
          pointY: item.y * this.scaleHeight
        };
        pointInfoList.push(obj);
        obj = null;
      });
      this.pointMarkInfoVO = pointInfoList;
    },
    //提交标注数据
    submitMarkData() {
      this.$Modal.confirm({
        title: `确认提交数据？？？`,
        content: "<p>提交后暂时不可修改！！！</p>",
        onOk: () => {
          this.submitLoading = true;
          let data = {
            squareInfoList: this.squareInfoList,
            polygonInfoVOList: this.polygonInfoVOList
          };
          this.submitMarkDataAction(data).then(res => {
            if (res.data.result) {
              vm.$emit("updateMarkPicture"); //发送至Mark组件,用来获取新图片
              vm.$emit("deleteAllMarkInfo"); //发送至MarkPage组件，删除当前标注的所有框
              this.submitLoading = false;
            }
          });
        }
      });
    }
  },
  computed: {
    ...mapState(["mark"]),
    //计算任务完成度
    percent: function() {
      return (
        ((this.mark.imgInfo.pictureCount - this.mark.imgInfo.countPage) /
          this.mark.imgInfo.pictureCount) *
        100
      );
    },
    scaleWidth: function() {
      return this.mark.imgInfo.width / this.mark.imgInfo.width;
    },
    scaleHeight: function() {
      return this.mark.imgInfo.height / this.mark.imgInfo.height;
    }
  },
  filters: {
    formatCompleteNumber(value) {
      return value.toFixed(2);
    }
  }
};
</script>

<style scoped lang="less">
.mark-info-container {
  padding: 20px;
  height: 100%;
  header {
    height: 15%;
    text-align: center;
    font-size: 18px;
    p {
      font-weight: bold;
      margin-bottom: 8px;
    }
  }
  main {
    margin: 2% 0;
    height: 78%;
    overflow: auto;
    .mark-info-chose {
      margin-bottom: 10px;
      padding: 10px 10px 0px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 1px 1px 1px #ddd;
      p {
        color: deepskyblue;
        margin-bottom: 10px;
      }
    }
  }
  footer {
    margin-top: 20px;
  }
}
</style>
