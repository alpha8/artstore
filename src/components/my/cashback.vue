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
          <p class="balance-name">奖金余额(元)</p>
          <p class="balance-num">{{balance | currency}}</p>
        </div>
        <ul class="itemList">
          <li class="item border-1px">
            <div class="text">可提现(元)</div>
            <div class="amount">{{PaidIn | currency}}</div>
          </li>
          <li class="item border-1px">
            <div class="text">待解冻(元)</div>
            <div class="amount">{{UnPaid | currency}}</div>
          </li>
        </ul>
        <div class="cashback-content">
          <div class="btns"><span class="btn-orange" @click.stop.prevent="detail">奖金明细</span></div>
          <div class="content-title">奖金余额是什么？</div>
          <div class="content-text">
            <p><strong>[一次分享，受益三年]</strong>朋友如果第一次进入商城，是通过您分享的商品链接（或商城里的文章链接）进入的，则之后的N个月乃至长达3年内，该朋友在商城里完成的所有商品交易，系统都将按照一定的额度赠送给您奖金。</p>
            <p>您可前往「个人中心 — 奖金余额」中查看奖金信息及奖金对应的来源交易明细。</p>
            <p>奖金余额可提取现金，亦可在您购买商城商品时，自动被最大化使用。</p>
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
        return profile && profile.wallet && profile.wallet.rewardValue || 0;
      },
      PaidIn() {
        let profile = this.$store.getters.getUserProfile;
        return profile && profile.wallet && profile.wallet.alreadyReward || 0;
      },
      UnPaid() {
        let profile = this.$store.getters.getUserProfile;
        return profile && profile.wallet && profile.wallet.notReward || 0;
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
      info() {
        this.$router.replace('/info');
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
      .itemList
        display: flex
        width: 100%
        padding: 15px 0 0
        .item
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-right: none
          .amount
            font-size: 19px
            color: rgb(255, 95, 62)
            line-height: 1 
            margin-bottom: 2px
          .text
            padding-bottom: 5px
            line-height: 1
            font-size: 14px
            color: #666
      .cashback-content
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
          p
            font-size: 13px
        .btn-green
          letter-spacing: 3px
</style>

