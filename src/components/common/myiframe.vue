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
        /* let ios = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        if (!ios && this.retryTimes > 0) {
          let redirect = location.href;
          // fixed wexin sharing url
          if (redirect) {
            redirect = redirect.replace('?from=singlemessage&isappinstalled=0', '');
          }
          this.retryTimes--;
          this.$store.dispatch('openToast', '正在登录中...');
          window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
        } */
      }
    },
    /* mounted() {
      setTimeout(() => {
        try {
          let ad = document.getElementById('_embed_v3_dc');
          if (ad) {
            ad.style.display = 'none';
          }
        } catch (e) {
          console.log(e);
        }
      }, 1000);
    }, */
    deactivated() {
      this.redirectUrl = '';
    },
    computed: {
      getUrl() {
        if (this.redirectUrl) {
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
        return `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
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
