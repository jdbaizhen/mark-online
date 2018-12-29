<template>
  <section>
    <Spin size="large" v-show="detail.loading" fix></Spin>
    <v-title :title="introduce.projectName"/>
    <p>
      <Icon type="ios-paper-plane-outline"/>
      项目介绍: {{introduce.projectIntroduceInfo}}
    </p>
    <p class="detail-time">
      <Icon type="ios-timer-outline"/>
      起始时间: {{introduce.projectCreateTime}}
    </p>
    <p class="detail-time">
      <Icon type="ios-timer-outline"/>
      终止时间: {{introduce.projectExpiryDate}}
    </p>
    <p style="margin:20px 0 10px 0">
      <Icon type="ios-image-outline"/>图片示例:
    </p>
    <ul class="detail-images" @click="handleChangePicture($event)">
      <li v-for="(item, index) in introduce.projectPictureList" :key="index">
        <img :src="item.projectPictureUrl" alt>
      </li>
    </ul>
    <Modal
        title="图片详情"
        v-model="currentPicShow"
        :footer-hide="true"
        :styles="{top: '20px',width: '80%'}">
        <img :src="currentPicture" style="width: 100%" alt="">
    </Modal>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    "v-title": Title
  },
  data() {
    return {
      currentPicShow: false,
      currentPicture: '',
      introduce: {}
    };
  },
  mounted() {
    this.getProjectData();
  },
  watch: {
    $route() {
      this.getProjectData();
    }
  },
  methods: {
    ...mapActions(["getProjectIntroduce"]),
    ...mapMutations(["closeLoading"]),
    getProjectData() {
      this.getProjectIntroduce().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data);
          this.introduce = data;
          this.closeLoading();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    //图片放大
    handleChangePicture(e) {
      this.currentPicShow = true
      this.currentPicture = e.target.currentSrc
    }
  },
  computed: mapState(["detail"])
};
</script>

<style scoped lang="less">
section {
  height: 100%;
  overflow: auto;
  p {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 550;
    letter-spacing: 1px;
  }
  .detail-time {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
  .detail-images {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 20px;
    li {
      list-style: none;
      width: 350px;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 5px;
      border: 1px dashed #ccc;
      border-radius: 2px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
