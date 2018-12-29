<template>
  <g>
    <rect v-for="item in rects"
      :key="item.squareId"
      :x="item.squareX*scale" :y="item.squareY*scale"
      :width="item.squareW*scale" :height="item.squareH*scale"
      :fill="item.squareId===audit.activeRectId?'skyblue':color"
      :stroke="item.squareStatus===1?'red':item.squareStatus===2?'green':color"
      @mousedown.stop="choseRect(item.squareId, item.projectMaterialRetModelList)"
      cursor="pointer"
      :fill-opacity="opacityNumber"
      style="stroke-width:1;stroke-opacity:1;"/>
  </g>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    color: String,
    opacityNumber: Number
  },
  data () {
    return {}
  },
  methods: {
    ...mapMutations(['changeAuditActiveRectId', 'updateAuditProjectPropertyId']),
    choseRect (id, list) {
      this.changeAuditActiveRectId(id)
      this.updateAuditProjectPropertyId(list)
    }
  },
  computed: {
    ...mapState(['audit']),
    'rects': function () {
      return this.audit.imgInfo.squareInfoRetModelList
    },
    'scale': function () {
      return this.audit.scale
    }
  }
}
</script>

<style>

</style>
