<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix" @click="hideDetail">
        <div class="detail-main">
          <modal-title :title="title"></modal-title>
          <div class="bulletin">
            <ul class="content">
              <li>第1步，未关注公众号用户，“长按”页面底部公众号二维码，“识别图中二维码”即完成公众号关注; 已关注用户可跳过这一步</li>
              <li>第2步，点击页面底部的“分享特惠”，根据指引点击右上角并“发送给朋友”或“分享到朋友圈”</li>
              <li>第3步，好友打开商品链接并授权登录商城，即可为您减免部分商品金额</li>
            </ul>
          </div>
          <modal-title title="注意事项"></modal-title>
          <div class="bulletin">
            <ul class="content">
              <li>· 当商品到达底价或者24小时分享时间结束，您可进入商品详情页完成订单付款</li>
              <li>· 同一设备、微信号、手机号码视为同一用户, 每个用户有三次助力资格</li>
              <li>· 关注公众号用户将收到实时减价通知、分享时间结束通知等</li>
              <li>· 若发现用户存在刷单、虚假用户助力等违规行为，平台有权判定助力失败</li>
              <li>· 对物流、商品有疑问或者需要修改收货地址请联系商家客服处理</li>
              <li>· 优惠助力资格只针对分享特惠模块，助力时间为24小时。若达到商品低价或者时间结束，系统将不再接受用户减价操作</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import modalTitle from '@/components/modal-title/modal-title';
  export default {
    props: {
      title: {
        type: String,
        default: '活动规则'
      }
    },
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      showDetail() {
        this.isOpen = true;
      },
      hideDetail() {
        this.isOpen = false;
      }
    },
    components: {
      modalTitle
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
    overflow: auto
    background: rgba(7, 17, 27, 0.8)
    backdrop-filter: blur(10px)
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      width: 100%
      height: 100%
      box-sizing: border-box
      overflow: auto
      -webkit-overflow-scrolling: touch
      .detail-main
        margin-top: 64px
        padding-bottom: 64px
        .title
          color: #fff
        .bulletin
          width: 100%
          margin: 0 auto
          color: #fff
          padding: 0 15px
          box-sizing: border-box
          .content
            padding: 0 12px
            line-height: 24px
            font-size: 14px
            li
              margin-bottom: 5px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      border-radius: 100%
      background: #ddd
      border: 2px solid #ddd
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
      color: #666
</style>
