<template>
  <div class="my" ref="my">
    <div class="my-wrapper">
      <div class="header-wrapper">
        <div class="avatar">
          <a v-show="!hasLogin" href="/wxservice/baseInfo"><img src="http://www.yihuyixi.com/ps/download/5951bed1e4b0e29e1a4086ca?w=80&h=80" alt="" class="pic"></a>
          <img :src="user.icon" alt="" class="pic" v-show="hasLogin">
        </div>
        <div class="line"><span class="text" v-show="!hasLogin">未登录</span><span class="text" v-show="hasLogin">{{user.nickName}}</span></div>
      </div>
      <split></split>
      <div class="order-wrapper">
        <div class="title">
          <router-link to="">
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
      <div class="other-wrapper">
        <div class="title">其他</div>
        <div class="otherList">
          <router-link :to="item.link" class="item" v-for="(item, index) in others" key="index" :class="{'highlight': item.highlight}">
            <i :class="item.icon"></i>
            <span class="text">{{item.text}}</span>
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

  export default {
    data() {
      return {
        user: this.$store.getters.getUserInfo,
        hasLogin: this.$store.getters.checkLogined,
        orders: [
          { icon: 'icon-pending_payment', text: '待付款', link: '' },
          { icon: 'icon-delivery_package_box', text: '待发货', link: '' },
          { icon: 'icon-truck', text: '待收货', link: '' },
          { icon: 'icon-refund_and_return', text: '退换货', link: '' }
        ],
        others: [
          { icon: 'icon-heart', text: '我的收藏', link: '' },
          { icon: 'icon-address', text: '收货地址', link: '/address' },
          { icon: 'icon-footprint', text: '浏览足迹', link: '' },
          { icon: 'icon-auction', text: '我的拍卖', link: '' },
          { icon: 'icon-quit', text: '退出登录', link: '', noPage: true, highlight: true }
        ]
      };
    },
    activated() {
      this._initScroll();
    },
    deactivated() {
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
    height: 155px
    background: #e45050
    color: #fff
    overflow: hidden
    box-sizing: border-box
    .avatar
      width: 80px
      height: 80px
      margin: 0 auto
      padding-top: 30px
      padding-bottom: 5px
      img
        width: 100%
        height: auto
        border-radius: 50%
    .line
      width: 100%
      padding: 5px 0
      text-align: center
      font-size: 14px  
  .order-wrapper
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
      width: 100%
      height: 100%
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

