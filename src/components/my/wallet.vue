<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">账户余额</div>
      <div class="right"></div>
    </div>
    <div class="wallet" ref="wallet">
      <div class="wallet-wrapper">
        <div class="wallet-heading">
          <p class="balance-name">账户余额（元）</p>
          <p class="balance-num"><i class="symbol">¥</i>{{balance | currency('')}}</p>
        </div>
        <div class="btns"><span class="btn-green" @click.stop.prevent="deposit">充值</span></div>
        <div class="btns"><span class="btn-orange" @click.stop.prevent="detail">交易明细</span></div>
        <div class="wallet-content">
          <p class="content-title">账户余额是什么？</p>
          <p class="content-text">
            当您充值预存资金或购物出现退款失败等情况时会有账户余额，您可前往「个人中心 — 账户余额」中查看账户余额交易明细。购买商城商品时，账户余额自动被系统最大化使用。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';
  import split from '@/components/split/split';

  export default {
    activated() {
      this.refreshData();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      balance() {
        let profile = this.$store.getters.getUserProfile;
        return profile && profile.wallet && profile.wallet.accountValue || 0;
      }
    },
    methods: {
      refreshData() {
        let user = this.$store.getters.getUserInfo;
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('updateUserProfile', response);
          }
          this._initScroll();
        }).catch(response => {
          console.error(response);
        });
      },
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
        this.$router.push('/cashdetail');
      },
      deposit() {
        window.location.href = 'http://' + location.host + location.pathname + '#/pay/deposit';
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
      float: left
      margin-top: 2px
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
          .symbol
            font-size: 32px
            margin-right: 1px
      .wallet-content
        padding: 0 10px 13px
        color: #666
        background: #fff
        line-height: 1.83em
        .content-title
          font-weight: 700
          font-size: 15px
          color: #333
        .content-text
          font-size: 13px
          line-height: 1.83em
    .btns
      padding: 0 10px
      box-sizing: border-box
</style>

