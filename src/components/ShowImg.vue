<template lang="pug">
.show-img
  img(v-if="url", :src="url", width="500")
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '../assets/styl/common/img'
</style>