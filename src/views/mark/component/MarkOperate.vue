<template>
  <section class="mark-aside">
    <RadioGroup vertical v-model.lazy="mark" @on-change="handleChangeMarkType">
      <Radio v-for="(item, index) in markTypes" :id="item.type" :key="index" :label="item.value">
          <Icon type="social-apple"></Icon>
          <span>{{item.label}}</span>
      </Radio>
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
export default {
  props: {
    'markType': {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      markTypes: [
        { 'label': '矩', 'type': 'rect', 'value': 1 },
        { 'label': '多', 'type': 'polygon', 'value': 2 },
        { 'label': '点', 'type': 'dot', 'value': 3 },
        { 'label': '移', 'type': 'move', 'value': 4 }
      ],
      opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
      opacityNumber: 0.1,
      mark: this.markType,
      color: '#000000'
    }
  },
  methods: {
    handleChangeMarkType (value) {
      console.log(value, typeof value)
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

</style>
