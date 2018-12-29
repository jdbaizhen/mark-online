<template>
  <section class="create-container">
    <section class="create-content">
      <Steps :current="current">
          <Step title="基本信息" content="填写项目的基础信息"></Step>
          <Step title="自定义属性" content="配置项目类型和自定义标注属性"></Step>
          <Step title="配置成功" content="配置基本完成，可以导入项目所需原始素材"></Step>
      </Steps>
      <section class="create-form">
        <section v-if="current===0" class="create-every">
          <config-project-form/>
        </section>
        <section v-else-if="current===1" class="create-step-two">
          <section class="create-step-two-radio">
             <RadioGroup v-model="create.labelTypeId" vertical @on-change="handleChangeLabelTypeId">
              <Radio v-for="(item, index) in projectTypes" :key="index" :label="item.labelTypeId">
                  <span>{{item.labelTypeName}}: {{item.labelTypeInstruction}}</span>
              </Radio>
          </RadioGroup>
          </section>
          <section class="two-form">
            <section class="two-form-left">
              <h3 style="margin-bottom: 20px;">选择工具: </h3>
              <section v-for="(item, index) in projectTypes" :key="index">
                <card-chose v-show="item.labelTypeId===create.labelTypeId" :utilsTypes="item.labelToolInfoList" :projectType="item.labelTypeStatus"/>
              </section>
              <h3 style="margin: 30px 0px 20px 0px;">上传示例图: </h3>
              <upload :multiple="true" @getImageList="getImageList"/>
            </section>
            <section class="two-form-right">
              <config-mark-form/>
            </section> 
          </section>
          <Button type="success" style="margin:20px auto; width: 150px;" @click="submitCreateProjectStepTwo">下一步</Button>
        </section>
        <section v-else-if="current===2" class="create-step-three">
          <Icon type="md-checkmark-circle" size="180" color="#66CD00"/>
          <h1 style="color:#00CD00;">项目发布成功</h1>
          <section style="border:1px dashed #ccc; margin: 40px auto;"></section>
          <p style="font-size:14px;color:#ccc;">系统将在{{countdown}}秒后自动跳转至项目列表页,如果没有请 <a @click="goProject">点击手动跳转</a></p>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
import ConfigProjectForm from './form/ConfigProjectForm.vue'
import ConfigMarkForm from './form/ConfigMarkForm.vue'
import CardChose from '@/components/CardChose.vue'
import Upload from '@/components/Upload.vue'
import { mapMutations, mapState } from 'vuex' 
export default {
  components: {
    'config-project-form': ConfigProjectForm,
    'config-mark-form': ConfigMarkForm,
    'card-chose': CardChose,
    'upload': Upload
  },
  data () {
    return {
      createType: 1,
      countdown: 5
    }
  },
  mounted () {
    this.$store.dispatch('createSchedule')
  },
  methods: {
    ...mapMutations(['clearLabelTools', 'updatePictureInfo', 'updateCurrent', 'finishCurrent', 'updateLabelTypeId']),
    getImageList (list) {
      this.updatePictureInfo(list)
    },
    submitCreateProjectStepTwo () {
      this.$store.dispatch('addProjectStepTwo').then(res => {
        if (res.data.result) {
          this.updateCurrent()
          this.countTime()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    countTime (value=false) {
      if (!value) {
        var timeout = setInterval(() => {
          this.countdown -= 1
        }, 1000)
      } else {
        clearInterval(timeout)
        this.countdown = 5
      }
    },
    goProject () {
      this.$router.push({path: '/main/project/list'})
      this.countTime(true)
      this.finishCurrent()
    },
    handleChangeLabelTypeId (id) {
      this.updateLabelTypeId(id)
    }
  },
  computed: {
    ...mapState(['create']),
    current () {
      return this.$store.state.create.current
    },
    projectTypes () {
      return this.$store.state.create.projectTypes
    }
  },
  watch: {
    'create.labelTypeId': function() {
      this.clearLabelTools()
    },
    'countdown': function(newCount) {
      if (newCount === 0) {
        this.countTime(true)
        this.$router.push({path: '/main/project/list'})
        this.finishCurrent()
      }
    }
  }
}
</script>

<style scoped lang="less">
.create-container {
  .create-content {
    padding: 30px;
    border: 1px solid rgba(2,3,4,0.1);
    box-shadow: 2px 2px 2px #eee;
    width: 70%;
    margin-left: 15%;
    margin-top: 30px;
    .create-form {
      .create-every {
        width: 50%;
        margin: 50px auto;
      }
      .create-step-two {
        width: 100%;
        display: flex;
        flex-direction: column;
        .create-step-two-radio {
          margin: 20px auto;
        }
        .two-form {
          display: flex;
          flex-direction: row;
          .two-form-left {
            border: 1px solid rgba(236, 221, 221, 0.5);
            box-shadow: 1px 1px 1px #ccc;
            padding: 20px;
            margin-right: 20px;
            flex: 1;
          }
          .two-form-right {
            flex: 2
          }
        }
      }
      .create-step-three {
        width: 50%;
        margin: 50px auto;
        text-align: center;
      }
    }
  }
}
</style>
