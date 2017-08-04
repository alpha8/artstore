<template>
  <div>
    <fixedheader :title="getHeaderTitle"></fixedheader>
    <div class="coupon">
      <div class="coupon-wrap">
        <div class="coupon-container" ref="couponlist" v-show="coupons.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="coupon-list">
            <mu-flexbox-item basis="100%" class="coupon-item border-1px" v-for="(coupon, index) in coupons" :key="index">
              <div class="title" :class="{'expired': coupon.status !== 0}">
                <div class="box">
                  <p class="money">¥<span class="num">{{coupon.payValue}}</span></p>
                  <p class="message">{{getCouponType(coupon.type)}}</p>
                </div>
                <i class="tag"><span class="text">{{getCouponStatus(coupon.status)}}</span></i>
                <div class="dotbar"></div>
              </div>
              <div class="circle-tag circle-left"></div>
              <div class="circle-tag circle-right"></div>
              <div class="content">
                <p class="line text">{{coupon.payValue}}元{{getCouponType(coupon.type)}}</p>
                <p class="line">优惠券码：<strong>{{coupon.cNo}}</strong></p>
                <p class="line">使用期限：{{getCouponExpire(coupon.createAt)}} ~ {{getCouponExpire(coupon.termOfValidity)}}</p>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-coupon" v-show="coupons.length === 0">
          <img src="../../common/images/ticket.png" alt="">
          <p>啊哦，还没有相关记录哦</p>
        </div>
        <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';
  import {formatDate} from '@/common/js/date';

  export default {
    data() {
      return {
        coupons: [],
        couponTypes: ['现金券', '满额减'],
        couponStates: ['未使用', '已使用', '已过期'],
        pageNumber: 1,
        pageSize: 50,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
      };
    },
    computed: {
      getHeaderTitle() {
        return `我的优惠券(${this.coupons.length})`;
      }
    },
    activated() {
      this.fetchData(true);
    },
    deactivated() {
      this._reset();
    },
    mounted() {
      this.scroller = this.$refs.couponlist;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        let user = this.$store.getters.getUserInfo;
        api.getCoupons(user.userId || -1).then(response => {
          this.coupons = response;
          this.totalPages = 1;
          this.pageNumber++;
          this.lastExec = +new Date();
          this.loading = false;
          this.loadEnd = this.pageNumber > this.totalPages;
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      getCouponType(type) {
        return this.couponTypes[type];
      },
      getCouponStatus(status) {
        return this.couponStates[status];
      },
      getCouponExpire(times) {
        return formatDate(new Date(times), 'yyyy-MM-dd');
      },
      _reset() {
        this.coupons = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      loadMore() {
        this.fetchData();
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      fixedheader, gotop
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    top: 0
    width: 100%
    height: 44px
    overflow: hidden
    z-index: 2
  .coupon
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    .coupon-wrap
      position: relative
      width: 100%
      min-height: 100%
      background: #f5f5f5
      .btn-red
        background: #d05148
        color: #fff
      .btn-blue
        background: #3a77e7
        color: #fff
      .btn-green
        background: #44b549
        color: #fff
      .btn-orange
        background: #f19325
        color: #fff
      .btn-white
        background: #fff
        color: #333
        border: 1px solid #ddd
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
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
      .coupon-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .coupon-list
          position: relative
          width: 100%
          padding: 10px
          box-sizing: border-box
          .coupon-item
            position: relative
            display: flex
            height: 100px
            margin-bottom: 15px
            border-1px(rgba(7, 17, 27, 0.1))
            >.title
              position: relative
              flex: 30vw 0 0
              background: #00bb9c
              color: #fff
              height: 100%
              &.expired
                background: #ccc
                .tag .text
                  background-color: #747474
                  color: #fff
              .box
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%,-50%)
                box-sizing: border-box
                .money
                  font-size: 16px
                  .num
                    margin-left: 2px
                    font-size: 28px
                .message
                  text-align: center
                  font-size: 14px
                  margin-top: 3px
                  box-sizing: border-box
              .tag
                position: absolute
                top: 0
                left: 0
                width: 40px
                height: 40px
                overflow: hidden
                z-index: 1
                box-sizing: border-box
                .text
                  position: absolute
                  top: 6px
                  left: -16px
                  width: 60px
                  display: block
                  height: 16px
                  font-size: 10px
                  text-align: center
                  color: #000
                  transform: rotate(-45deg)
                  background-color: #fea019
                  &::before
                    content: ""
                    display: inline-block
                    vertical-align: middle
                    width: 0
                    height: 100%
                    margin-top: 1px
              .dotbar
                position: relative
                float: right
                left: .125rem
                width: .25rem
                height: 100%
                background-image: url(../../common/images/shape.png)
                background-size: cover
            .circle-tag
              position: absolute
              display: block
              background: #f5f5f5
              width: .9375rem
              height: .9375rem
              content: ''
              border-radius: 50%
              top: 43%
              &.circle-left
                left: -8px
              &.circle-right
                right: -8px
            .content
              flex: 1
              background: #fff
              height: 100%
              padding: 1.34375rem 1rem
              box-sizing: border-box
              overflow: hidden
              .line
                color: #999
                font-size: 12px
                line-height: 1.8
                text-overflow: ellipsis
                white-space: nowrap
                overflow: hidden
                strong
                  font-weight: 700
                &.text
                  margin-bottom: 10px
                  color: #666
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 2
                  font-weight: 700
                  font-size: .875rem
                  line-height: 1.0625rem
      .no-coupon
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        img
          width: 110px
          height: 110px
</style>
