<template>
  <div class="quietlogin"></div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  import {Device} from '@/common/js/util';
  let AUTO_LOGIN = 'quiet_login';
  export default {
    data() {
      return {
        redirectUrl: '',
        isAutoLogin: false
      };
    },
    activated() {
      this.$store.dispatch('reloadUserInfo');
    },
    mounted() {
      let isWeixin = Device().isWeixin;
      if (!isWeixin) {
        console.log('非微信平台，跳过授权认证！');
        return;
      }
      let user = this.$store.getters.getUserInfo;
      if (!user.userId) {
        this.$store.dispatch('setAnonymous');
        this.isAutoLogin = window.sessionStorage.getItem(AUTO_LOGIN) || false;
        if (!this.isAutoLogin) {
          let redirect = window.location.href;
          let userId = '';
          let startPos = redirect.indexOf('userId=');
          let endPos = redirect.indexOf('&', startPos);
          if (startPos !== -1 && endPos !== -1) {
            userId = redirect.substring(startPos + 7, endPos);
          }
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '').replace('&from=singlemessage&isappinstalled=0', '');
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem(AUTO_LOGIN, true);
          let referee = this.$route.query.userId || 0;
          if (!referee && userId) {
            referee = userId;
          }
          let anon = this.$store.getters.getAnonymous;
          setTimeout(() => {
            window.location.href = `${api.CONFIG.wxCtx}/wx/base?url=${escape(redirect)}&uid=${anon}&userId=${referee}`;
          }, 50);
        }
      } else {
        window.sessionStorage.removeItem(AUTO_LOGIN);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .quietlogin
    position: absolute
    width: 0
    height: 0
    bottom: 0
    right: 0
    overflow: hidden
</style>
