<template>
  <section class="navbar-container">
    <img :src="logoDarkUrl" alt="">
    <section class="navbar-user">
      <router-link to="/main/project/list" style="margin:0 15px"><Icon type="ios-home-outline" size="28"/></router-link>
      <router-link to="/main/create_project" style="margin:0 15px" v-show="save_project"><Icon type="ios-add-circle-outline" size="28"/></router-link>
      <router-link to="/main/account" style="margin:0 15px; font-size: 16px"><Icon type="ios-contact-outline" size="28"/>{{username}}</router-link>
      <span style="margin:0 15px; font-size: 16px; cursor: pointer; color: #ccc;" @click="logout">注销</span>
    </section>
  </section>
</template>

<script>
  import logoLightUrl from '@/assets/logo.png'
  import logoDarkUrl from '@/assets/logo2.png'
  import { mapMutations } from 'vuex'
  import { axiosFormat, getSession } from '@/utils/util.js'
  import URL from '@/api/login.js'
  export default {
    data () {
      return {
        logoDarkUrl: logoDarkUrl,
        logoLightUrl: logoLightUrl,
        username: null,
        token: null,
        save_project: false  // 发布任务权限
      }
    },
    mounted () {
      let token = getSession('token')
      let username = getSession('userRealName')
      let privilegeList = getSession('privilegeList')
      if (!token) {
        this.$router.push({path: '/'}) // 未登录直接返回到登陆页面
      } else {
        this.username = username
        this.token = token
        if (privilegeList.indexOf('save_project') !== -1) {
          this.save_project = true
        }
      }
    },
    methods: {
      ...mapMutations(['clearPriviledgeList']),
      logout () {
        axiosFormat(URL.logout, 'get').then( res => {
          if (res.data.result) {
            sessionStorage.clear()
            this.clearPriviledgeList()
            this.$router.push({path: '/'})
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.navbar-container {
  position: relative;
  height: 60px;
  line-height: 60px;
  padding: 0 40px 0 20px;
  background: #fff;
  img {
    position: relative;
    top: 10px;
    width: 114px;
    height: 29px;
  }
  .navbar-user {
    float: right;
    font-size: 18px;
  }
  .router-link-active {
    color: red;
  }
}
</style>
