<template>
  <div class="back-home" v-show="!showHome" @click.stop.prevent="goHome" :class="{'up': moveUp}">
    <i class="icon-home"></i><span class="text">首页</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    computed: {
      showHome() {
        return this.$store.getters.getFooterState;
      },
      moveUp() {
        return this.$store.getters.isShowTop;
      }
    },
    methods: {
      goHome() {
        this.$router.replace('/home');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .back-home
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
    &.up
      bottom: 106px
    .icon-home
      display: block
      font-size: 14px
      margin-top: -1px
      margin-bottom: 3px
    .text
      display: block
      font-size: 10px
</style>

