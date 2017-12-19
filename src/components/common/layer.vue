<template>
  <div v-show="isOpen">
    <div class="layer">
      <div class="layer-title">{{title}}<span class="closeIcon" @click.stop.prevent="closeLayer"><i class="icon-close2"></i></span></div>
      <div class="layer-content" v-html="text"></div>
      <div class="layer-footer">
        <span class="btn" v-if="btn.callback" @click.stop.prevent="doAction">{{btn.text}}</span>
        <span class="btn" v-else @click.stop.prevent="closeLayer">{{btn.text}}</span></div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      btn: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      show() {
        this.isOpen = true;
      },
      closeLayer() {
        this.doAction();
      },
      doAction() {
        this.isOpen = false;
        if (this.btn && this.btn.callback) {
          this.btn.callback();
        }
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
    max-height: 400px
    z-index: 100
    background-color: #fff
    box-sizing: border-box
    box-shadow: 1px 1px 50px rgba(0,0,0,.3)
    border-radius: 10px
    transform: translate(-50%, -50%)
    overflow: hidden
    .layer-title
      position: relative
      width: 100%
      background: #009f95
      color: #fff
      border: none
      padding-left: 8px
      height: 42px
      line-height: 42px
      font-size: 14px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      box-sizing: border-box
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
    .layer-content
      line-height: 1.3
      padding: 8px 10px 14px 8px
      overflow: hidden
      font-size: 14px
      p
        text-indent: 20px
        font-size: 14px
        color: #000
        margin-bottom: 3px
        strong
          font-weight: 700
    .layer-footer
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
  .mask
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    z-index: 99
</style>
