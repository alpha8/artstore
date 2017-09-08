<template>
  <div class="back-top" v-show="showTop" @click.stop.prevent="goTop">
    <img class="back-img" src="../../common/images/gotop.png">
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
    bottom: 55px
    z-index: 9
    img
      background: transparent
      height: 44px
      width: 44px
      border: 0
</style>

