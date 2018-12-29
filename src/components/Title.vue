<template>
  <h4>{{title}}</h4>
</template>

<script>
export default {
  props: {
    'title': String
  }
}
</script>

<style scoped>
h4 {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  line-height: 50px;
  font-size: 24px;
  text-align: left;
  text-shadow: 2px 2px 2px #ccc;
}
</style>
