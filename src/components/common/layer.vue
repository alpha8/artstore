<template>
  <div v-show="isOpen">
    <div class="layer">
      <div class="layer-title">温馨提示</div>
      <div class="layer-content">
        <p>公测版，仅供预览试用，欢迎您从【一虎一席茶席艺术平台】微信公众号的聊天窗口中反馈宝贵建议，建议一经采用将致谢您一份一虎一席精美礼品。</p>
        <p>正式版（界面外观美化、规模化商品库发布）将于 12月 10 号之前闪亮登场...</p>
      </div>
      <div class="layer-footer"><span class="btn" @click.stop.prevent="closeLayer">知道了!</span></div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['title', 'text'],
    data() {
      return {
        isOpen: true
      };
    },
    created() {
      let isOpen = window.sessionStorage.getItem('isOpen');
      if (isOpen === 'false') {
        this.isOpen = false;
      } else if (isOpen === 'true') {
        this.isOpen = true;
      }
    },
    methods: {
      closeLayer() {
        this.isOpen = false;
        window.sessionStorage.setItem('isOpen', false);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .layer
    position: absolute
    top: 50%
    left: 50%
    width: 300px
    height: 220px
    margin-top: -110px
    margin-left: -150px
    z-index: 100
    background-color: #fff
    box-sizing: border-box
    box-shadow: 1px 1px 50px rgba(0,0,0,.3)
    border-radius: 2px
    .layer-title
      background: #009f95
      color: #fff
      border: none
      padding: 0 8px
      height: 42px
      line-height: 42px
      font-size: 14px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .layer-content
      line-height: 1.3
      padding: 8px 10px
      overflow: hidden
      p
        text-indent: 20px
        font-size: 14px
        color: #000
        margin-bottom: 5px
    .layer-footer
      height: 32px
      line-height: 32px
      text-align: center
      span
        padding: 8px 25px
        background: #1ab394
        text-align: center
        font-size: 14px
        color: #fff
        border-radius: 3px
  .mask
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    z-index: 99
</style>
