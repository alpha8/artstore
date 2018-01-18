<template>
  <div v-show="isOpen">
    <div class="msgBox">
      <div class="msgBox-title">温馨提示<span class="closeIcon" @click.stop.prevent="closeLayer"><i class="icon-close2"></i></span></div>
      <div class="msgBox-content">
        <p>全国线下巡展广州站【广州国际艺术博览会】4天，在 23 - 28号期间，线上商城将陆续分批发布大规模精品库，届时敬请饱览美物...</p>
      </div>
      <div class="msgBox-footer"><span class="btn" @click.stop.prevent="closeLayer">知道了!</span></div>
    </div>
    <div class="msgBox-mask"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
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
      },
      hide() {
        this.isOpen = false;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .msgBox
    position: absolute
    top: 50%
    left: 50%
    width: 300px
    max-height: 400px
    z-index: 10000
    background-color: #fff
    box-sizing: border-box
    box-shadow: 1px 1px 50px rgba(0,0,0,.3)
    border-radius: 10px
    transform: translate(-50%, -50%)
    overflow: hidden
    .msgBox-title
      position: relative
      width: 100%
      background: #009f95
      color: #fff
      border: none
      padding-left: 8px
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      background-clip: padding-box
      box-sizing: border-box
      height: 42px
      line-height: 42px
      font-size: 14px
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      background-clip: padding-box
      .closeIcon
        position:absolute
        display: inline-block
        top: 0
        right: 0
        width: 42px
        height: 42px
        line-height: 42px
        i
          position: absolute
          top: 50%
          right: 10px
          width: 20px
          height: 20px
          margin-top: -8px
          text-align: center
          font-size: 14px
    .msgBox-content
      line-height: 1.3
      padding: 8px 10px 8px 10px
      overflow: hidden
      box-sizing: border-box
      p
        text-indent: 20px
        font-size: 14px
        color: #000
        margin-bottom: 3px
        strong
          font-weight: 700
    .msgBox-footer
      height: 32px
      line-height: 32px
      text-align: center
      padding-bottom: 15px
      span
        padding: 8px 25px
        background: #1ab394
        text-align: center
        font-size: 14px
        color: #fff
        border-radius: 3px
  .msgBox-mask
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    z-index: 99
</style>
