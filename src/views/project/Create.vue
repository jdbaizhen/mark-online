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
             <RadioGroup v-model="createType" vertical>
              <Radio v-for="(item, index) in projectTypes" :key="index" :label="item.labelTypeId">
                  <Icon type="social-apple"></Icon>
                  <span>{{item.labelTypeName}}: {{item.labelTypeInstruction}}</span>
              </Radio>
          </RadioGroup>
          </section>
          <section class="two-form">
            <section class="two-form-left">
              <h3 style="margin-bottom: 20px;">选择工具: </h3>
              <section v-for="(item, index) in projectTypes" :key="index">
                <card-chose v-show="item.labelTypeId===createType" :utilsTypes="item.labelToolInfoList" :projectType="item.labelTypeStatus"/>
              </section>
            </section>
            <section class="two-form-right">
              <config-mark-form/>
            </section> 
          </section>
        </section>
        <section v-else-if="current===2" class="create-every">3</section>
      </section>
    </section>
  </section>
</template>

<script>
import ConfigProjectForm from './form/ConfigProjectForm.vue'
import ConfigMarkForm from './form/ConfigMarkForm.vue'
import CardChose from '@/components/CardChose.vue'
export default {
  components: {
    'config-project-form': ConfigProjectForm,
    'config-mark-form': ConfigMarkForm,
    'card-chose': CardChose
  },
  data () {
    return {
      createType: 1
    }
  },
  mounted () {
    this.$store.dispatch('createSchedule')
  },
  computed: {
    current () {
      return this.$store.state.create.current
    },
    projectTypes () {
      return this.$store.state.create.projectTypes
    }
  }
}
</script>

<style scoped lang="less">
.create-container {
  .create-content {
    padding: 50px;
    border: 1px solid rgba(2,3,4,0.1);
    box-shadow: 2px 2px 2px #eee;
    width: 70%;
    margin-left: 15%;
    margin-top: 3%;
    .create-form {
      margin-top: 30px;
      .create-every {
        width: 70%;
        margin: 0 auto;
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
            flex: 1
          }
          .two-form-right {
            flex: 2
          }
        }
      }
    }
  }
}
</style>
