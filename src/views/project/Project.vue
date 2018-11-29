<template>
  <section>
    <Button @click="showForm = true" type="primary">发布项目</Button>
    <Drawer title="发布项目" width="400px" v-model="showForm">
      <config-project-form/>
      <config-mark-form/>
      <Button type="success" long>发布</Button>
    </Drawer>
  </section>
</template>

<script>
import ConfigMarkForm from './form/ConfigMarkForm'
import ConfigProjectForm from './form/ConfigProjectForm'
export default {
  components: {
    'config-mark-form': ConfigMarkForm,
    'config-project-form': ConfigProjectForm
  },
  data () {
    return {
       showForm: false,
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
 .ivu-drawer-body::-webkit-scrollbar {/*滚动条整体样式*/
    width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
    background-color:  skyblue;
}
 .ivu-drawer-body::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.44, rgb(122,153,217)), color-stop(0.72, rgb(73,125,189)), color-stop(0.86, rgb(28,58,148)));
}
 .ivu-drawer-body::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color:  skyblue;
    border-radius: 10px;
}
</style>
