<template>
  <div>
    <fixedheader title="推荐有礼" :showBack="true"></fixedheader>
    <div class="invitation" ref="invitation">
      <div class="invitation-wrapper">
        <div class="invitation-heading" v-if="qrcode.gridfsid">
          <p class="balance-name">分享二维码</p>
          <p class="balance-num">
            <img :src="getQrcodeSrc" width="180" height="180" border="0" />
          </p>
          <div class="tips" v-if="qrcode.provideTotal - qrcode.receiveTotal <= 10">优惠券可领张数不足，仅有{{qrcode.provideTotal - qrcode.receiveTotal}}张，请联系管理员充值</div>
        </div>
        <div class="invitation-content">
          <p class="content-title">转发方式</p>
          <p class="content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;您可通过朋友圈、文章等方式转发此二维码
          </p>
          <p class="content-title">好友福利</p>
          <p class="content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;受邀请的好友，可扫描二维码领取优惠券，可直接用于抵扣订单金额
          </p>
          <p class="content-title">您的福利</p>
          <p class="content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;领券的好友，之后 3 年在平台上进行的所有交易（用券或不用），您都将获得 3% 的返利.您可前往「一虎一席茶席艺术平台公众号 — 个人中心 - 返利」中查询到返现总额
          </p>
          <p class="content-title">会员福利</p>
          <p class="content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;当好友交易额或您的推荐人数达到一定数量，也会提升您的会员等级，获得更大的优惠折扣
          </p>
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
        qrcode: {}
      };
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    created() {
      this.fetchData();
    },
    computed: {
      getQrcodeSrc() {
        if (this.qrcode.gridfsid) {
          return `${api.CONFIG.cmsCtx}/qrcode/download/${this.qrcode.gridfsid}`;
        }
        return '';
      }
    },
    methods: {
      fetchData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.$store.dispatch('openToast', '请登录!');
          return;
        }
        this.$store.dispatch('openLoading');
        api.getQrcode(user.userId).then(response => {
          if (response.result === 0) {
            let qrcodes = response.qrCodes;
            if (qrcodes && qrcodes.length) {
              this.qrcode = qrcodes[0];
              this._initScroll();
            }
          }
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.invitation, {
              click: true
            });
          } else {
            this.scroll.refresh();
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
  .invitation
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .invitation-wrapper
      position: relative
      width: 100%
      background-color: #fff
      box-sizing: border-box
      overflow: hidden
      .invitation-heading
        padding: 20px 10px
        color: #fff
        background: #e45050
        .balance-name
          font-size: 14px
          font-weight: 700
          color: hsla(0,0%,100%,.7)
          vertical-align: baseline
        .balance-num
          line-height:1
          padding-top: 15px
          text-align: center
        .tips
          font-weight: 700
          color: hsla(0,0%,100%,.7)
          text-align: center
          font-size: 14px
      .invitation-content
        padding: 13px 10px
        color: #666
        background: #fff
        .content-title
          font-weight: 700
          font-size: 14px
          color: #333
          margin-bottom: 3px
        .content-text
          font-size: 12px
          line-height: 1.83em
          padding-bottom: 7px
</style>

