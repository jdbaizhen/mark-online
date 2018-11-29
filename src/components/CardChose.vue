<template>
  <section>
    <CheckboxGroup v-model="labelTools" class="card-chose">
    <Card v-for="(item, index) in utilsTypes" :key="index">
      <div>
        <Icon :type="item.labelToolId===1
              ?'md-disc':item.labelToolId===2
              ?'md-star-outline':item.labelToolId===3
              ?'ios-square-outline':item.labelToolId===4
              ?'ios-apps-outline':item.labelToolId===6
              ?'ios-image-outline':''"
        size="48"/>
        <h3>{{item.labelToolName}}</h3>
        <Checkbox v-show="projectType===1" class="chose-position" :label="item.labelToolId" value=""/>
        <!-- <Radio v-show="projectType===0" class="chose-position" name="labelToolRadio" :value="item.labelToolId"/> -->
      </div>
    </Card>
    </CheckboxGroup>
  </section>
</template>

<script>
export default {
  props: {
    utilsTypes: Array,
    projectType: Number
  },
  data () {
    return {
      labelTools: []
    }
  },
  methods: {
    handleChange (event) {
      console.log(event)
    }
  }
}
</script>

<style scoped lang="less">
section {
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  .card-chose {
    position: relative;
    margin: 0 5px;
    flex: 1;
    .chose-position {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
