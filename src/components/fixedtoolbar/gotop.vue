<template>
  <div class="back-top" v-show="showTop" @click.stop.prevent="goTop">
    <i class="icon-top"></i><span class="text">顶部</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      scrollY: {
        type: Number
      }
    },
    data() {
      return {
        winHeight: document.documentElement.clientHeight
      };
    },
    computed: {
      showTop() {
        if (this.scrollY > this.winHeight) {
          this.$store.commit('SHOW_TOP');
          return true;
        }
        this.$store.commit('HIDE_TOP');
        return false;
      }
    },
    deactivated() {
      this.$store.commit('HIDE_TOP');
    },
    methods: {
      goTop() {
        this.$emit('top');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .back-top
    position: fixed
    right: 4px
    bottom: 57px
    font-size: 12px
    padding: 8px
    background: #fff
    color: #666
    text-align: center
    width: 44px
    height: 44px
    border-radius: 50%
    border: 1px solid #e1e1e1
    transition: bottom 0.3s linear
    box-shadow: 0px 1px 20px 0px #dfdbdb
    box-sizing: border-box
    z-index: 9
    .icon-top
      display: block
      font-size: 15px
      margin-top: -1px
      margin-bottom: 3px
    .text
      display: block
      font-size: 10px    
</style>

