<template>
  <div class="iframe">
  </div>
</template>

<script type="text/ecmascript-6">
  import {removeCookie} from '@/common/js/store';
  import {Device} from '@/common/js/util';
  import api from '@/api/api';
  let AUTO_LOGIN = 'auto_login';
  export default {
    data() {
      return {
        redirectUrl: '',
        isAutoLogin: false
      };
    },
    created() {
    },
    activated() {
    },
    deactivated() {
      this.isAutoLogin = false;
      window.sessionStorage.removeItem(AUTO_LOGIN);
    },
    mounted() {
      let isWeixin = Device().isWeixin;
      if (!isWeixin) {
        console.log('非微信平台，跳过授权认证！');
        return;
      }
      let userId = this.$store.getters.userId;
      if (!userId) {
        this.isAutoLogin = window.sessionStorage.getItem(AUTO_LOGIN) || false;
        if (!this.isAutoLogin) {
          let redirect = window.location.href;
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '').replace('&from=singlemessage&isappinstalled=0', '');
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem(AUTO_LOGIN, true);
          this.$store.dispatch('openToast', '正在登录中...');
          let anon = this.$store.getters.getAnonymous;
          let referee = this.$route.query.userId || 0;
          setTimeout(() => {
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=${escape(redirect)}&uid=${anon}&userId=${referee}`;
          }, 50);
        }
      } else {
        window.sessionStorage.removeItem(AUTO_LOGIN);
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
