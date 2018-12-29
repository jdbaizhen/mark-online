<template>
  <i-form :label-width="50">
    <FormItem
      style="margin-bottom: 10px;"
      v-for="item in SelectList" 
      :key="item.projectMaterialId"
      :label="item.projectMaterialInstruction"
    > 
      <i-select
        v-model="propertyId"
        :placeholder="item.projectMaterialInstruction"
        :multiple="item.projectMaterialChoose==='checkbox'?true:false"
        @on-change="handleChange"
        :disabled="disabled"
      >
        <i-option 
          v-for="ite in item.projectPropertyInfoList"
          :key="ite.projectPropertyId"
          :value="ite.projectPropertyId"
          >{{ite.projectPropertyName}}</i-option>
      </i-select>
    </FormItem>  
  </i-form>
</template>

<script>
export default {
  props: {
    'SelectList': {
      type: Array
    },
    'projectPropertyId': {
      type: Array
    },
    'disabled': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    handleChange (value) {
      if (value instanceof Array) {
        this.$emit('listFormat', value)
      } else {
        let ary = new Array(1).fill(value)
        this.$emit('listFormat', ary)
      }
    }
  },
  computed: {
    'propertyId': {
      get: function () {
        return this.projectPropertyId
      },
      set: function () {}
    }
  }
}
</script>

<style>

</style>
