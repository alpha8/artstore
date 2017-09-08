<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">优惠券账户</div>
      <div class="right" @click.stop.prevent="detail">优惠券明细</div>
    </div>
    <div class="wallet" ref="wallet">
      <div class="wallet-wrapper">
        <div class="wallet-heading">
          <p class="balance-name">优惠券余额（元）</p>
          <p class="balance-num">{{balance | currency}}</p>
        </div>
        <split></split>
        <div class="wallet-content">
          <div class="content-title">优惠券充值</div>
          <div class="form-control">
            <input type="number" name="amount" placeholder="请输入优惠券码" class="input-amount" v-model="amount">
          </div>
          <div class="btns"><span class="btn-red" :class="{'btn-gray': amount.length === 0}" @click.stop.prevent="pay">充值</span></div>
          <div class="content-text">
            <strong>充值说明：</strong>
            <p>优惠券是由「一虎一席艺术平台公众号」派发给用户的，充值成功后系统将自动用于抵扣订单交易金额。</p>
            <p>您可前往「一虎一席艺术平台公众号—个人中心—优惠券余额」中查看优惠券明细，明细中包含了您名下所有的优惠券信息。状态为「未使用」的优惠券可用于充值。</p>
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
            if (response.result === 0) {
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
      flex: 30px 0 0
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 10px
    .right
      flex: 0 0 80px
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
        padding: 20px 10px
        color: #fff
        background: #e4a450
        .balance-name
          font-size: 14px
          color: hsla(0,0%,100%,.7)
          vertical-align: baseline
        .balance-num
          font-size: 40px
          line-height:1
          font-weight: lighter
          margin-top: 5px
      .wallet-content
        padding: 13px 10px
        color: #666
        background: #fff
        .content-title
          margin-bottom: 7px
          font-weight: 700
          font-size: 15px
          color: #333
          text-align: center
        .content-text
          font-size: 12px
          line-height: 1.83em
          strong
            font-weight: 700
          p
            text-indent: 20px
        .form-control
          display: flex
          position: relative
          .input-amount
            flex: 1
            padding: 8px 0
            border-bottom: 1px solid #ccc
            &::-webkit-input-placeholder
              text-align: center
            &::-moz-input-placeholder
              text-align: center  
            &::-ms-input-placeholder
              text-align: center  
        .btns span
          letter-spacing: 2px
</style>
