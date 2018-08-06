<template>
  <div>
    <fixedheader title="绑定手机号码" ref="header"></fixedheader>
    <div class="bindphone" ref="bindphone">
      <div class="add-address-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">手机号：</span>
              <input type="text" class="phone" v-model="phone" placeholder="请输入手机号" maxlength="20" autofocus required>
              <span class="btn-code" v-if="phone.length && getcode && !processing" @click.stop.prevent="getCode">{{codeTips}}</span>
              <span class="btn-code disabled" v-if="processing">{{codeTips}}</span>
            </p>
          </li>
          <li class="border-1px" v-if="getcode">
            <p>
              <span class="title">验证码：</span>
              <input type="text" v-model="code" placeholder="请输入验证码" maxlength="6" required>
            </p>
          </li>
        </ul>
        <div class="btns" :class="{'btn-gray': invalid, 'btn-green': !invalid}" @click.stop.prevent="doBind"><span>绑定</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    data() {
      return {
        userProfile: this.$store.getters.getUserProfile,
        phone: '',
        code: '',
        countdown: 60,
        processing: false,
        codeTips: '获取验证码',
        timer: null,
        getcode: false
      };
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
      this._reset();
      this.code = '';
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    created() {
      this.phone = this.userProfile.user && this.userProfile.user.mobileNumber || '';
    },
    computed: {
      invalid() {
        let error = false;
        this.getcode = false;
        if (/^1[\d]{10}$/.test(this.phone)) {
          this.getcode = true;
          return false;
        } else if (this.phone.length <= 8) {
          error = true;
        } else {
          error = false;
        }
        if (this.getcode && this.code.length !== 6) {
          error = true;
        }
        return error;
      }
    },
    methods: {
      doBind() {
        let user = this.$store.getters.getUserInfo;
        if (this.getcode) {
          api.verifyCode(this.phone, this.code).then(response => {
            if (response.result === 0) {
              api.bindPhone({
                mobileNumber: this.phone,
                userId: user.userId || -1
              }).then(res => {
                if (res.result === 0) {
                  this.$store.dispatch('openToast', '手机绑定成功!');
                  this.$router.push('my');
                } else {
                  this.$store.dispatch('openToast', '网络太忙了，请稍候再试!');
                }
              }).catch(response => {
                console.error(response);
              });
            } else {
              this.$store.dispatch('openToast', '验证码不正确哦!');
            }
          }).catch(response => {
            this.$store.dispatch('openToast', '网络太忙了，请稍候再试!');
          });
        } else {
          api.bindPhone({
            mobileNumber: this.phone,
            userId: user.userId || -1
          }).then(res => {
            if (res.result === 0) {
              this.$store.dispatch('openToast', '手机绑定成功!');
              this.$router.push('my');
            } else {
              this.$store.dispatch('openToast', '网络太忙了，请稍候再试!');
            }
          }).catch(response => {
            console.error(response);
          });
        }
      },
      getCode() {
        if (!/^1[\d]{10}$/.test(this.phone)) {
          this.$store.dispatch('openToast', '手机号码不正确哦！');
          return;
        }
        this.processing = true;
        this.timerLoop();
        api.getVerifyCode(this.phone).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '验证码已下发，请注意查收!');
          } else {
            this.$store.dispatch('openToast', '网络太忙了, 请稍候再试!');
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络故障，请稍候再试!');
        });
      },
      timerLoop() {
        this.codeTips = `${--this.countdown}s后重试`;
        if (this.countdown <= 0) {
          clearTimeout(this.timer);
          this._reset();
        } else {
          this.timer = setTimeout(this.timerLoop, 1000);
        }
      },
      _reset() {
        this.countdown = 60;
        this.codeTips = '获取验证码';
        this.processing = false;
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .bindphone
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
  .add-address-wrap
    position: relative
    background: #fff
    padding: 3px 10px 40px
    ul
      position: relative
      li
        position: relative
        padding: 8px 0 0 72px
        box-sizing: border-box
        &.border-1px
          padding: 8px 0 8px 65px
          border-1px(rgba(7, 17, 27, 0.1))
        .text-control
          height: 20px
          line-height: normal
          border: 0 none
          font-size: 14px
          width: 100%
          vertical-align: top
          &.tips
            color: #BBBBBB
        p
          display: block
          box-sizing: border-box
          &.pr
            padding-right: 2px
          .title
            position: absolute
            display: block
            width: 68px
            top: 50%
            left: 0
            right: 0
            margin: auto 0
            transform: translate(0, -50%)
            text-align: left
            text-indent: 7px
            font-size: 14px
            line-height: 1
            &.special
              top: 18px
          input
            height: 20px
            line-height: normal
            border: 0 none
            font-size: 14px
            width: 100%
            vertical-align: top
            box-sizing: border-box
            &.phone
              padding-right: 85px
          .btn-code
            position: absolute
            right: 6px
            top: 5px
            height: 26px
            line-height: 26px
            font-size: 12px
            padding: 0 8px
            background-color: #44b549
            color: #ebeceb
            border-radius: 2px
            &.disabled
              color: #999
              background: rgba(7,17,27,0.1)
              border: 1px solid rgba(7,17,27,0.1)
          textarea
            width: 100%
            border: 1px dashed #ccc
            resize: none
            font-size: 14px
            line-height: 1.5
            padding-right: 20px
            box-sizing: border-box
          .icon-close
            position: absolute
            top: 13px
            right: 7px
            font-size: 18px
          &.more:after
            position: absolute
            display: block
            width: 10px
            height: 10px
            content: ""
            border-top: 1px solid #666
            border-left: 1px solid #666
            -webkit-transform-origin: 50%
            transform-origin: 50%
            -webkit-transform: rotate(135deg)
            transform: rotate(135deg)
            top: 50%
            right: 5px
            margin-top: -4px
    .btns
      margin-top: 10px
      margin-left: 0
      font-size: 15px
</style>
