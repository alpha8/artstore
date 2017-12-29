<template>
  <div class="iframe">
    <iframe :src="getUrl" class="noframe" frameborder="0" id="myframe" scrolling="no"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  export default {
    data() {
      return {
        redirectUrl: '',
        isAutoLogin: window.sessionStorage.getItem('autologin') || false
      };
    },
    created() {
      if (!this.$store.getters.checkLogined) {
        let ios = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        if (!ios && !this.isAutoLogin) {
          let redirect = location.href;
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem('autologin', true);
          this.$store.dispatch('openToast', '正在登录中...');
          window.location.href = `${api.CONFIG.wxCtx}/wx/base?url=` + escape(redirect);
        }
      }
    },
    computed: {
      getUrl() {
        if (this.redirectUrl) {
          return 'about:blank';
        }
        if (this.isAutoLogin) {
          return 'about:blank';
        }
        if (this.$store.getters.checkLogined) {
          return 'about:blank';
        }
        this.isAutoLogin = true;
        window.sessionStorage.setItem('autologin', true);
        let redirect = location.href;
        // fixed wexin sharing url
        if (redirect) {
          redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
        }
        this.redirectUrl = redirect;
        return `${api.CONFIG.wxCtx}/wx/base?url=` + escape(redirect);
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
