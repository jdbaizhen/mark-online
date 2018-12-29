<template>
  <section>
    <CheckboxGroup
      v-show="projectType===1"
      v-model="create.labelToolInfoList"
      class="chose-group"
      @on-change="handleChange($event)"
    >
      <Checkbox
        v-for="(item, index) in utilsTypes" :key="index"
        class="chose-position"
        :label="item.labelToolId"   
      >
        <Card class="card-chose">
          <div>
            <Icon
              :type="item.labelToolId===3
                ?'md-disc':item.labelToolId===2
                ?'md-star-outline':item.labelToolId===1
                ?'md-square-outline':item.labelToolId===4
                ?'ios-apps-outline':item.labelToolId===5
                ?'ios-image-outline':''"
              size="48"
            />
            <h3>{{item.labelToolName}}</h3>
          </div>
        </Card>
      </Checkbox>
    </CheckboxGroup>
    <RadioGroup
      v-show="projectType===0"
      v-model="create.labelToolInfoList[0]"
      class="chose-group"
      @on-change="handleChange($event)"
    >
      <Radio class="chose-position" :label="item.labelToolId" v-for="(item, index) in utilsTypes" :key="index" >
        <Card  class="card-chose">
          <div>
            <Icon
              :type="item.labelToolId===3
                ?'md-disc':item.labelToolId===2
                ?'md-star-outline':item.labelToolId===1
                ?'md-square-outline':item.labelToolId===4
                ?'ios-apps-outline':item.labelToolId===5
                ?'ios-image-outline':''"
              size="48"
            />
            <h3>{{item.labelToolName}}</h3>
          </div>
        </Card>
      </Radio>
    </RadioGroup>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    utilsTypes: Array,
    projectType: Number
  },
  data() {
    return {
      // labelToolsCheckbox: [],
      //labelToolsRadio: ''
    };
  },
  methods: {
    ...mapMutations(["updateLabelTools"]),
    handleChange(newValue) {
      this.updateLabelTools(newValue);
    }
  },
  computed: {
    ...mapState(["create"])
  }
};
</script>

<style scoped lang="less">
section {
  width: 100%;
  .chose-group {
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    .chose-position {
      flex: 1;
      margin: 0 5px;
    }
  }
}
</style>
