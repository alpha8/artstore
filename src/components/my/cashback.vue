<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">奖金账户</div>
      <div class="right"></div>
    </div>
    <div class="cashback" ref="cashback">
      <div class="cashback-wrapper">
        <div class="cashback-heading">
          <p class="balance-name">奖金余额（元）</p>
          <p class="balance-num">{{balance | currency}}</p>
        </div>
        <div class="cashback-content">
          <div class="btns"><span class="btn-orange" @click.stop.prevent="detail">奖金明细</span></div>
          <p class="content-title">奖金余额是什么？</p>
          <p class="content-text">
            <p>好友通过您分享的商品链接，在平台上完成订单交易，系统将按照一定的额度返还给推荐人；</p>
            <p>您可前往「个人中心 — 奖金余额」中查看账户余额和交易明细，账户余额可在「实物商品」下单结算时最大化使用。</p>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';

  export default {
    activated() {
      this._initScroll();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      balance() {
        let profile = this.$store.getters.getUserProfile;
        return profile && profile.totalRebate || 0;
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.cashback, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      detail() {
        this.$router.push('/cashbackdetail');
      },
      back() {
        this.$router.back();
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader, split
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    display: flex
    padding: 0 8px
    top: 0
    width: 100%
    height: 44px
    line-height: 44px
    text-align: center
    color: #9B9B9B
    background: #f2f2f2
    box-sizing: border-box
    overflow: hidden
    z-index: 20
    .left
      width: 30px
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 10px
    .right
      width: 30px
      font-size: 14px
      i
        font-size: 18px
        color: #666
  .cashback
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .cashback-wrapper
      position: relative
      width: 100%
      background-color: #fff
      box-sizing: border-box
      overflow: hidden
      .cashback-heading
        padding: 20px 10px
        color: #fff
        background: #e45050
        .balance-name
          font-size: 14px
          color: hsla(0,0%,100%,.7)
          vertical-align: baseline
        .balance-num
          font-size: 40px
          line-height:1
          font-weight: lighter
          margin-top: 5px
      .cashback-content
        padding: 0 10px 13px
        color: #666
        background: #fff
        .content-title
          margin-bottom: 7px
          font-weight: 700
          font-size: 15px
          color: #333
        .content-text
          font-size: 12px
          line-height: 1.83em
        p
          font-size: 12px
          line-height: 1.4
          margin-bottom: 3px
        .btn-green
          letter-spacing: 3px
</style>

