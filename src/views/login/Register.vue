<template>
  <section class="register-container">
    <v-title title="注册"/>
    <section style="width: 80%;margin: -20px auto 20px auto;">
      <Steps :current="current">
          <Step title="基本信息" icon="ios-brush"></Step>
          <Step title="邮箱验证" icon="ios-mail"></Step>
          <Step title="注册完成" icon="ios-checkbox"></Step>
      </Steps>
    </section>
    <section style="width: 50%; margin: 40px auto 20px auto;" v-if="current===0">
      <i-form ref="formRegister" :model="registerForm" :rules="registerFormRules" :label-width="80">
        <FormItem label="账户类型" prop="type">
          <RadioGroup v-model="registerForm.type">
            <Radio v-for="(item, index) in types" :key="index" :label="item.value" style="padding:0px 20px;">{{item.label}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户名" prop="userName">
          <Input v-model="registerForm.userName" placeholder="Enter your username"/>
        </FormItem>
        <FormItem label="真实姓名" prop="userRealName">
          <Input v-model="registerForm.userRealName" placeholder="Enter your realname"/>
        </FormItem>
        <FormItem label="联系电话" prop="userTelephone">
          <Input v-model="registerForm.userTelephone" placeholder="Enter your telephone"/>
        </FormItem>
        <FormItem label="邮箱" prop="userEmail">
          <Input v-model="registerForm.userEmail" type="email" placeholder="Enter your email"/>
        </FormItem>
        <FormItem label="密码" prop="userPassword">
          <Input v-model="registerForm.userPassword" type="password" placeholder="Enter your password"/>
        </FormItem>
        <FormItem label="确认密码" prop="userPasswordConfirm">
          <Input v-model="registerForm.userPasswordConfirm" type="password" placeholder="Confirm your password"/>
        </FormItem>
        <FormItem style="text-align: left;">
          <Button type="success" ghost style="margin-right: 25px;" @click="handleSubmit('formRegister')"> 下一步 </Button>
          <Button type="info" ghost @click="handleReset('formRegister')">清空</Button>
        </FormItem>
      </i-form>
    </section>
    <section v-else-if="current===1">
      <Icon type="ios-mail-open" size="180" color="#ddd"/>
      <h5>请在您的邮箱中获取验证码</h5>
      <Input placeholder="验证码" autofocus prefix="ios-finger-print" v-model="activeCode" size="large" style="margin-top: 30px; width: 150px;" @on-keydown.enter="postRegisterInfo"/>
      <section class="register-warning">
        <p>没有收到邮件?</p>
        <ol>
          <li>请检查邮箱地址是否正确,你可以返回<a @click="goBack">重新填写</a></li>
          <li>检查你的邮件垃圾箱</li>
          <li>若仍未收到确认,请尝试<a @click="goBack">重新填写</a>发送</li>
        </ol>
      </section>
    </section>
    <section v-else-if="current===2">
      <Icon type="md-checkmark-circle" size="180" color="#66CD00"/>
      <h1 style="color:#00CD00;">恭喜您注册成功</h1>
      <section style="border:1px dashed #ccc; margin: 40px auto;"></section>
      <p style="font-size:14px;color:#ccc;">系统将在{{countdown}}秒后自动跳转至登录页,如果没有请 <a @click="toggle">点击手动跳转</a></p>
    </section>
    <Button type="text" @click="toggle" class="login-btn">登陆</Button>
  </section>
</template>

<script>
import Title from '@/components/Title.vue'
import { mapMutations } from 'vuex'
import axios from 'axios'
import { setSession, getSession } from '@/utils/util.js'
import URL from '@/api/login.js'
export default {
  components: {
    'v-title': Title
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系电话不能为空'))
      } else if (!(/^1[34578]\d{9}$/.test(value))) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      } else if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))) {
        return callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else if (!(/^[A-Za-z0-9]{6,20}$/.test(value))) {
        return callback(new Error('请输入6-20位字母数字组合'))
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码确认不能为空'))
      } else if (value !== this.registerForm.userPassword) {
        return callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        userName: '',
        userRealName: '',
        userTelephone: null,
        userEmail: '',
        userPassword: '',
        userPasswordConfirm: '',
        type: ''
      },
      registerFormRules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        userRealName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        userTelephone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        userEmail: [
          { required: true, validator: validateEmail, trigger: 'blur'}
        ],
        userPassword: [
          { required: true, validator: validatePassword, trigger: 'blur'}
        ],
        userPasswordConfirm: [
           { required: true, validator: validatePasswordConfirm, trigger: 'blur'}
        ],
        type: [
          { required: true, message: '选择账号类型', trigger: 'change' }
        ]
      },
      types: [
        { label: '企业', value: '0'},
        { label: '个人', value: '1'},
      ],
      current: 1,
      countdown: 5, // 倒计时
      activeCode: null, //激活码
    }
  },
  mounted () {
    let sessionCurrent = getSession('current')
    if (!sessionCurrent) {
      this.current = 0
      setSession('current', 0)
    } else {
      this.current = Number(sessionCurrent)
    }
  },
  methods: {
    ...mapMutations(['changeCurrentPage']),
    toggle () {
      this.changeCurrentPage(0)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.sendEmail()
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    postRegisterInfo () {
      let obj = {
        userName: this.registerForm.userName,
        userRealName: this.registerForm.userRealName,
        userTelephone:this.registerForm.userTelephone,
        userEmail: this.registerForm.userEmail,
        userPassword: this.registerForm.userPassword,
        type: this.registerForm.type,
        code: this.activeCode
      }
      // let params = dataFormat(obj)
      axios({
        url: URL.registerForm,
        method: 'post',
        data: obj
      }).then(res => {
        if (res.data.result) {
          this.$Message.success('Success!');
          this.current = 2
          this.countDown()
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    sendEmail () {
      let params = {userName: this.registerForm.userName, userEmail: this.registerForm.userEmail}
      axios({
        url: URL.sendEmail,
        method: 'post',
        data: params
      }).then( res => {
        if (res.data.result) {
          this.current = 1;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    goBack () {
      this.current = 0
    },
    countDown () {
      setInterval(() => {
        this.countdown -= 1
      }, 1000)
    }
  },
  watch: {
    'current': function(newCurrent) {
      setSession('current', newCurrent)
    },
    'countdown': function(newCount) {
      if (newCount === 0) {
        this.toggle()
        setSession('current', 0)
      }
    }
  }
}
</script>

<style scoped lang="less">
.register-container {
  position: relative;
  width: 800px;
  height: 650px;
  padding: 30px 50px;
  background: #fff;
  box-shadow: 2px 2px 5px #ccc;
  text-align: center;
  .login-btn {
    position: absolute;
    bottom: 20px;
    right: 60px;
  }
  .register-warning {
    margin: 30px auto;
    width: 300px;
    padding: 20px;
    text-align: left;
  }
}
</style>
