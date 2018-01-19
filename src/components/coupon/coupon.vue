<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">优惠券账户</div>
      <div class="right"></div>
    </div>
    <div class="wallet" ref="wallet">
      <div class="wallet-wrapper">
        <div class="wallet-heading">
          <p class="balance-name">优惠券余额（元）</p>
          <p class="balance-num">{{balance | currency}}</p>
        </div>
        <div class="btns"><span class="btn-orange" @click.stop.prevent="detail">优惠券明细</span></div>
        <split></split>
        <div class="wallet-content">
          <div class="content-title">优惠券充值</div>
          <div class="form-control">
            <span class="title">优惠券码：</span>
            <input type="number" name="amount" placeholder="优惠券码" class="input-amount" v-model="amount">
          </div>
          <div class="btns"><span class="btn-red" :class="{'btn-gray': amount.length === 0}" @click.stop.prevent="pay">充值</span></div>
          <div class="content-text">
            <strong>充值说明：</strong>
            <p>优惠券是由「一虎一席茶席艺术平台」派发给用户的，充值成功后系统将自动用于抵扣订单交易金额。</p>
            <p>您可前往「个人中心 — 优惠券余额」中查看优惠券明细，明细中包含了您名下所有的优惠券信息。状态为「未使用」的优惠券可用于充值。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import api from '@/api/api';

  export default {
    data() {
      return {
        amount: ''
      };
    },
    activated() {
      this._initScroll();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      balance() {
        return this.$store.getters.getCouponAmount;
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.wallet, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      detail() {
        this.$router.push('/coupon/history');
      },
      pay() {
        if (this.amount.length) {
          let user = this.$store.getters.getUserInfo;
          api.depositCoupon({
            userId: user.userId || 0,
            cNo: this.amount
          }).then(response => {
            if (response.result === 0 && response.code === 0) {
              this.$store.dispatch('openToast', '充值成功！');
              this.$store.dispatch('updateCouponAmount', response.couponTotal);
              this.amount = '';
            } else {
              this.$store.dispatch('openToast', '请确认优惠券码未被使用或输入错误！');
            }
          }).catch(response => {
            console.log(response);
            this.$store.dispatch('openToast', '网络故障，请稍候再充值！');
          });
        }
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
  .wallet
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .wallet-wrapper
      position: relative
      width: 100%
      background-color: #fff
      box-sizing: border-box
      overflow: hidden
      .tips
        font-size: 12px
        padding: 5px 10px
        color: #666
      .wallet-heading
        padding: 20px 13px
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
      >.btns
        padding: 0 10px
        box-sizing: border-box
        .btn-green
          letter-spacing: 3px
      .wallet-content
        padding: 13px 10px
        color: #666
        background: #fff
        .content-title
          padding-bottom: 8px
          font-weight: 700
          font-size: 15px
          color: #333
          text-align: center
        .content-text
          font-size: 12px
          line-height: 1.83em
          strong
            font-weight: 700
        .form-control
          display: flex
          position: relative
          padding-left: 80px
          margin-top: 7px
          .title
            position: absolute
            width: 70px
            top: 50%
            left: 4px
            font-size: 14px
            line-height: 1
            transform: translate(0, -50%)
          .input-amount
            padding: 5px 0
            height: 20px
            border: 0 none
            font-size: 14px
            width: 100%
            vertical-align: top
            border-bottom: 1px solid #ccc
            margin-right: 5px
            box-sizing: border-box
        .btns span
          letter-spacing: 2px
          &.btn-red
            background-color: #e45050
            color: #e1e1e1
</style>
