<template>
  <div>
    <fixedheader title="我的推广码" :showBack="true"></fixedheader>
    <div class="invitation" ref="invitation">
      <div class="invitation-wrapper">
        <div class="invitation-heading">
          <p class="balance-num" v-if="getQrcodeSrc">
            <img :src="getQrcodeSrc" width="260" height="260" border="0" class="qrcodeIcon" @click.stop.prevent="previewQrcode" />
          </p>
        </div>
        <div class="invitation-content">
          <p class="content-title">转发方式</p>
          <p class="content-text">
            您可通过朋友圈、文章等方式转发此二维码。
          </p>
          <p class="content-title">好友福利</p>
          <p class="content-text">
            受邀请的好友，可扫描二维码关注公众号，新注册用户赠送300元优惠券。
          </p>
          <p class="content-title">您的福利</p>
          <p class="content-text">
            领券的好友，之后 3 年在平台上进行的所有交易（用券或不用），您都将获得 3% 的奖金.您可前往「个人中心 - 奖金余额」中查询到返现总额。
          </p>
          <p class="content-title">会员福利</p>
          <p class="content-text">
            当好友交易额或您的推荐人数达到一定数量，也会提升您的会员等级，获得更大的优惠折扣。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  export default {
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      getQrcodeSrc() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return '';
        }
        return `${api.CONFIG.wxCtx}/getQrcode?type=1&sceneId=${user.userId}`;
      }
    },
    methods: {
      previewQrcode() {
        let user = this.$store.getters.getUserInfo;
        let url = `${api.CONFIG.wxCtx}/getQrcode?type=1&sceneId=${user.userId}`;
        if (url.indexOf('http') < 0) {
          url = 'http://www.yihuyixi.com' + url;
        }
        console.log(url);
        wx.previewImage({
          current: url,
          urls: [url]
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
    overflow: auto
    -webkit-overflow-scrolling: touch
    .invitation-wrapper
      position: relative
      width: 100%
      padding-bottom: 30px
      background-color: #fff
      .invitation-heading
        padding: 20px 10px
        color: #fff
        background: #e45050
        .balance-name
          font-size: 14px
          font-weight: 700
          color: hsla(0,0%,100%,.7)
          text-align: center
          vertical-align: baseline
        .balance-num
          line-height:1
          padding-top: 15px
          text-align: center
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
          padding-bottom: 9px
</style>

