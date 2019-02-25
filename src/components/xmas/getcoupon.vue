<template>
  <div>
    <fixedheader :title="getCouponTitle" :showBack="false"></fixedheader>
    <div class="coupon" ref="coupon">
      <div class="coupon-wrapper">
        <div class="coupon-content">
          <div class="btns" @click.stop.prevent="doAction"><span class="btn-red">立即领取</span></div>
        </div>
        <div class="split"></div>
        <div class="coupon-rules">
          <div class="rule-title">————  活动规则 ———— </div>
          <div class="rule-content">
            <ol v-if="!qrcode.content">
              <li>优惠券可叠加使用，订单支付时系统将自动抵扣</li>
              <li>如有其它疑问，请咨询一虎一席茶生活美学商城客服</li>
            </ol>
            <div v-html="qrcode.content"></div>
          </div>
        </div>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="layerWin"></layer>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import layer from '@/components/common/layer';
  import api from '@/api/api';

  export default {
    data() {
      return {
        phone: '',
        code: '',
        sendLock: false,
        waitSecs: 60,
        qrcode: {},
        openid: '',
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
      isValid() {
        if (this.phone.length === 11 && this.code.length === 6) {
          return true;
        }
        return false;
      },
      resendTips() {
        if (this.sendLock) {
          return `${this.waitSecs}秒后重新发送`;
        } else {
          return '发送验证码';
        }
      },
      getCouponTitle() {
        return '🌈' + (this.qrcode.provideTitle || '优惠券领取');
      }
    },
    activated() {
      this.fetchData();
      this.show();
    },
    deactivated() {
      this.hide();
      let msgDom = document.getElementsByClassName('msgBox');
      let maskDom = document.getElementsByClassName('msgBox-mask');
      if (msgDom && maskDom) {
        msgDom[0].style.display = 'block';
        maskDom[0].style.display = 'block';
      }
    },
    mounted() {
      let msgDom = document.getElementsByClassName('msgBox');
      let maskDom = document.getElementsByClassName('msgBox-mask');
      if (msgDom && maskDom) {
        msgDom[0].style.display = 'none';
        maskDom[0].style.display = 'none';
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.coupon, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      fetchData() {
        let qrid = this.$route.query.qrid;
        let openid = this.$route.query.openid || '';
        if (qrid) {
          this.$store.dispatch('openLoading');
          api.resolveQrcode(qrid).then(response => {
            this.qrcode = response;
            this.openid = openid;
            this._initScroll();
            this.$store.dispatch('closeLoading');
          }).catch(response => {
            this.$store.dispatch('closeLoading');
          });
        }
      },
      sendVerifyCode() {
        if (this.phone.length !== 11 || this.sendLock) {
          return;
        }
        api.getVerifyCode(this.phone).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '验证码已下发，请查收!');
            this.sendLock = true;
            let timer = setInterval(() => {
              this.waitSecs--;
              if (this.waitSecs <= 0) {
                clearInterval(timer);
                this.sendLock = false;
                this.waitSecs = 60;
              }
            }, 1000);
          }
        });
      },
      doAction() {
        let that = this;
        this.layer.button.callback = function() {
          that.$router.push('/home');
        };
        let publishid = this.$route.query.publishid || 0;
        api.receiveQrcode({
          qrid: this.qrcode.id,
          openid: this.openid,
          provideId: publishid
        }).then(response => {
          if (response.result === 0) {
            this.layer.text = '优惠券领取成功，您可前往一虎一席茶生活美学商城「个人中心 — 优惠券余额」中查看明细';
            this.$refs.layerWin.show();
          } else if (response.code === 1001) {
            this.layer.text = '您已领取过此优惠券';
            this.$refs.layerWin.show();
          } else if (response.code === 1002) {
            this.layer.text = '优惠券已领完';
            this.$refs.layerWin.show();
          } else {
            this.layer.text = '优惠券太火爆了，请稍候再来!';
            this.$refs.layerWin.show();
          }
          this.code = '';
        }).catch(response => {
          this.layer.text = '优惠券太火爆了，请稍候再来!';
          this.$refs.layerWin.show();
        });
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
      fixedheader, split, layer
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    display: flex
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
  .coupon
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    background: #2A2239 url(http://www.yihuyixi.com/ps/download/5a2fafabe4b077b5f4fd8a06) no-repeat
    background-size: 100% auto
    overflow: hidden
    .coupon-wrapper
      position: relative
      width: 100%
      box-sizing: border-box
      overflow: hidden
      .coupon-content
        margin-top: 95%
        font-size: 14px
        line-height: 1.5
        padding: 0 20px
        box-sizing: border-box
        .coupon-tips
          color: #fff
          margin-left: 3px
        .form-group
          position: relative
          display: flex
          width: 100%
          margin-bottom: 8px
          .phone, .code
            flex: 1
            line-height: 40px
            text-indent: 10px
            box-sizing: border-box
          .sendCode
            width: 140px
            text-align: center
            line-height: 40px
            background: #ccc
            color: #fff
            &.active
              background: #d05148
        .btns
          padding-top: 40px
      .coupon-rules
        position: relative
        padding: 10px 20px
        .rule-title
          color: #ccc
          height: 40px
          line-height: 40px
          text-align: center
          font-weight: 700
        .rule-content
          padding: 0 20px
          font-size: 14px
          line-height: 1.5
          color: #ccc
</style>
