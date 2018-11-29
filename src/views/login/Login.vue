<template>
  <div class="login-container">
    <login-form v-if="this.$store.state.login.currentPage === 0"/>
    <register-form v-else-if="this.$store.state.login.currentPage === 1"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from './LoginForm.vue'
import Register from './Register.vue'
import { getSession } from '@/utils/util.js'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  components: {
    'login-form': LoginForm,
    'register-form': Register
  },
  data () {
    return {
    }
  },
  mounted () {
    this.getCurrentPage()
  },
  methods: {
    ...mapMutations(['changeCurrentPage']),
    getCurrentPage () {
      let value = Number(getSession('currentPage'))
      this.changeCurrentPage(value)
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  background: url('../../assets/login-bg.jpg');
  background-size: 100% 50%;
  background-repeat: no-repeat;
}
</style>

