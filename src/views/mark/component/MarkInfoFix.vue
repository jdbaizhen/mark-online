<template>
  <section class="mark-info-fix">
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
      <section class="mark-info-reject">
        <h2>驳回理由</h2>
        <ul v-if="mark.rejectReasonList.length>0">
          <li v-for="(item, index) in mark.rejectReasonList" :key="index">{{item}}</li>
        </ul>
        <ul v-else><li>暂无理由</li></ul>
      </section>
      <section class="mark-info-reject">
        <h2>属性选择</h2>
        <select-list
          :SelectList="selectListData"
          :projectPropertyId="mark.currentPropertyList[0]"
          />
      </section>
    </main>
    <footer>
      <div class="operate-btns">
        <Button type="info" @click="submitFixInfo">框提交</Button>
        <Button type="success">下一张</Button>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import SelectList from "@/components/SelectList.vue";
export default {
  props: {
    rects: Array,
    polygons: Array,
    activeRect: Number,
    activePolygon: Number,
    markType: Number
  },
  components: {
    'select-list': SelectList
  },
  data () {
    return {
      selectListData: []
    }
  },
  mounted () {
    this.getProperty()
  },
  methods: {
    ...mapMutations(['updateMarkProperty', 'changeCurrentPropertyList']),
    ...mapActions(["searchProjectPropertyAction", 'submitOneMarkInfoAction']),
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
    // 获取修改的属性
    changeCurrentPropertyList (ary) {
      console.log(ary)
      this.changeCurrentPropertyList(ary)
    },
    //提交数据
    submitFixInfo () {
      let data = this.rects[this.activeRect]
      this.submitOneMarkInfoAction(data).then(res => {
        console.log(res)
      })
    }
  },
  filters: {
    formatCompleteNumber(value) {
      return value.toFixed(2);
    }
  },
  computed: {
    ...mapState(['mark']),
    percent: function() {
      return (
        ((this.mark.imgInfo.pictureCount - this.mark.imgInfo.countPage) /
          this.mark.imgInfo.pictureCount) *
        100
      );
    },
  }
}
</script>

<style scoped lang="less">
.mark-info-fix {
  position: relative;
  height: 100%;
  margin-top: 10px;
  h2 {
    color: #13c2c2;
    margin-bottom: 10px;
    font-weight: 520;
  }
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
    border-bottom: 1px solid #87e8de;
    .mark-info-reject {
      margin: 30px 20px;
      color: red;
      ul {
        margin: 0;
        padding: 0;
        li {
          font-size: 16px;
          height: 35px;
          line-height: 35px;
          list-style: none;
          text-indent:25px;
        }
      }
    }
  }
  footer {
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
