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
        isAutoLogin: false
      };
    },
    activated() {
    },
    mounted() {
      let isWeixin = Device().isWeixin;
      if (!isWeixin) {
        console.log('非微信平台，跳过授权认证！');
        return;
      }
      let redirect = window.location.href.replace('?from=singlemessage&isappinstalled=0', '').replace('&from=singlemessage&isappinstalled=0', '');

      let openid = this.$store.getters.getOpenId || this.$store.getters.userInfo.openId;
      if (!openid) {
        this.isAutoLogin = window.sessionStorage.getItem(AUTO_LOGIN) || false;
        if (!this.isAutoLogin) {
          let refererUid = '';
          let startPos = redirect.indexOf('uid=');
          let endPos = redirect.indexOf('&', startPos) != -1;
          if (startPos != -1 && endPos != -1) {
            refererUid = redirect.substring(startPos + 7, endPos);
          } else if (startPos != -1) {
            refererUid = redirect.substring(startPos + 7);
          }
          if (refererUid) {
            this.$store.dispatch('setRefererUid', refererUid);
          }
          this.isAutoLogin = true;
          window.sessionStorage.setItem(AUTO_LOGIN, true);
          setTimeout(() => {
            window.location.href = `${api.CONFIG.ctx}/weixin/base?url=${encodeURI(redirect)}`;
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
