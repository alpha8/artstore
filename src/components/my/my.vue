<template>
  <div class="my" ref="my">
    <div class="my-wrapper">
      <div class="header-wrapper">
        <div class="box">
          <div class="box-container">
            <div class="avatar">
              <a v-show="!hasLogin" href="/wxservice/baseInfo"><img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10?w=80&h=80" alt="" class="pic"></a>
              <img :src="user.icon" alt="" class="pic" v-show="hasLogin">
            </div>
            <div class="line">
              <div class="userName" v-show="!hasLogin">未登录</div>
              <div class="userName" v-show="hasLogin">{{user.nickName}}</div>
              <div class="info" v-show="hasLogin"><span class="vip" :class="getVipIcon">{{getVipTitle}}</span></div>
            </div>
            <span class="setting" v-show="hasLogin"><img src="../../common/images/settings.png"/><span>账号管理</span></span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="order-wrapper">
        <div class="title">
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
        <div class="title">
          <router-link to="">
            <i class="icon-wallet"></i>我的钱包
            <!-- <span class="more"><i class="icon-keyboard_arrow_right"></i></span> -->
          </router-link>
        </div>
        <ul class="itemList">
          <li class="item border-1px" v-for="item in wallet">
            <router-link :to="item.link">
              <div class="amount">{{item.count}}</div>
              <div class="text">{{item.text}}</div>
            </router-link>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="other-wrapper">
        <div class="title">其他</div>
        <div class="otherList">
          <router-link :to="item.link" class="item" v-for="(item, index) in others" key="index" :class="{'highlight': item.highlight}">
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
  // import {removeCookie} from '@/common/js/store';

  export default {
    data() {
      return {
        user: this.$store.getters.getUserInfo,
        hasLogin: this.$store.getters.checkLogined,
        orders: [
          { icon: 'icon-pending_payment', text: '待付款', link: '/order?type=0' },
          { icon: 'icon-delivery_package_box', text: '待发货', link: '/order?type=1' },
          { icon: 'icon-truck', text: '待收货', link: '/order?type=2' },
          { icon: 'icon-refund_and_return', text: '退换货', link: '/order?type=6' }
        ],
        wallet: [
          { count: '0.00', text: '账户余额', link: '/balance' },
          { count: 5, text: '优惠券', link: '/coupon' }
        ],
        others: [
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
              alert('缓存清理成功！');
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
        ]
      };
    },
    activated() {
      this._initScroll();
    },
    computed: {
      getVipTitle() {
        return this.user.userId === 33 ? '金牌会员' : '普通会员';
      },
      getVipIcon() {
        return this.user.userId === 33 ? 'v4' : 'v1';
      }
    },
    methods: {
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
              &.v5:before
                background-position: -80px 0
              &.v4:before
                background-position: -60px 0
              &.v3:before
                background-position: -40px 0
              &.v2:before
                background-position: -20px 0
              &.v1:before
                background-position: 0 0

        .setting
          margin-left: 10px
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
      height: 50px
      line-height: 50px
      font-size: 14px
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
        .icon
          font-size: 22px
          line-height: 1
        .amount
          font-size: 18px
          line-height: 1 
          margin-bottom: 2px       
        .text
          line-height: 1
  .other-wrapper
    position: relative
    width: 100%
    .title
      padding: 0 10px
      height: 50px
      line-height: 50px
      font-size: 14px
      color: #7e8c8d
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
</style>

