<template lang="pug">
.control(:style="{'font-size':controlSize + 'px'}")
  .show-control(v-if="!show", @click.stop="showControl", title="显示控制器")
    i.fa.fa-eye
  .controls(v-else)
    .start(v-if="isHome", @click="start")
      i.fa.fa-play
    .control-group(v-else)
      .control-button.top(@click="top(page)", :class="{disabled:hideTop}")
      .control-button.left(@click="left(page)", :class="{disabled:hideLeft}")
      .control-button.right(@click="right(page)", :class="{disabled:hideRight}")
      .control-button.bottom(@click="bottom(page)", :class="{disabled:hideBottom}")
      input.quick-change-page(v-model="page", placeholder="page")
    .refresh(@click="getMarkdown")
      i.fa.fa-refresh
    .hide-buttons(@click.stop="hideControl")
      i.fa.fa-eye-slash
    .go-home(@click="goHome")
      i.fa.fa-home
    input.font-size(v-model="size", type="range", min="12", max="50")
    input.control-size(v-model="inputSize")
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'home'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      page: 'home',
      size: 16,
      controlSize: 20,
      inputSize: 20,
      show: false
    }
  },
  created () {
    this.changeSize(this.size)
    window.onkeydown = (e) => {
      this.keydown(e)
    }
  },
  watch: {
    'size' (val) { this.changeSize(val) },
    'page' (val) { this.$emit('input', val) },
    'inputSize' (val) {
      if (val >= 12 && val <= 50) {
        this.controlSize = val
      }
    }
  },
  computed: {
    hideTop () { return RegExp(/^\d$/).test(this.value) },
    hideLeft () { return this.value[0] === '1' },
    hideRight () {
      let [secondNum] = this.pageToNum(this.value)
      let secondLen = this.data.length
      return secondNum >= secondLen
    },
    hideBottom () {
      let [secondNum, thirdNum] = this.pageToNum(this.value)
      let secondList = this.data[secondNum - 1] ? this.data[secondNum - 1].children : []
      let thirdLen = 0
      if (secondList) {
        thirdLen = secondList.length
      }
      return thirdNum >= thirdLen
    },
    isHome () { return this.page === 'home' }
  },
  methods: {
    changeSize (num) {
      if (num >= 12 && num <= 50) {
        document.documentElement.style.fontSize = num + 'px'
      }
    },
    changePage (page) { this.$emit('changePage', page) },
    getMarkdown () { this.$emit('getMarkdown') },
    top (page) {
      let [second, third] = this.pageToNum(page)
      third === 1
        ? this.page = `${second}`
        : this.page = `${second}-${third - 1}`
    },
    bottom (page) {
      let [second, third] = this.pageToNum(page)
      this.page = `${second}-${third + 1}`
    },
    left (page) {
      let [second] = this.pageToNum(page)
      this.page = `${second - 1}`
    },
    right (page) {
      let [second] = this.pageToNum(page)
      this.page = `${second + 1}`
    },
    pageToNum (page) {
      let [second, third] = page.split('-')
      second = parseInt(second)
      third = third ? parseInt(third) : 0
      return [second, third]
    },
    goHome () { this.page = 'home' },
    start () { this.page = '1' },
    hideControl () { this.show = false },
    showControl () { this.show = true },
    keydown (e) {
      let code = e.keyCode
      let page = this.page
      if (page === 'home') {
        code === 40 && this.start()
        return
      }
      switch (code) {
        case 13:
          e.ctrlKey && this.getMarkdown()
          break
        case 33:
          this.size++
          break
        case 34:
          this.size--
          break
        case 36:
          this.goHome()
          break
        case 37:
          this.hideLeft ? '' : this.left(page)
          break
        case 38:
          this.hideTop ? '' : this.top(page)
          break
        case 39:
          this.hideRight ? '' : this.right(page)
          break
        case 40:
          this.hideBottom ? '' : this.bottom(page)
          break
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '../assets/styl/common/control'
</style>