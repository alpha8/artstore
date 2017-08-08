<template>
  <div class="back-home" v-show="!showTop" @click.stop.prevent="goHome">
    <i class="icon-home"></i><span class="text">回首页</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    computed: {
      showTop() {
        return this.$store.getters.getFooterState;
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
    right: 0
    bottom: 50%
    margin-top: -22px
    font-size: 12px
    padding: 8px
    background: rgba(7, 17, 27, 0.85)
    color: #fff
    text-align: center
    border-radius: 4px 0 0 4px
    box-sizing: border-box
    opacity: 0.75
    z-index: 9
    .icon-home
      display: block
      font-size: 16px
      margin-bottom: 3px
    .text
      display: block
</style>

