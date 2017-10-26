<template>
  <div class="my" ref="my">
    <div class="my-wrapper">
      <div class="header-wrapper">
        <div class="box">
          <div class="box-container">
            <div class="avatar">
              <a v-show="!hasLogin()" href="/wxservice/baseInfo"><img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10?w=80&h=80" alt="" class="pic"></a>
              <img :src="user().icon" alt="" class="pic" v-show="hasLogin()">
            </div>
            <div class="line">
              <div class="userName" v-show="!hasLogin()"><a href="/wxservice/baseInfo">未登录</a></div>
              <div class="userName" v-show="hasLogin()">{{user().nickName}}<span class="supplier" v-if="userExt.model === 2">(代理商)</span></div>
              <div class="info" v-show="hasLogin()"><span class="vip" :class="getVipIcon">{{getVipTitle}}</span></div>
            </div>
            <span class="setting" v-show="hasLogin()"><router-link to="/personInfo"><img src="../../common/images/settings.png"/><span>账号管理</span></router-link></span>
          </div>
        </div>
      </div>
      <split></split>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import {mapGetters} from 'vuex';
  import {removeCookie} from '@/common/js/store';
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
          { amount: 0, text: '优惠券余额', link: '/coupon' }
        ],
        others: [
          { icon: 'icon-miaosha', text: '我的秒杀', link: '/myseckill' },
          { icon: 'icon-heart', text: '我的收藏', link: '/follow' },
          { icon: 'icon-footprint', text: '浏览足迹', link: '/footprint' },
          { icon: 'icon-address', text: '收货地址', link: '/address' },
          { icon: 'icon-auction', text: '我的拍卖', link: '' },
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
        userExt: {}
      };
    },
    activated() {
      this._initScroll();
    },
    created() {
      let user = this.$store.getters.getUserInfo;
      api.getUserProfile(user.userId || 0).then(response => {
        if (response.result === 0) {
          this.$store.dispatch('updateUserProfile', response);
          if (this.wallet.length >= 2) {
            this.wallet[0].amount = response.wallet && response.wallet.accountValue || 0;
            this.wallet[1].amount = response.wallet && response.wallet.totalValue || 0;
          }
          this.userExt = response.user || {};
        }
      });
    },
    computed: {
      getVipTitle() {
        let userLevel = {'lv0': '初级用户', 'lv1': 'VIP一钻', 'lv2': 'VIP二钻', 'lv3': 'VIP三钻', 'lv4': 'VIP四钻', 'lv5': 'VIP五钻'};
        let agentLevel = {'lv1': '皇冠一星', 'lv2': '皇冠二星', 'lv3': '皇冠三星', 'lv4': '皇冠四星', 'lv5': '皇冠五星'};
        let level = this.userExt.level;
        if (this.userExt.model === 1) {
          // 普通用户
          return userLevel[level];
        } else if (this.userExt.model === 2) {
          // 供应商
          return agentLevel[level];
        }
      },
      getVipIcon() {
        return this.userExt.level;
      }
    },
    methods: {
      ...mapGetters({
        hasLogin: 'checkLogined',
        user: 'getUserInfo'
      }),
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
      }
    },
    components: {
      fixedheader, split
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
            max-width: 100%
            font-size: 14px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            box-sizing: border-box
            a
              color: #fff
            .supplier
              font-size: 10px
              color: #fafafa
          .info
            margin-top: 10px
            .vip
              position: relative
              padding: 0 6px 0 10px
              height: 16px
              line-height: 16px
              margin: 0 3px 0 8px
              font-size: 10px
              color: #fff
              background: #9f3838
              border-radius: 12px
              &:before
                content: ""
                display: block
                width: 20px
                height: 20px
                position: absolute
                left: -10px
                top: 50%
                margin-top: -10px
                background: url(../../common/images/icon_vip.png) no-repeat 0 0
                background-size: 100px 20px
              &.lv5:before
                background-position: -80px 0
              &.lv4:before
                background-position: -60px 0
              &.lv3:before
                background-position: -40px 0
              &.lv2:before
                background-position: -20px 0
              &.lv1:before, &.lv0:before
                background-position: 0 0
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
          font-size: 18px
          line-height: 1 
          margin-bottom: 2px       
        .text
          padding-top: 5px
          line-height: 1
          font-size: 12px
  .other-wrapper
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
    .otherList
      position: relative
      width: 100%
      padding-bottom: 30px
      .item
        display: block
        font-size: 14px
        padding: 10px
        border-1px(rgba(7, 17, 27, 0.1))
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
</style>

