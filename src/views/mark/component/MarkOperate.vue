<template>
  <section class="mark-aside">
    <RadioGroup vertical v-model.lazy="mark" @on-change="handleChangeMarkType">
      <section class="baseRadio" v-for="(item, index) in markTypes" :key="index" :class="mark===item.labelToolId?'activeRadio':''">
        <Radio :id="item.labelToolId" :label="item.labelToolId">
            <span>{{item.labelToolName}}</span>
        </Radio>
      </section>
    </RadioGroup>  
    <Button @click="handleToggleLine">辅助线</Button>
    <Button @click="handleDelete">删除</Button>
    <Button v-show="mark===2" @click="handleCompletePolygon">多边形完成</Button>
    <ColorPicker v-model="color" @on-change="handleChangeColor"/>
    <i-select name="opacity" v-model="opacityNumber" @on-change="handleChangeOpacity">
      <i-option v-for="(item, index) in opacity" :value="item" :key="index">{{item}}</i-option>
    </i-select>
  </section>
</template>

<script>
import vm from '@/utils/vm.js'
import { mapActions } from 'vuex'
export default {
  props: {
    'markType': {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      markTypes: [],
      opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
      opacityNumber: 0.1,
      mark: this.markType,
      color: '#000000'
    }
  },
  mounted () {
    this.getTools()
  },
  methods: {
    ...mapActions(['searchProjectLabelToolAction']),
    handleChangeMarkType (value) {
      this.$emit('changemarkType', Number(value))
    },
    handleToggleLine () {
      vm.$emit('toggleLine')
    },
    handleDelete () {
      vm.$emit('delete')
    },
    handleCompletePolygon () {
      vm.$emit('completePolygon')
    },
    handleChangeColor () {
      vm.$emit('changeColor', this.color)
    },
    handleChangeOpacity () {
      vm.$emit('changeOpacity', this.opacityNumber)
    },
    getTools () {
      this.searchProjectLabelToolAction().then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          data.labelToolInfoList.push({labelToolId:4,labelToolName:"Move"})
          this.markTypes = data.labelToolInfoList
          this.handleChangeMarkType(data.labelToolInfoList[0].labelToolId)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.mark-aside {
  height: 100%;
  width: 80px;
  text-align: center;
}
.baseRadio {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.activeRadio {
  color: #fff;
  background: deepskyblue;
  box-shadow: 1px 1px 1px rgb(12, 146, 235);
}
</style>
