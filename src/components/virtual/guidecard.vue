<template>
  <iframe align="center" src="https://wx.17u.cn/findseat/guideCards?adType=common#/" frameborder="none" class="adjustFrame" />
</template>

<script type="text/ecmascript-6">
  export default {
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
.adjustFrame
  width: 100vw
  height: 100vh
  overflow: hidden
</style>
