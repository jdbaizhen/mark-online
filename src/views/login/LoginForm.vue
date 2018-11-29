<template>
  <div class="login-form-container">
    <v-title title="登陆"/>
    <div style="margin-top: 0px">
        <Input placeholder="账号 / 邮箱" size="large" v-model="loginForm.userName">
            <Icon type="ios-contact" slot="prefix" />
        </Input>
    </div>
    <div style="margin-top: 20px">
        <Input placeholder="密码" type="password" size="large" v-model="loginForm.userPassword">
            <Icon type="md-lock" slot="prefix" />
        </Input>
    </div>
    <section class="login-operate">
      <Checkbox v-model="rememberPassword">    记住密码</Checkbox>
      <a @click="toggle" style="position:absolute;right:0px;">注册账号</a>
    </section>
    <div>
      <Button type="success" size="large" long ghost @click="loginCookie">登陆</Button>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title.vue'
import { mapMutations } from 'vuex'
import { dataFormat, setCookie, getCookie, clearCookie, setSession } from '@/utils/util.js'
import URL from '@/api/login.js'
import axios from 'axios'
import md5 from 'blueimp-md5'
export default {
  name: 'LoginForm',
  components: {
    'v-title': Title
  },
  data () {
    return {
      loginForm: {
        userName: '',
        userPassword: ''
      },
      rememberPassword: false
    }
  },
  mounted () {
    let username = getCookie('userName')
    let userpassword = getCookie('userPassword')
    if (username && userpassword) {
      this.loginForm.userName = username
      this.loginForm.userPassword = userpassword
      this.rememberPassword = true
    }
  },
  methods: {
    ...mapMutations(['changeCurrentPage']),
    toggle () {
      this.changeCurrentPage(1)
    },
    loginCookie () {
      if (this.rememberPassword) {
        setCookie('userName', this.loginForm.userName, 30)
        setCookie('userPassword', this.loginForm.userPassword, 30)
      } else {
        clearCookie('userName');
        clearCookie('userPassword');
      }
      this.postLoginIfo()
    },
    postLoginIfo () {
      let userName = this.loginForm.userName
      let userPassword = md5(userName+"@$#"+this.loginForm.userPassword)
      let params = dataFormat({userName: userName, userPassword: userPassword})
      axios({
        url: `${URL.login}?${params}`,
        method: 'get',
      }).then( res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          // 将所有权限缓存
          setSession('token', data.token)
          setSession('userId', data.userId)
          setSession('userName', data.userName)
          setSession('userRealName', data.userRealName)
          if (data.userRoleList.length > 0) {
            setSession('privilegeList', data.userRoleList[0].privilegeList)
            setSession('roleName', data.userRoleList[0].roleName)
          }
          this.$router.push({name: 'project'})
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login-form-container {
  position: relative;
  background: #fff;
  width: 400px;
  height: 350px;
  padding: 25px 50px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px #ccc;
  .login-operate {
    position: relative;
    display: flex;
    flex-direction: row;
    margin: 20px 0 8px 0;
    line-height: 31px;
  }
}
</style>
