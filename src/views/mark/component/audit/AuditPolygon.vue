<template>
  <g>
    <polygon
      v-for="item in polygons"
      :key="item.polygonMarkId"
      :points="formatPolygons(item.polygonInfoList)"
      :stroke="item.polygonMarkStatus===1?'red':item.polygonMarkStatus===2?'green':color"
      :fill="audit.activePolygonId===item.polygonMarkId?'skyblue':color"
      :fill-opacity="opacityNumber"
      style="stroke-width:1;stroke-opacity:1;cursor:pointer"
      @click="chosePolygonId(item.polygonMarkId, item.projectMaterialRetModelList)"
    />
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
    return {
      activePolygonId: ''
    }
  },
  methods: {
    ...mapMutations(['changeAuditActivePolygonId', 'updateAuditProjectPropertyId']),
    formatPolygons (ary) {
      let scale = this.audit.scale
      let points = ary.reduce((prev, next) => {
          return `${prev}${next.polygonX * scale},${next.polygonY * scale} `
        }, '')
      return points
    },
    chosePolygonId (id, list) {
      this.changeAuditActivePolygonId(id)
      this.updateAuditProjectPropertyId(list)
    }
  },
  computed: {
    ...mapState(['audit']),
    'polygons': function () {
      return this.audit.imgInfo.polygonMarkInfoRetModelList
    }
  }
}
</script>

<style>
</style>
