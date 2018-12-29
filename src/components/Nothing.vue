<template>
  <section>
      {{title}}
  </section>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 80px;
  letter-spacing: 8px;
}
</style>
