<template>
  <div class="iframe">
  </div>
</template>

<script type="text/ecmascript-6">
  import {removeCookie} from '@/common/js/store';
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
      // let user = this.$store.getters.getUserInfo;
      // let hotfix = window.localStorage.getItem('autohotfix') || false;
      // if (!user.icon && hotfix) {
      //   removeCookie('wxuser', '', '.yihuyixi.com');
      //   window.localStorage.setItem('autohotfix', true);
      //   console.log('HotFix online issue.');
      // }
    },
    activated() {
      this.$store.dispatch('reloadUserInfo');
    },
    deactivated() {
      this.isAutoLogin = false;
      window.sessionStorage.removeItem(AUTO_LOGIN);
    },
    mounted() {
      let user = this.$store.getters.getUserInfo;
      if (!user.userId) {
        this.$store.dispatch('setAnonymous');
        this.isAutoLogin = window.sessionStorage.getItem(AUTO_LOGIN) || false;
        if (!this.isAutoLogin) {
          let redirect = window.location.href;
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem(AUTO_LOGIN, true);
          this.$store.dispatch('openToast', '正在登录中...');
          let anon = this.$store.getters.getAnonymous;
          setTimeout(() => {
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=${escape(redirect)}&uid=${anon}`;
          }, 50);
        }
      } else {
        window.sessionStorage.clear();
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
