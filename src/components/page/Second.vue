<template lang='pug'>
.second.page
  my-content(:content="content")
</template>

<script>
import MyContent from '@/components/MyContent'
export default {
  components: {
    MyContent
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>