<template>
  <div class="iframe">
    <iframe :src="getUrl" class="noframe" frameborder="0" id="myframe" scrolling="no"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        redirectUrl: ''
      };
    },
    created() {
      if (!this.$store.getters.checkLogined) {
        let timer = setInterval(() => {
          if (this.$store.getters.checkLogined) {
            clearInterval(timer);
          }
        }, 500);
      }
    },
    deactivated() {
      this.redirectUrl = '';
    },
    computed: {
      getUrl() {
        if (!this.redirectUrl) {
          return 'about:blank';
        }
        if (this.$store.getters.checkLogined) {
          return 'about:blank';
        }
        let redirect = location.href;
        // fixed wexin sharing url
        if (redirect) {
          redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
        }
        this.redirectUrl = redirect;
        return 'http://www.yihuyixi.com/wxservice/baseInfo?url=' + escape(redirect);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .iframe
    position: absolute
    width: 0
    height: 0
    bottom: 0
    right: 0
    overflow: hidden
    .noframe
      width: 0
      height: 0
      border: 0
</style>
