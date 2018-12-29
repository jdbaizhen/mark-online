<template>
  <div class="main">
    <section class="navbar">
      <nav-bar/>
    </section>
    <section class="container">
      <transition name="transition-main" mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import { getSession } from '@/utils/util.js'
  import { mapMutations } from 'vuex'
  export default {
    components: {
      'nav-bar': NavBar
    },
    data () {
      return {}
    },
    methods: {
      ...mapMutations(['updatePriviledgeList'])
    },
    mounted () {
      // 防止刷新后清空VUEX权限
      let privilegeList = getSession('privilegeList')
      this.updatePriviledgeList(privilegeList.split(','))
    }
  }
</script>

<style lang="less" scoped>
.main {
  position: relative;
  height: 100%;
  overflow: hidden;
  .navbar {
    padding-bottom: 10px;
    background: #eee;
  }
  .container {
    position: absolute;
    top: 70px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    .transition-main-enter {
      transform: translateX(100%);
      opacity: 0;
    }
    .transition-main-leave-to {
      transform: translateX(-100%);
      opacity: 0;
    }
    .transition-main-enter-active, .transition-main-leave-active {
      transition: all 0.5s ease-in-out;
    }
    .transiton-main-enter, .transition-main-leave {
      opacity: 1;
    }
  }
}
</style>
