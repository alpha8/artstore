<template>
  <div class="my" ref="my">
    <div class="my-wrapper">
      <div class="header-wrapper">
        <div class="box">
          <div class="box-container">
            <div class="avatar">
              <a v-show="!hasLogin()" :href="getLoginUrl()"><img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10?w=80&h=80" alt="" class="pic"></a>
              <img :src="user().icon" alt="" class="pic" v-show="hasLogin()">
            </div>
            <div class="line">
              <div class="userName" v-show="!hasLogin()"><a :href="getLoginUrl()">点击登录</a></div>
              <div class="userName" v-show="hasLogin()"><span class="svip" :class="getSVipIcon" v-if="userExt.spreadLevel"></span>{{user().nickName}}<span class="supplier" v-if="userExt.model === 2">(代理商)</span></div>
              <div class="info" v-show="hasLogin()"><span class="vip" :class="getVipIcon">{{getVipTitle}}</span></div>
            </div>
            <span class="setting" v-show="hasLogin()"><router-link to="/personInfo"><img src="../../common/images/settings.png"/><span>账号管理</span></router-link></span>
          </div>
        </div>
      </div>
      <div class="order-wrapper">
        <div class="title border-1px">
          <router-link to="/order">
            <i class="icon-order"></i>我的订单
            <span class="more"><span>查看全部订单</span><i class="icon-keyboard_arrow_right"></i></span>
          </router-link>
        </div>
        <ul class="itemList">
          <li class="item border-1px" v-for="item in orders">
            <router-link :to="item.link">
              <div class="icon"><i :class="item.icon"></i></div>
              <div class="text">{{item.text}}</div>
            </router-link>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="wallet-wrapper">
        <div class="title border-1px">
          <router-link to="">
            <i class="icon-wallet"></i>我的钱包
            <!-- <span class="more"><i class="icon-keyboard_arrow_right"></i></span> -->
          </router-link>
        </div>
        <ul class="itemList">
          <li class="item border-1px" v-for="item in wallet">
            <router-link :to="item.link">
              <div class="amount">{{item.amount | currency}}</div>
              <div class="text">{{item.text}}</div>
            </router-link>
          </li>
        </ul>
      </div>
      <split v-show="profile.hasQrCode"></split>
      <div class="invite-wrapper" v-show="profile.hasQrCode">
        <div class="title border-1px">分享有礼</div>
        <div class="item-list">
          <router-link class="item border-1px" to="/myrecommend">
            <span class="text"><i class="icon-gift_card"></i> 专属优惠活动，推荐好友拿奖金！</span>
            <span class="more"><i class="icon-keyboard_arrow_right"></i></span>
          </router-link>
        </div>
      </div>
      <split></split>
      <div class="other-wrapper">
        <div class="title border-1px">其他</div>
        <div class="otherList">
          <router-link :to="item.link" class="item border-1px" v-for="(item, index) in others" key="index" :class="{'highlight': item.highlight}">
            <i :class="item.icon"></i>
            <span class="text" v-show="!item.callable">{{item.text}}</span>
            <span class="text" v-show="item.callable" @click.stop.prevent="item.callable">{{item.text}}</span>
            <span class="more" v-show="!item.noPage"><i class="icon-keyboard_arrow_right"></i></span>
          </router-link>
        </div>
      </div>
    </div>
    <frame></frame>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import {mapGetters} from 'vuex';
  import {removeCookie} from '@/common/js/store';
  import frame from '@/components/common/myiframe';
  import api from '@/api/api';

  export default {
    data() {
      return {
        orders: [
          { icon: 'icon-pending_payment', text: '待付款', link: '/order?type=0' },
          { icon: 'icon-delivery_package_box', text: '待发货', link: '/order?type=1' },
          { icon: 'icon-truck', text: '待收货', link: '/order?type=2' },
          { icon: 'icon-refund_and_return', text: '退换货', link: '/order?type=6' }
        ],
        wallet: [
          { amount: 0, text: '账户余额', link: '/wallet' },
          { amount: 0, text: '优惠券余额', link: '/coupon' },
          { amount: 0, text: '奖金余额', link: '/cashback' }
        ],
        others: [
          { icon: 'icon-miaosha', text: '我的秒杀', link: '/myseckill' },
          { icon: 'icon-group_purchase', text: '我的团购', link: '/mygroupbuy' },
          { icon: 'icon-auction', text: '我的拍卖', link: '/myauction' },
          { icon: 'icon-heart', text: '我的收藏', link: '/follow' },
          { icon: 'icon-footprint', text: '浏览足迹', link: '/footprint' },
          { icon: 'icon-address', text: '收货地址', link: '/address' },
          {
            icon: 'icon-command',
            text: '清理缓存',
            link: '',
            noPage: true,
            callable: () => {
              window.localStorage.clear();
              removeCookie('wxuser', '', '.yihuyixi.com');
              this.$store.dispatch('openToast', '缓存清理成功！');
            }
          }
          /*
          ,{
            icon: 'icon-quit',
            text: '退出登录',
            link: '',
            noPage: true,
            highlight: true,
            callable: () => {
              removeCookie('wxuser', '', '.yihuyixi.com');
              this.$router.push('/home');
            }
          }
           */
        ],
        userExt: {},
        profile: {}
      };
    },
    activated() {
      this.refreshData();
    },
    mounted() {
      this._initScroll();
    },
    computed: {
      getVipTitle() {
        // let userLevel = {'lv0': '初级用户', 'lv1': 'VIP一钻', 'lv2': 'VIP二钻', 'lv3': 'VIP三钻', 'lv4': 'VIP四钻', 'lv5': 'VIP五钻'};
        let agentLevel = {'lv0': '普通用户', 'lv1': '皇冠一星', 'lv2': '皇冠二星', 'lv3': '皇冠三星', 'lv4': '皇冠四星', 'lv5': '皇冠五星'};
        let level = this.userExt.level || 'lv0';
        if (this.userExt.model === 1) {
          // 普通用户
          return agentLevel[level];
        } else if (this.userExt.model === 2) {
          // 供应商
          return agentLevel[level];
        } else {
          return agentLevel[level];
        }
      },
      getSVipTitle() {
        let lv = this.userExt.spreadLevel || 'lv1';
        let sLevel = {'lv1': '传播小兵', 'lv2': '传播少校', 'lv3': '传播中校', 'lv4': '传播上校', 'lv5': '传播少将'};
        return sLevel[lv];
      },
      getVipIcon() {
        return this.userExt.level || 'lv0';
      },
      getSVipIcon() {
        return this.userExt.spreadLevel || 'lv1';
      }
    },
    updated() {
      this._initScroll();
    },
    methods: {
      ...mapGetters({
        hasLogin: 'checkLogined',
        user: 'getUserInfo'
      }),
      refreshData() {
        let user = this.$store.getters.getUserInfo;
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('updateUserProfile', response);
            if (this.wallet.length >= 3) {
              this.wallet[0].amount = response.wallet && response.wallet.accountValue || 0;
              let couponValue = response.wallet && response.wallet.totalValue || 0;
              this.wallet[1].amount = couponValue;
              this.$store.dispatch('updateCouponAmount', couponValue);
              this.wallet[2].amount = response.wallet && response.wallet.rewardValue || 0;
            }
            this.userExt = response.user || {};
            this.profile = response;
          }
          this._initScroll();
        }).catch(response => {
          console.error(response);
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.my, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      getLoginUrl() {
        let redirect = 'http://' + location.host + location.pathname + '#/my';
        return `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
      }
    },
    components: {
      fixedheader, split, frame
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';

  .my
    position: absolute
    left: 0
    top: 0
    bottom: 50px
    width: 100%
    overflow: hidden
  .header-wrapper
    position: relative
    width: 100%
    padding: 10px
    background-color: #fff
    box-sizing: border-box
    overflow: hidden
    .box
      padding: 30px 0
      border-radius: 6px
      font-size: 12px
      color: #fff
      background: -webkit-linear-gradient(left,#eb3c3c,#ff7459)
      background: linear-gradient(90deg,#eb3c3c,#ff7459)
      box-shadow: 0 2px 4px rgba(228,57,60,.4)
      .box-container
        display: flex
        -webkit-box-align: center
        align-items: center
        padding: 0 15px
        .avatar
          position: relative
          margin-right: 10px
          width: 60px
          height: 60px
          border: 1px solid hsla(0,0%,100%,.4)
          border-radius: 60px
          box-shadow: 0 2px 10px rgba(0,0,0,.15)
          overflow: hidden
          img
            position: absolute
            top: 0
            left: 0
            width: 100%
            border-radius: 60px
        .line
          position: relative
          flex: 1
          width: 1px
          .userName
            position: relative
            display: inline-block
            width: 100%
            max-width: 100%
            font-size: 14px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            box-sizing: border-box
            color: #e1e1e1
            a
              display: inline-block
              width: 60px
              text-align: center
              height: 22px
              line-height: 22px
              background-color: #9f3838
              border-radius: 3px
              color: #e0e0e0
              font-size: 12px
              box-sizing: border-box
            .supplier
              font-size: 10px
            .svip
              position: relative
              display: block
              float: left
              width: 16px
              height: 16px
              background: url(../../common/images/icons.png) no-repeat 0 0
              margin-right: 2px
              &.lv1
                background-position: 0 0
              &.lv2
                background-position: 0 -25px
              &.lv3
                background-position: 0 -50px
              &.lv4
                background-position: 0 -75px
              &.lv5
                background-position: 0 -100px
              &.lv6
                background-position: 0 -125px
              &.lv7
                background-position: 0 -150px
          .info
            margin-top: 5px
            .vip, .svip
              position: relative
              padding: 2px 8px 2px 15px
              height: 16px
              line-height: 16px
              font-size: 10px
              color: #e1e1e1
              background: #9f3838
              border-radius: 12px
              &:before
                content: ""
                display: block
                width: 14px
                height: 14px
                position: absolute
                left: 0
                top: 50%
                margin-top: -8px
                background: url(../../common/images/icons.png) no-repeat 0 0
              &.lv6:before
                background-position: -25px -125px
              &.lv5:before
                background-position: -25px -100px
              &.lv4:before
                background-position: -25px -75px
              &.lv3:before
                background-position: -25px -50px
              &.lv2:before
                background-position: -25px -25px
              &.lv1:before
                background-position: -25px 0
              &.lv0:before
                background-position: 0 -175px
            .svip
              padding: 2px 8px 2px 16px
              margin-left: 8px
              &.lv1:before
                background-position: 0 0
              &.lv2:before
                background-position: 0 -25px
              &.lv3:before
                background-position: 0 -50px
              &.lv4:before
                background-position: 0 -75px
              &.lv5:before
                background-position: 0 -100px
              &.lv6:before
                background-position: 0 -125px
              &.lv7:before
                background-position: 0 -150px
        .setting
          margin-left: 10px
          color: rgba(76,0,0,.7)
          a
            color: rgba(76,0,0,.7)
          img
            width: 12px
            height: 12px
            margin-right: 3px
            vertical-align: middle
          span
            vertical-align: middle
  .order-wrapper, .wallet-wrapper
    position: relative
    width: 100%
    .title
      padding: 0 10px
      height: 40px
      line-height: 40px
      font-size: 14px
      border-1px(rgba(7, 17, 27, 0.1))
      box-sizing: border-box
      >a i
        padding-right: 3px
      .more
        float: right
        font-size: 12px
        span
          vertical-align: middle
        i
          vertical-align: middle
          font-size: 18px
    .itemList
      display: flex
      width: 100%
      height: 100%
      padding: 10px 0
      .item
        flex: 1
        font-size: 14px
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border-right: none
        .icon
          font-size: 22px
          line-height: 1
        .amount
          font-size: 22px
          color: rgb(255, 95, 62)
          line-height: 1 
          margin-bottom: 2px       
        .text
          padding-top: 5px
          line-height: 1
          font-size: 12px
  .other-wrapper, .invite-wrapper
    position: relative
    width: 100%
    .title
      padding: 0 10px
      height: 40px
      line-height: 40px
      font-size: 14px
      color: #7e8c8d
      border-1px(rgba(7, 17, 27, 0.1))
      box-sizing: border-box
      i
        padding-right: 3px
    .otherList, .item-list
      position: relative
      width: 100%
      padding-bottom: 10px
      .item
        display: block
        font-size: 14px
        padding: 10px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        &.highlight
          >i, .text
            color: #ff463c
        >i
          font-size: 18px
          padding-right: 3px
          vertical-align: middle
        .text
          vertical-align: middle
        .more
          float: right
          font-size: 18px
    .item-list
      padding-bottom: 2px
    .otherList
      padding-bottom: 20px
</style>

