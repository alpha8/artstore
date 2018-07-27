<template>
  <div>
    <fixedheader title="折扣券" ref="header"></fixedheader>
    <div class="coupon" ref="coupon">
      <div class="coupon-wrap">
        <div class="coupon-container" ref="couponlist" v-show="availCoupons.length">
          <div class="coupon-list">
            <div class="coupon-item" v-for="(coupon, index) in availCoupons" :key="index" @click.stop.prevent="toggle(coupon)">
              <div class="checkbox" :class="{'on': coupon.on}"><span class="icon icon-check_circle"></span></div>
              <div class="item-content" :class="{'expired': coupon.status !== 0}">
                <div class="title">
                  <div class="box">
                    <p class="money" v-if="coupon.type === 0">¥<span class="num">{{coupon.payValue}}</span></p>
                    <p class="money" v-else><span class="num">{{coupon.payValue * 10}}</span>折</p>
                  </div>
                  <i class="tag"><span class="text">{{getCouponType(coupon.type)}}</span></i>
                  <div class="dotbar"></div>
                </div>
                <div class="circle-tag circle-left"></div>
                <div class="circle-tag circle-right"></div>
                <div class="content">
                  <p class="line text" v-if="coupon.title">{{coupon.title}}</p>
                  <p class="line text" v-else>{{coupon.payValue}}元{{getCouponType(coupon.type)}}</p>
                  <p class="line">优惠券码：<strong>{{coupon.cNo}}</strong></p>
                  <p class="line">使用期限：{{getCouponExpire(coupon.createAt)}} ~ {{getCouponExpire(coupon.termOfValidity)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-coupon" v-show="availCoupons.length === 0">
          <img src="../../common/images/ticket.png" alt="">
          <p>啊哦，还没有相关记录哦</p>
        </div>
      </div>
    </div>
    <div class="fixed-foot">
      <div class="btns" @click.stop.prevent="ok"><span class="btn-red">确定<em v-if="count"> (已选{{count}}张)</em></span></div>
      <!-- <div class="content">
        <div class="content-center">
          <span class="totalPrice">已选<span>{{count}}</span>张</span>
        </div>
        <div class="content-right" @click.stop.prevent="ok">
          <div class="pay activated">确定</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';
  import {formatDate} from '@/common/js/date';

  export default {
    data() {
      return {
        coupons: [],
        couponTypes: ['现金券', '折扣券'],
        couponStates: ['未使用', '已使用', '已过期'],
        scroller: null,
        loading: false,
        scrollY: 0,
        count: 0,
        selectOne: true,
        usedDiscount: []
      };
    },
    activated() {
      this.$store.commit('HIDE_FOOTER');
      this.fetchData();
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
      this.coupons = [];
    },
    computed: {
      getUsedCount() {
        let used = this.$store.getters.loadUsedDiscount;
        return used && used.length || 0;
      },
      availCoupons() {
        return this.coupons && this.coupons.filter(o => {
          return o.status === 0;
        });
      }
    },
    methods: {
      fetchData() {
        let user = this.$store.getters.getUserInfo;
        let items = [];
        let goods = this.$store.getters.getPayGoods;
        goods.forEach(product => {
          items.push({'id': product.id, 'count': product.count});
        });
        api.getAvailCouponAmount({
          userId: user.userId || 0,
          products: items
        }).then(response => {
          this.coupons = response.otherCoupons || [];
          this._initCouponStatus(this.coupons);
          this._initScroll();
        }).catch(response => {
          console.log(response);
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.coupon, {
              click: true,
              bounce: false
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      toggle(item) {
        if (typeof item.on === 'undefined') {
          Vue.set(item, 'on', true);
        } else {
          item.on = !item.on;
        }
        if (this.selectOne) {
          this.usedDiscount.splice(0, this.usedDiscount.length);
        }
        if (item.on) {
          this.count++;
          this.usedDiscount.push(item);
        } else {
          this.count--;
        }
        if (this.selectOne) {
          let flag = false;
          this.coupons.forEach(o => {
            if (o.cid === item.cid && item.on) {
              flag = true;
            } else {
              o.on = false;
            }
          });
          if (flag) {
            this.count = 1;
          } else {
            this.count = 0;
          }
        }
        this.$store.dispatch('addUsedDiscount', this.usedDiscount);
      },
      _initCouponStatus(coupons) {
        this.count = 0;
        let used = this.$store.getters.loadUsedDiscount;
        if (used && used.length) {
          coupons.forEach(item => {
            if (typeof item.on === 'undefined') {
              Vue.set(item, 'on', false);
            }
            used.forEach(o => {
              if (item.cid === o.cid) {
                item.on = o.on || false;
              }
              if (this.selectOne && item.on) {
                this.count = 1;
              } else if (item.on) {
                this.count++;
              }
            });
          });
        }
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
      ok() {
        this.$router.back();
      }
    },
    components: {
      fixedheader, gotop
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .coupon
    position: absolute
    top: 44px
    bottom: 47px
    width: 100%
    .coupon-wrap
      position: relative
      width: 100%
      min-height: 100%
      background: #f5f5f5
      padding-bottom: 10px
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
        margin-bottom: 10px
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
          padding: 10px 10px 0 10px
          box-sizing: border-box
          .coupon-item
            position: relative
            display: flex
            height: 100px
            margin-bottom: 15px
            &:last-child
              margin-bottom: 0
            .checkbox
              position: relative
              height: 100px
              line-height: 100px
              width: 30px
              color: #999
              &.on
                color: #fb4741
              .icon
                position: absolute
                left: 0
                top: 50%
                margin-top: -15px
                width: 100%
                float: left
                font-size: 20px
                text-align: center
            .item-content
              position: relative
              flex: 1
              color: #53c7ca
              border-bottom: 10px solid #fff
              background: #fff
              overflow: hidden
              &::before
                content: ""
                position: absolute
                top: 4px
                bottom: 4px
                left: 10px
                right: 10px
                z-index: -1
              &.expired
                border-top: 6px solid #999
                border-bottom: 10px solid #ccc
                .tag .text
                  background-color: #747474
                  color: #fff
            .title
              position: relative
              float: left
              display: block
              width: 110px
              color: #fff
              background: #00bb9c
              height: 100%
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
              padding: 8px
              box-sizing: border-box
              overflow: hidden
              .line
                position: relative
                color: #999
                font-size: 12px
                line-height: 1.8
                text-overflow: ellipsis
                overflow: hidden
                strong
                  font-weight: 700
                &.text
                  margin-bottom: 10px
                  color: #666
                  font-weight: 700
                  font-size: 14px
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                  line-height: 1.3
                .fastDeposit
                  position: absolute
                  display: inline-block
                  right: 0
                  top: 0
                  width: 75px
                  height: 28px
                  line-height: 28px
                  background: #d05148
                  color: #fff
                  text-align: center
                  box-sizing: border-box
      .no-coupon
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
  .fixed-foot
    position: fixed
    bottom: 0
    width: 100%
    height: 47px
    overflow: hidden
    z-index: 2
    .btns
      margin: 0 auto
      height: 47px
      line-height: 47px
      font-size: 14px
      .btn-red
        color: #e1e1e1
        border-radius: 0
    .content
      display: flex
      font-size: 0
      text-align: center
      color: #666
      .content-left
        flex: 20vw 0 0
        .checkbox
          height: 100%
          font-size: 14px
          line-height: 50px  
          .icon
            display: inline-block
            vertical-align: top
            line-height: 50px
            font-size: 24px
            color: #d3d3d3
            padding-right: 3px
            &.on
              color: #FB4741
          .iconword
            display: inline-block
            vertical-align: top
            width: 28px
            line-height: 50px
          .text
            display: block
            line-height: 1
            font-size: 10px
      .content-center
        flex: 1
        text-align: right
        padding: 0 10px
        line-height: 50px
        .totalPrice
          display: block
          font-size: 16px
          .price
            color: #e4393c
        .button-wrapper
          width: 100%
          height: 100%
          .button
            display: inline-block
            float: right
            width: 28%
            height: 20px
            line-height: 20px
            padding: 10px 0
            font-size: 14px
            text-align: center
            margin-top: 5px
            margin-left: 10px
            color: #fff
            letter-spacing: 2px          
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 50px
          line-height: 50px
          font-size: 16px
          background: rgb(147, 153, 159)
          span
            font-size: 12px
            font-weight: 400
          &.disable
            cursor: default
            color: #fff
            background: rgb(147, 153, 159)
          &.activated
            background: #FB4741
            color: #fff
</style>
