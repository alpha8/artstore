<template>
  <div>
    <fixedheader title="登录 / 注册" ref="header"></fixedheader>
    <div class="login">
      <div class="login-wrap">
        <div class="logo_wrap"><span class="logo"><img :src="logoSrc" /></span></div>
        <el-form :model="loginForm" ref="loginForm" class="user-login" :show-message="false" :rules="rules"  label-width="0">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" name="username" type="tel" placeholder="请输入手机号" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" name="code" placeholder="请输入收到的验证码" :clearable="true" minlength="4" maxlength="6">
              <template slot="append"><el-button class="btn_code" type="text" @click="getCode" size="medium">{{codeTips}}</el-button></template>
            </el-input>
          </el-form-item>
          <div class="btns"><span class="btn-orange" @click="onSubmit('loginForm')">登 录</span></div>
        </el-form>
        <p class="policy_tip"><span class="text-red">*</span> 未注册的手机号验证后, 将自动创建未来科技电商账号</p>
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
        logoSrc: api.CONFIG.logo,
        loginForm: {
          username: '',
          code: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '无效的手机号码', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur'}
          ]
        },
        countdown: 60,
        processing: false,
        codeTips: '获取验证码',
        timer: null
      };
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
      this._reset();
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.$router.push({name: 'my'});
            }).catch((error) => {
              this.$message({
                message: error,
                type: 'error',
                duration: 1500
              });
            });
          } else {
            this.$message({
              message: '请输入正确的手机号和验证码',
              type: 'error',
              duration: 1500
            });
            return false;
          }
        });
      },
      getCode() {
        if (!/^1[\d]{10}$/.test(this.loginForm.username)) {
          this.$store.dispatch('openToast', '手机号不正确哦！');
          return;
        }
        if (this.processing) {
          return;
        }
        this.timerLoop();
        this.processing = true;
        api.getVerifyCode(this.loginForm.username).then(response => {
          if (response.code == 200) {
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

<style lang="stylus" rel="stylesheet/stylus">
  .el-input-group__append
    background: none!important
    border: none!important
  .el-input__inner
    border: none!important
  .el-input
    border-bottom: 1px solid #DCDFE6!important
  .el-form-item
    margin-bottom: 10px!important
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .login
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    background: #fff
  .login-wrap
    position: relative
    background: #fff
    padding: 3px 10px 40px
    .logo_wrap
      text-align: center
      padding: 15px 0px
      .logo
        display: inline-block
        box-sizing: border-box
        text-align: center
        color: #fff
        width: 100px
        height: 100px
        line-height: 100px
        vertical-align: middle
        border-radius: 50%
        overflow: hidden
        >img
          display: block
          height: 100%
          vertical-align: middle
          object-fit: cover
    .btn_code
      width: 100px
      text-align: center
      color: #ff3603
      border-left: solid 1px #e8e8e8
      cursor: pointer
    .btns
      margin-top: 20px
      font-size: 15px
      .btn-orange
        border-radius: 25px
        height: 45px
        line-height: 45px
    .policy_tip
      padding: 10px
      font-size: 12px
      color: #999
</style>
