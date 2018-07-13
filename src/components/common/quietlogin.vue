<template>
  <div class="quietlogin"></div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
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
      let user = this.$store.getters.getUserInfo;
      if (!user.userId) {
        this.isAutoLogin = window.sessionStorage.getItem(AUTO_LOGIN) || false;
        if (!this.isAutoLogin) {
          let redirect = window.location.href;
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem(AUTO_LOGIN, true);
          this.$store.dispatch('openToast', '正在登录中...');
          let referee = this.$route.query.userId || 0;
          setTimeout(() => {
            window.location.href = `${api.CONFIG.wxCtx}/wx/base?url=${escape(redirect)}&userId=${referee}`;
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
