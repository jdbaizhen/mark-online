<template>
  <section>
    <Card>
      <p slot="title"><Icon type="ios-mail-outline" />  {{applyInfo.userInfo.userEmail}}</p>
      <p slot="extra">
        <Button type="success" size="small" @click="handleSubmit(applyInfo.userApplyId)">通过</Button>
      </p>
      <ul>
        <li><Icon type="ios-contact-outline" />  账号: {{applyInfo.userInfo.userName}}</li>
        <li><Icon type="ios-happy-outline" />  姓名: {{applyInfo.userInfo.userRealName}}</li>
        <li><Icon type="ios-clock-outline" />  邀请时间: {{applyInfo.userApplyCreateTime}}</li>
        <li><Icon type="ios-clock-outline" />  更新时间: {{applyInfo.userApplyUpdateTime}}</li>
      </ul>
    </Card>
  </section>
</template>

<script>
export default {
  props: {
    applyInfo: Object
  },
  data () {
    return {

    }
  },
  methods: {
    handleSubmit (userApplyId) {
      this.$emit('handleSubmitApplyPerson', userApplyId)
    }
  }
}
</script>

<style scoped lang="less">
section {
  width: 48%;
  margin: 20px 1% 0px 1%;
  ul {
    margin: 0;
    li {
      list-style: none;
    }
  }
}
</style>
