<template lang="pug">
  .app
    //- show-img(url="./static/imgs/1.png")
    //- show-img(url="./static/imgs/2.png")
    //- show-img(url="./static/imgs/3.png")
    control(v-model="currentPage", @getMarkdown="getMarkdown", :data="children")
    transition(enter-active-class="animated fadeInLeft", leave-active-class="animated fadeOutUp")
      home(:content="home.con", v-show="currentPage === home.page")
    second(v-for="second in children", :key="second.page", :content="second.con" v-show="currentPage === second.page")
    .child(v-for="second in children", :key="second.page")
      third(v-for="third in second.children", :key="third.page", :content="third.con", v-show="currentPage === third.page")
</template>

<script>
import axios from 'axios'
import Home from '@/components/page/Home'
import Second from '@/components/page/Second'
import Third from '@/components/page/Third'
import Control from '@/components/Control'
import ShowImg from '@/components/ShowImg'
export default {
  name: 'app',
  components: { Home, Second, Third, Control, ShowImg },
  data () {
    return {
      home: {
        con: '',
        page: 'home'
      },
      children: [],
      currentPage: 'home'
    }
  },
  created () {
    this.getMarkdown()
  },
  methods: {
    getMarkdown () {
      axios.get('/markdown').then(res => {
        this.home = {
          con: res.data.con,
          page: res.data.page
        }
        this.children = res.data.children
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../static/font-awesome/css/font-awesome.min.css';
@import '../static/animate.css';
@import './assets/styl/common/init';
@import './assets/styl/common/code';
@import './assets/styl/page/home';
@import './assets/styl/page/second';
@import './assets/styl/page/third';
</style>
