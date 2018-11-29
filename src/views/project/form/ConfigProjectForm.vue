<template>
  <section class="config-project-form">
    <i-form
      ref="configProjectForm"
      :model="configProjectForm"
      :rules="configProjectFromRules"
      label-position="left"
      :label-width="80"
    >
      <FormItem label='项目名' prop="projectName">
        <Input v-model="configProjectForm.projectName" placeholder='项目名'/>
      </FormItem>
      <FormItem label='任务张数' prop="taskPictureNumber">
        <Input v-model="configProjectForm.taskPictureNumber" placeholder='每个任务的图片数' number/>
      </FormItem>
      <FormItem label='图片价格' prop="picturePrice">
        <Input v-model="configProjectForm.picturePrice" placeholder='每张图片的标注单价' number />
      </FormItem>
      <FormItem label='截至日期' prop="cutOffDate">
        <DatePicker :value="configProjectForm.cutOffDate" placeholder='选择截至日期' v-model="configProjectForm.cutOffDate" type="date" @on-change="getTime"></DatePicker>
      </FormItem>
      <!-- <FormItem label='标注工具' prop="markUtils">
         <CheckboxGroup v-model="configProjectForm.markUtils">
           <Checkbox v-for="(item, index) in markTypes" :key="index" :label="item.value" >{{item.label}}</Checkbox>
         </CheckboxGroup> 
      </FormItem> -->
      <FormItem label='项目介绍' prop="projectProduce">
        <Input v-model="configProjectForm.projectProduce" type="textarea" :rows="5" placeholder='项目介绍'/>
      </FormItem>
      <FormItem>
        <Button type="success" @click="submitConfigProjectForm('configProjectForm')" ghost style="margin-right: 20px">下一步</Button>
        <Button type="primary" @click="clearConfigProjectForm('configProjectForm')" ghost>清空</Button>
      </FormItem>
    </i-form>
  </section>
</template>

<script>
import { dateFormat } from '@/utils/util.js'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      configProjectForm: {
        projectName: '',
        cutOffDate: '',
        //markUtils: [],
        taskPictureNumber: '',
        picturePrice: '',
        projectProduce: ''
      },
      configProjectFromRules: {
        projectName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        taskPictureNumber: [
          { required: true, type: 'number', message: '任务图片数为非空数字', trigger: 'blur' },
        ],
        picturePrice: [
          { required: true, type: 'number', message: '单张图片价格为非空数字', trigger: 'blur' },
        ],
        projectProduce: [
          { required: true, message: '项目介绍不能为空', trigger: 'blur' },
          { type: 'string', min: 20, message: '项目介绍不少于20个字', trigger: 'blur' }
        ],
        cutOffDate: [
          { required: true, message: '截至时间不能为空', trigger: 'blur'}
        ]
        // markUtils: [
        //   { required: true, type: 'array', min: 1, message: '至少选择一项', trigger: 'change'}
        // ]
      },
      // markTypes: [
      //   { 'label': '矩形', 'type': 'rect', 'value': 1 },
      //   { 'label': '多边形', 'type': 'polygon', 'value': 2 },
      //   { 'label': '点', 'type': 'dot', 'value': 3 }
      // ]
    }
  },
  methods: {
    ...mapActions(['updateConfigForm']),
    getTime () {
      return this.configProjectForm.cutOffDate = dateFormat(this.configProjectForm.cutOffDate)
    },
    submitConfigProjectForm (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (confirm("确认提交？")) {
            this.updateConfigForm(this.configProjectForm)
          }
        }
      })
    },
    clearConfigProjectForm (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .config-project-form {
    padding: 20px;
  }
 .ivu-date-picker {
   width: 100%;
 }
</style>
