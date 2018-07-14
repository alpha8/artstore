<template>
  <div>
    <fixedheader :title="qrcode.provideTitle || '推荐有礼'" :showBack="true"></fixedheader>
    <div class="invitation" ref="invitation">
      <div class="invitation-wrapper">
        <div class="invitation-heading" v-if="qrcode.gridfsids">
          <p class="balance-name">分享二维码</p>
          <p class="balance-num">
            <img v-show="icon" :src="getQrcodeSrc" width="260" height="260" border="0" class="qrcodeIcon" @click.stop.prevent="previewQrcode" />
          </p>
          <div class="tips" v-if="qrcode.provideTotal - qrcode.receiveTotal <= 10">优惠券仅剩{{qrcode.provideTotal - qrcode.receiveTotal}}张，请联系管理员充值</div>
        </div>
        <div class="invitation-content">
          <div class="table-responsive">
            <table class="table">
              <caption>--- 已邀请用户列表<span v-if="coupons.length">({{coupons.length}}人)</span> ---</caption>
              <tr>
                <th>用户</th>
                <th>领取金额</th>
                <th>领取时间</th>
              </tr>
              <tr v-for="(coupon, index) in coupons" :key="index">
                <td>{{coupon.userId}}</td>
                <td v-if="coupon.type === 0">{{coupon.payValue | currency}}</td>
                <td v-else>{{coupon.payValue * 10}}折</td>
                <td>{{coupon.createAt | formatDate}}</td>
              </tr>
            </table>
          </div>
          <!-- <div class="pager">
            <ul class="pagination">
              <li><span>首页</span></li>
              <li><span>上一页</span></li>
              <li><span>下一页</span></li>
              <li><span>末页</span></li>
            </ul>
          </div> -->
          <p class="content-title">转发方式</p>
          <p class="content-text">
            您可通过朋友圈、文章等方式转发此二维码。
          </p>
          <p class="content-title">好友福利</p>
          <p class="content-text">
            受邀请的好友，可扫描二维码领取优惠券，可直接用于抵扣订单金额。
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
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  export default {
    data() {
      return {
        qrcode: {},
        icon: '',
        coupons: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        loadEnd: false
      };
    },
    activated() {
      this.show();
      this.fetchData();
    },
    deactivated() {
      this._reset();
      this.hide();
      this.icon = '';
    },
    computed: {
      getQrcodeSrc() {
        if (this.qrcode.gridfsids) {
          let user = this.$store.getters.getUserInfo;
          this.qrcode.gridfsids.forEach(item => {
            if (item.userid === user.userId) {
              this.icon = `${api.CONFIG.cmsCtx}/qrcode/download/${item.gridfsid}`;
              this._initScroll();
            }
          });
        }
        return this.icon || '';
      }
    },
    methods: {
      fetchData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.$store.dispatch('openToast', '请登录!');
          return;
        }
        let id = this.$route.params.id;
        if (!id) {
          this.$store.dispatch('openToast', '非法访问!');
          return;
        }
        this.$store.dispatch('openLoading');
        api.getQrcode(id).then(response => {
          if (response && response.id) {
            this.qrcode = response;
            let exist = false;
            if (this.qrcode.gridfsids) {
              this.qrcode.gridfsids.forEach(item => {
                if (item.userid === user.userId) {
                  exist = true;
                }
              });
            }
            if (!exist) {
              api.generateQrcode({
                id: response.id,
                provideId: user.userId
              }).then(res => {
                if (res.result === 0) {
                  this.qrcode.gridfsids = [{userid: user.id, gridfsid: res.gridfsid}];
                  this.icon = `${api.CONFIG.cmsCtx}/qrcode/download/${res.gridfsid}`;
                  this._initScroll();
                }
              });
            }
            this.fetchCoupons();
            this._initScroll();
          }
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      fetchCoupons() {
        if (this.totalPages && this.pageNumber > this.totalPages) {
          return;
        }
        this.loading = true;
        let user = this.$store.getters.getUserInfo;
        api.getCoupons({
          agentId: user.userId || -1,
          qrcodeid: this.qrcode.id
        }).then(response => {
          this.coupons = response;
          this.totalPages = 1;
          this.pageNumber++;
          this.lastExec = +new Date();
          this.loading = false;
          this.loadEnd = this.pageNumber > this.totalPages;
          this._initScroll();
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
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
      previewQrcode() {
        if (this.icon) {
          let url = this.icon;
          if (url.indexOf('http') < 0) {
            url = 'http://www.yihuyixi.com' + url;
          }
          wx.previewImage({
            current: url,
            urls: [url]
          });
        }
      },
      _reset() {
        this.coupons = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
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
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
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
          text-align: center
          vertical-align: baseline
        .balance-num
          line-height:1
          padding-top: 15px
          text-align: center
        .tips
          padding-top: 5px
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
          padding-bottom: 9px
        .table-responsive
          width: 100%
          margin-bottom: 15px
          min-height: .01%
          overflow-x: auto
          overflow-y: hidden
          -ms-overflow-style: -ms-autohiding-scrollbar
          .table
            width: 100%
            max-width: 100%
            margin-bottom: 0
            display: table
            border-spacing: 0
            border-collapse: collapse
            background-color: transparent
            font-size: 12px
            border-left: 1px solid #ddd
            border-right: 1px solid #ddd
            border-bottom: 1px solid #ddd
            caption
              display: table-caption
              text-align: center
              padding: 10px 0
              color: #666
              font-size: 14px
              font-weight: 700
              span
                font-size: 12px
            th, td
              padding: 8px 5px
              line-height: 1.42
              vertical-align: top
              border-top: 1px solid #ddd
              text-align: center
              &.text-left
                text-align: left
            tr:nth-of-type(even)
              background-color: #fcf8e3
        .pager
          width: 100%
          text-align: center
          .pagination
            display: inline-block
            margin: 5px 0
            border-radius: 4px
            >li
              display: inline;
              text-align: -webkit-match-parent
              span
                position: relative
                float: left
                padding: 6px 12px
                margin-left: -1px
                line-height: 1.42
                color: #337ab7
                background: #fff
                border: 1px solid #ddd
                font-size: 12px
</style>

