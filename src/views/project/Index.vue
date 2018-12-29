<template>
  <section class="project-container">
    <section class="project-slide">
      <slide-bar/>
    </section>
    <section class="project-main">
      <transition name="project" mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
    <footer>
      ICP备案号：苏ICP备14051273号-1     江苏丰华联合科技有限公司版权所有
    </footer>
  </section>
</template>

<script>
import SlideBar from '@/components/SlideBar.vue'
export default {
  components: {
    'slide-bar': SlideBar
  }
}
</script>

<style scoped lang="less">
.project-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  .project-slide {
    flex: 1;
  }
  .project-main {
    flex: 9;
    margin: 20px 20px 50px 20px;
  }
.project-enter-active {
  transition: all .3s ease;
}
.project-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.project-enter, .project-leave-to
/* .project-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
  footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
  } 
}

</style>
