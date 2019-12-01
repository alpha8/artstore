<template>
  <div>
    <fixedheader title="购物先领券，优惠看得见" ref="header"></fixedheader>
    <div class="coupon" ref="coupon">
      <div class="coupon-wrap">
        <div class="coupon-container" ref="couponlist" v-if="coupons.length">
          <div class="coupon-list">
            <div class="coupon-item" v-for="(coupon, index) in coupons" :key="coupon.id">
              <div class="item-content" :class="{'expired': isTaken(coupon)}">
                <div class="title">
                  <div class="box">
                    <p class="money">¥<span class="num">{{coupon.amount || 0}}</span></p>
                  </div>
                  <i class="tag" v-if="isTaken(coupon)"><span class="text">已领取</span></i>
                  <div class="dotbar"></div>
                </div>
                <div class="circle-tag circle-left"></div>
                <div class="circle-tag circle-right"></div>
                <div class="content">
                  <p class="line text">{{getCouponName(coupon)}}</p>
                  <p class="line">{{platformType[coupon.platform]}}</p>
                  <p class="line">{{getCouponExpire(coupon.startTimes)}} ~ {{getCouponExpire(coupon.endTimes)}}</p>
                  <span class="fastDeposit" @click.stop.prevent="takeIt(coupon)" v-if="!isTaken(coupon)">立即领取</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-coupon" v-else>
          <img src="../../common/images/ticket.png" alt="">
          <p>等着急吧，小二正在争取多发点优惠券！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';
  import {formatDate} from '@/common/js/date';

  export default {
    data() {
      return {
        coupons: [],
        couponTypes: ['全场通用', '特定分类', '特定商品'],
        platformType: ['全平台', '移动平台', '限平台'],
        takedCoupons: []
      };
    },
    activated() {
      this.$store.commit('HIDE_FOOTER');
      this.fetchData();
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
      this.coupons = [];
      this.count = 0;
    },
    methods: {
      fetchData() {
        if (this.$store.getters.userId) {
          api.getCoupons().then(response => {
            if (response.code == 200) {
              this.takedCoupons = response.data || [];
            }
          });
        }
        api.getAllCoupons().then(response => {
          if (response.code == 200) {
            this.coupons = response.data || [];
          }
        });
      },
      isTaken(coupon) {
        if (!coupon) {
          return false;
        }
        if (coupon.taked) {
          return true;
        }
        this.takedCoupons.map(item => {
          if (item.couponId == coupon.id) {
            this.$set(coupon, 'taked', true);
          }
        });
        return coupon.taked;
      },
      getCouponName(coupon) {
        if (!coupon) {
          return;
        }
        var type = '';
        var minPoint = '';
        if (coupon.useType) {
          type = this.couponTypes[coupon.useType] || '';
        }
        if (coupon.minPoint) {
          minPoint = `满${coupon.minPoint}元可用`;
        }
        if (type || minPoint) {
          return `${coupon.name}（${type} ${minPoint}）`;
        }
        return `${coupon.name}`;
      },
      getCouponType(type) {
        return this.couponTypes[type];
      },
      getCouponExpire(times) {
        if (!times) {
          return '';
        }
        return formatDate(new Date(times), 'yyyy-MM-dd');
      },
      takeIt(coupon) {
        if (!this.$store.getters.userId) {
          this.$router.push({name: 'login', query: {redirect: encodeURI(location.href)}});
          return;
        }
        api.takeCoupon(coupon.id).then(response => {
          this.$set(coupon, 'taked', true);
          if (response.code == 200) {
            this.$store.dispatch('openToast', '领取成功！');
          } else {
            this.$store.dispatch('openToast', response.message || '领取失败！');
          }
        });
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
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
        height: 100vh
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        padding-bottom: 60px
        background: #f5f5f5
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
                margin-top: -6px
                width: 100%
                float: left
                font-size: 20px
                text-align: center
            .item-content
              position: relative
              flex: 1
              color: #53c7ca
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
                .title
                  background: #ccc
                .tag .text
                  background-color: #747474
                  color: #fff
            .title
              position: relative
              float: left
              display: block
              width: 110px
              color: #fff
              background: #c9a86d
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
                &.text
                  margin-bottom: 10px
                  color: #666
                  font-size: 14px
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  /*! autoprefixer: off */
                  -webkit-box-orient:vertical
                  /*! autoprefixer: on */
                  height: 36px
                  line-height: 18px
              .fastDeposit
                position: absolute
                display: inline-block
                right: 15px
                bottom: 10px
                width: 75px
                height: 28px
                line-height: 28px
                background: #d05148
                color: #fff
                font-size: 13px
                border-radius: 8px
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
