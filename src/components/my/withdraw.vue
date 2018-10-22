<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">奖金提现</div>
      <div class="right" @click.stop.prevent="detail">提现记录</div>
    </div>
    <div class="wallet" ref="wallet">
      <div class="wallet-wrapper">
        <div class="wallet-content">
          <div class="form-control">
            <span class="title">提现金额(元)：</span>
            <input type="number" name="amount" placeholder="提现金额" class="input-amount" v-model="amount">
          </div>
          <div class="leftMomey">可提现余额：{{PaidIn | currency}}，<span class="allin" @click.stop.prevent="allin">全部提现</span></div>
          <div class="btn-list">
            <span class="btn-green" @click.stop.prevent="fillAmount(btn.value)" :class="{'on': btn.value === amount}"  v-for="btn in buttons">{{btn.text}}</span>
          </div>
          <div class="btns">
            <span class="btn-green" :class="{'btn-gray': amount.length === 0}" @click.stop.prevent="withdrawCash">提现</span>
          </div>
          <!-- <div class="btns">
            <span class="btn-orange" @click.stop.prevent="detail">提现记录</span>
          </div> -->
        </div>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="layerWin"></layer>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import layer from '@/components/common/layer';

  export default {
    data() {
      return {
        amount: '',
        buttons: [{
          text: '5元', value: 5
        }, {
          text: '20元', value: 20
        }, {
          text: '50元', value: 50
        }, {
          text: '100元', value: 100
        }, {
          text: '200元', value: 200
        }],
        paying: false,
        layer: {
          title: '系统提示',
          text: '',
          button: {
            text: '知道了!'
          }
        }
      };
    },
    computed: {
      PaidIn() {
        let profile = this.$store.getters.getUserProfile;
        return profile && profile.wallet && profile.wallet.alreadyReward || 0;
      }
    },
    activated() {
      this.refreshData();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
      refreshData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return;
        }
        api.getProfile({
          userId: user.userId
        }).then(response => {
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
      withdrawCash() {
        if (this.paying) {
          this.$store.dispatch('openToast', '正在提现中...');
          return;
        }
        if (this.amount <= 0) {
          this.$store.dispatch('openToast', '提现金额不正确!');
          return;
        }
        let user = this.$store.getters.getUserInfo;
        this.paying = true;
        api.withdraw({
          payValue: this.amount,
          wish: '传播奖金红包',
          sendName: '一虎一席茶生活美学商城',
          actName: '奖金提现.专用红包',
          sence_id: 0,
          userId: user.userId || 0,
          openid: user.openid
        }).then(response => {
          if (response.result === 0) {
            this.refreshData();
            this.layer.text = '<p style="text-align:left">提现成功! 去拆微信红包吧!</p>';
            this.$refs.layerWin.show();
            this.amount = '';
          } else if (response.err_info && response.err_info.err_code === 'NOTENOUGH') {
            this.layer.text = '<p style="text-align:left">请联系客服检查商户账户~</p>';
            this.$refs.layerWin.show();
          } else if (response.result === 1 && response.data.code) {
            let wxcode = response.data.code;
            switch (wxcode) {
              case 'MONEY_LIMIT':
                this.layer.text = '<p style="text-align:left">提现金额必须在1.00元到200.00元之间</p>';
                this.$refs.layerWin.show();
                break;
              case 'NOTENOUGH':
                this.layer.text = '<p style="text-align:left">请联系客服检查商户账户~</p>';
                this.$refs.layerWin.show();
                break;
              default:
                this.layer.text = `<p style="text-align:left">${response.data.message}</p>`;
                this.$refs.layerWin.show();
                break;
            }
          } else {
            let code = response.code;
            switch (code) {
              case 8004:
                this.refreshData();
                this.layer.text = `<p style="text-align:left">部分提现成功! 成功提现: ${(response.data && response.data.sent || 0)}元</p>`;
                this.$refs.layerWin.show();
                break;
              case 8002:
                this.$store.dispatch('openToast', '输入错误, 超出可提现额度');
                break;
              case 8003:
                this.$store.dispatch('openToast', '非法操作！');
                break;
              default:
                this.$store.dispatch('openToast', '网络繁忙，请稍候再试下!');
                break;
            }
          }
          this.paying = false;
        }).catch(response => {
          this.paying = false;
        });
      },
      allin() {
        let profile = this.$store.getters.getUserProfile;
        this.amount = profile && profile.wallet && profile.wallet.alreadyReward || 0;
      },
      detail() {
        this.$router.push({name: 'withdrawdetail'});
      },
      fillAmount(amount) {
        this.amount = amount;
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
      fixedheader, layer
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
      width: auto
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
      .allin
        color: #44b549
      >.btns
        padding: 0 10px
        box-sizing: border-box
        .btn-green
          letter-spacing: 3px
      .btn-list
        position: relative
        display: flex
        margin-top: 10px
        padding-left: 4px
        padding-right: 3px
        box-sizing: border-box
        span
          flex: 1
          height: 26px
          line-height: 26px
          margin-right: 10px
          text-align: center
          font-size: 13px
          color: #fff
          border-radius: 2px
          &:last-child
            margin-right: 0
          &.btn-green
            background: #fff
            color: #66c153
            border: 1px solid #4bb336
          &.on
            background: #b3e2b5
            color: #fff
            border: 1px solid #b3e2b5
      .wallet-content
        padding: 10px
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
          position: relative
          display: flex
          width: 100%
          padding-left: 98px
          box-sizing: border-box
          .title
            position: absolute
            width: 98px
            top: 50%
            left: 4px
            font-size: 14px
            line-height: 1
            transform: translate(0, -50%)
            color: #828282
          .input-amount
            padding: 2px 0 0
            border: 0 none
            font-size: 14px
            width: 100%
            vertical-align: top
            border-bottom: 1px solid #ccc
            color: #828282
            margin-right: 3px
            box-sizing: border-box
        .leftMomey
          width:100%
          text-align: right
          font-size: 12px
          color: #ccc
          padding-top: 10px
        .btns
          font-size: 14px
          span
            letter-spacing: 0
            &.btn-red
              background-color: #e45050
              color: #f1f1f1
            &.btn-gray
              background: #ccc
              border-radius: 3px
            &.btn-green
              color: #ebeceb
</style>
