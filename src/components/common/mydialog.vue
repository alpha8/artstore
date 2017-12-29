<template>
  <div v-show="isOpen">
    <div class="dialog">
      <div class="dialog-content">
        <i class="icon"></i>
        <p v-if="text">{{text}}</p>
      </div>
      <div class="dialog-footer">
        <span class="btn" @click.stop.prevent="closeDialog">取消</span>
        <span class="btn ok" v-if="btns.ok" @click.stop.prevent="doAction">{{btns.ok.text}}</span>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      btns: {
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
      closeDialog() {
        this.isOpen = false;
      },
      doAction() {
        this.isOpen = false;
        if (this.btns.ok && this.btns.ok.callback) {
          this.btns.ok.callback();
        }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .dialog
    position: absolute
    top: 50%
    left: 50%
    width: 270px
    max-height: 400px
    padding: 20px 15px 15px
    background-color: #fff
    color: #333
    z-index: 100
    border-radius: 6px
    transform: translate(-50%, -50%)
    box-shadow: 0 1px 10px rgba(0,0,0,.3)
    overflow: hidden
    box-sizing: border-box
    .dialog-title
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
    .dialog-content
      overflow: hidden
      text-align: center
      .icon
        display: block
        width: 50px
        height: 50px
        margin: 5px auto 10px
        background: url(../../common/images/warning.png) no-repeat
        background-size: 50px auto
      p
        font-size: 16px
    .dialog-footer
      margin: 20px -15px -15px
      text-align: center
      display: flex
      span
        flex: 1
        position: relative
        background: #fff
        color: #333
        text-align: center
        font-size: 14px
        height: 44px
        line-height: 44px
        &::before
          content: ""
          position: absolute
          z-index: 1
          pointer-events: none
          background-color: #e5e5e5
          height: 1px
          left: 0
          right: 0
          top: 0
        &::after
          content: ""
          position: absolute
          z-index: 1
          pointer-events: none
          background-color: #e5e5e5
          width: 1px
          top: 0
          bottom: 0
          left: 0
        &.ok
          color: #e93b3d
  .mask
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    z-index: 99
</style>
