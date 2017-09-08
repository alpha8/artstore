<template>
  <div>
    <fixedheader title="优惠券领取"></fixedheader>
    <div class="coupon" ref="coupon">
      <div class="coupon-wrapper">
        <div class="coupon-content">
          <div class="form-group">
            <input type="tel" name="phoneNo" v-model="phone" class="phone" placeholder="请输入您的手机号" minlength="11" maxlength="11">
          </div>
          <div class="form-group">
            <input type="text" name="verifyCode" v-model="code" class="code" placeholder="请输入验证码" minlength="6" maxlength="6">
            <span class="sendCode" :class="{'active': phone.length === 11}" @click.stop.prevent="sendVerifyCode">{{resendTips}}</span>
          </div>
          <div class="form-group btns" @click.stop.prevent="doAction"><span class="btn-red" :class="{'btn-gray': !isValid}">立即领取</span></div>
        </div>
        <div class="split"></div>
        <div class="coupon-rules">
          <div class="rule-title">————  活动规则 ———— </div>
          <div class="rule-content">
            <ol>
              <li>领取的优惠券将与填写的手机号码进行绑定</li>
              <li>优惠券可叠加使用，订单支付时系统将自动抵扣</li>
              <li>如有其它疑问，请咨询一虎一席艺术平台客服</li>
            </ol>
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
        phone: '',
        code: '',
        sendLock: false,
        waitSecs: 60
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
      }
    },
    activated() {
      this._initScroll();
      this.show();
    },
    deactivated() {
      this.hide();
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
      sendVerifyCode() {
        if (this.phone.length !== 11 || this.sendLock) {
          return;
        }
        api.getVerifyCode(this.phone).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '验证码已下发，请查收！');
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
        api.verifyCode(this.phone, this.code).then(response => {
          if (response.code === 0) {
            this.$store.dispatch('openToast', '领取成功！');
            this.$router.push('/home');
          }
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
  .coupon
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    background: #2A2239 url(http://www.yihuyixi.com/ps/download/59a5191ae4b0f21ffdcbcc85) no-repeat
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
          li
            list-style: decimal
</style>
