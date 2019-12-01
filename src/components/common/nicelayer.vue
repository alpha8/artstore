<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <div class="main-content">
            <div class="qrcode_wrap">
              <img class="icon" v-if="icon" :src="icon" alt="" @click.stop.prevent="previewImage(icon)">
            </div>
            <div class="text">
              <p class="strong">关注公众号</p>
              <p>将收到实时的积分变动，订单和发货等通知</p>
              <p style="margin-top: 25px;color: #999;">长按二维码识别并关注公众号</p>
            </div>
          </div>
          <div class="btn-close" @click.stop.prevent="hide"><i class="icon-close"></i></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Device} from '@/common/js/util';
  export default {
    props: {
      text: {
        type: String,
        default() {
          return '';
        }
      },
      icon: {
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
        /* let uid = this.$store.getters.userId;
        if (!uid || (uid && this.$store.getters.userInfo.follow != 0)) {
          return;
        }
        let dialog = window.sessionStorage.getItem('qrcode_dialog');
        if (!dialog) {
          this.isOpen = true;
        } */
      },
      hide() {
        this.isOpen = false;
        window.sessionStorage.setItem('qrcode_dialog', 'close');
      },
      previewImage(pic) {
        let device = Device();
        if (device.isWeixin && device.isAndroid) {
          wx.previewImage({
            current: pic,
            urls: [pic]
          });
        }
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
        position: fixed
        top: 50%
        left: 0
        width: 100%
        height: auto
        box-sizing: border-box
        transform: translate(0, -50%)
        .main-content
          position: relative
          display: flex;
          height: 100%
          margin: 0 20px;
          background: #fff
          border-radius: 15px
          box-sizing: border-box
          overflow: hidden
          .qrcode_wrap
            padding: 5px;
            border: 1px solid #dfdfdf;
            float: left;
            .icon
              width: 150px;
              height: 150px;
              border: 0;
              vertical-align: middle;
          .text
            flex: 1;
            padding: 15px 10px 0
            font-size: 14px
            box-sizing: border-box
            .strong
              font-weight: 700
              font-size: 16px
              padding-bottom: 5px
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
          width: 28px
          height: 28px
          border-radius: 100%
          background: #fff
          border: 1px solid #e1e1e1
          right: 10px
          top: -10px
          clear: both
          font-size: 24px
          padding: 2px
          text-align: center
          color: #e4393c
          box-shadow: 0px 1px 20px 0px #dfdbdb
</style>
