<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix" @click="hideDetail">
        <div class="detail-main">
          <modal-title :title="title"></modal-title>
          <div class="bulletin">
            <ul class="content">
              <li class="pline"><span class="line-left">第1步：</span><div class="line-right">未关注公众号的用户，“长按”页面底部公众号二维码，“识别图中二维码”即完成公众号关注; 已关注用户可跳过这一步。</div></li>
              <li class="pline"><span class="line-left">第2步：</span><div class="line-right">点击页面底部的“我要开团”，然后完成订单结算。</div></li>
              <li class="pline"><span class="line-left">第3步：</span><div class="line-right">结算完成生成拼团分享页，点击右上角按钮选择“发送给朋友”或“分享到朋友圈”。</div></li>
              <li class="pline"><span class="line-left">第4步：</span><div class="line-right">好友打开商品链接，点击“我要参团”并付款即加入此拼团，参团的付款人数满员后系统将立即发货。</div></li>
              <li class="pline"><span class="line-left">第5步：</span><div class="line-right">如果拼团商品时间结束，参团的付款人数仍未满员，系统将自动退款。</div></li>
            </ul>
          </div>
          <modal-title title="注意事项"></modal-title>
          <div class="bulletin">
            <ul class="content">
              <li class="pline"><span class="line-left">·</span><div class="line-right">同一设备、微信号、手机号码视为同一用户。</div></li>
              <li class="pline"><span class="line-left">·</span><div class="line-right">关注公众号的用户将收到最新的优惠通知、拼团通知等。</div></li>
              <li class="pline"><span class="line-left">·</span><div class="line-right">若发现用户存在刷单、虚假用户拼团等违规行为，平台有权判定拼团失败。</div></li>
              <li class="pline"><span class="line-left">·</span><div class="line-right">对物流、商品有疑问或者修改收货地址请联系客服。</div></li>
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
    background: rgba(7, 17, 27, 1)
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
        margin-top: 12px
        padding-bottom: 64px
        .title
          color: #fff
          background-color: transparent
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
            .pline
              position: relative
              display: flex
              margin-bottom: 5px
              &:last-child
                padding-bottom: 0
              .line-left
                text-align: right
                padding-right: 3px
              .line-right
                flex: 1
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
