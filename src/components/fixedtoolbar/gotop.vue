<template>
  <div class="back-top" v-show="showTop" @click.stop.prevent="goTop">
    <img class="back-img" src="/static/images/gotop.png">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showTop: false
      };
    },
    methods: {
      show() {
        this.showTop = true;
      },
      hide() {
        this.showTop = false;
      },
      goTop() {
        this.$emit('top');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .back-top
    position: fixed
    right: 10px
    bottom: 52px
    z-index: 10
    img
      background: transparent
      height: 44px
      width: 44px
      border: 0
</style>

