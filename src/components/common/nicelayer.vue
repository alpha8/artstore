<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix" @click="hide">
        <div class="detail-main">
          <div class="main-content">
            <img class="icon" src="../../common/images/limitbuy2.png" alt="">
            <div class="text" v-html="text"></div>
            <div class="footer">
              <div class="btn-group"><span>我知道了</span></div>
            </div>
          </div>
          <div class="btn-close"><i class="icon-close"></i></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default() {
          return '';
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
      hide() {
        this.isOpen = false;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: rgba(7, 17, 27, 0.6)
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      position: relative
      width: 100%
      height: 100%
      box-sizing: border-box
      overflow: auto
      -webkit-overflow-scrolling: touch
      .detail-main
        position: absolute
        top: 50%
        left: 0
        width: 100%
        height: auto
        box-sizing: border-box
        transform: translate(0, -50%)
        .main-content
          position: relative
          height: 100%
          margin: 0 50px
          background: #fff
          border-radius: 15px
          box-sizing: border-box
          .icon
            position: absolute
            top: -30.5px
            left: 50%
            width: 101px
            height: 55px
            margin-left: -50.5px
          .text
            padding: 32px 20px 11px
            font-size: 14px
            line-height: 1.4
            box-sizing: border-box
          .footer
            padding: 2px 15px 18px
            text-align: center
            box-sizing: border-box
            .btn-group
              display: flex
              margin: 0
              height: 35px
              line-height: 35px
              padding: 0 50px
              font-size: 14px
              text-align: center
              border-radius: 2px
              text-align: center
              span
                flex: 1
                border-radius: 5px
                background: rgba(250,180,90,0.93)
                color: #f1f1f1
                box-sizing: border-box
        .btn-close
          position: absolute
          width: 24px
          height: 24px
          border-radius: 100%
          background: #fff
          border: 1px solid #e1e1e1
          right: 38px
          top: -10px
          clear: both
          font-size: 24px
          padding: 2px
          color: #e4393c
          box-shadow: 0px 1px 20px 0px #dfdbdb
</style>
