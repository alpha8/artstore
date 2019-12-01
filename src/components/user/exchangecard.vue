<template>
  <div>
    <fixedheader title="礼品卡兑换" :showBack="true"></fixedheader>
    <div class="wallet" ref="wallet">
      <div class="wallet-wrapper">
        <div class="wallet-heading">
          <div class="balance-name">
            <img src="http://imgcdn.win-berry.com/1572429199105.png?imageView2/2/w/750/h/500" alt="">
          </div>
        </div>
        <split></split>
        <div class="tab border-1px">
          <div class="tab-item" :class="{'active': activeItem === 'cardcode'}" @click.stop.prevent="changeTab('cardcode')">卡号 + 卡密兑换</div>
          <div class="tab-item" :class="{'active': activeItem === 'code'}" @click.stop.prevent="changeTab('code')">激活码兑换</div>
        </div>

        <div class="wallet-content" v-if="activeItem === 'cardcode'">
          <div class="form-control">
            <span class="title">卡号：</span>
            <input name="cardNo" placeholder="请输入卡号" class="input-amount" v-model="cardNo" autofocus>
          </div>
          <div class="form-control">
            <span class="title">密码：</span>
            <input name="code" placeholder="请输入卡密" class="input-amount" v-model="code">
          </div>
          <div class="btns">
            <span class="btn-orange" :class="{'btn-gray': !cardNo || !code}" @click="exchange">立即兑换</span>
          </div>
        </div>

        <div class="wallet-content" v-else>
          <div class="form-control">
            <span class="title">激活码：</span>
            <input name="activationCode" placeholder="请输入激活码" class="input-amount" v-model="activationCode" autofocus>
          </div>
          <div class="btns">
            <span class="btn-orange" :class="{'btn-gray': !activationCode}" @click="exchangeActivation">立即兑换</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import api from '@/api/api';

  export default {
    data() {
      return {
        cardNo: '',
        code: '',
        activationCode: '',
        activeItem: 'cardcode'
      };
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
      changeTab(flag) {
        this.activeItem = flag;
      },
      exchange() {
        if (this.cardNo && this.code) {
          api.exchangeCard({
            cardNo: this.cardNo || '',
            code: this.code || ''
          }).then(response => {
            if (response.code == 200) {
             this.$message.success(response.message);
            } else {
             this.$message.error(response.message);
            }
          });
        } else {
          this.$store.dispatch('openToast', '卡号或卡密不能为空！');
        }
      },
      exchangeActivation() {
        if (this.activationCode) {
          api.exchangeCard({
            code: this.activationCode || ''
          }).then(response => {
            if (response.code == 200) {
             this.$message.success(response.message);
            } else {
             this.$message.error(response.message);
            }
          });
        } else {
          this.$store.dispatch('openToast', '激活码不能为空！');
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
      box-sizing: border-box
      overflow: hidden
      .wallet-heading
        position: relative
        .balance-name
          position: relative
          width: 100%
          height: 260px
          padding: 10px 20px
          box-sizing: border-box
          overflow: hidden
          background-color: #fff
          img
            width: 100%
            height: auto
      >.btns
        padding: 0 10px
        box-sizing: border-box
        .btn-green
          letter-spacing: 3px
      .tab
        position: relative
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
          flex: 1
          font-size: 14px
          padding: 15px 0
          text-align: center
          border-bottom: 2px solid transparent
          &.active
            color: #f15353
            border-bottom: 2px solid #f15353
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
          height: 45px
          padding-left: 68px
          box-sizing: border-box
          .title
            position: absolute
            width: 68px
            top: 50%
            left: 4px
            font-size: 14px
            line-height: 1
            transform: translate(0, -50%)
            color: #828282
            box-sizing: border-box
          .input-amount
            padding: 2px 0 0
            border: 0 none
            font-size: 14px
            text-indent: 5px
            width: 100%
            vertical-align: top
            border-bottom: 1px solid #ccc
            color: #828282
            margin-right: 10px
            box-sizing: border-box
        .btns
          padding-top: 10px
          font-size: 14px
          text-align: center
          flex-direction: column
          align-items: center
          align-content: center
          span
            letter-spacing: 0
            border-radius: 50px
            width: 250px
            height: 40px
            line-height: 40px
            flex: none
            &.btn-red
              background-color: #e45050
              color: #f1f1f1
            &.btn-gray
              background: #ccc
            &.btn-green
              color: #ebeceb
</style>
