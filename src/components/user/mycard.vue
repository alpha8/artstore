<template>
  <div>
    <fixedheader title="我的卡券"></fixedheader>
    <div class="coupon">
      <div class="coupon-wrap">
        <div class="coupon-container" ref="couponlist" v-show="coupons.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="coupon-list">
            <mu-flexbox-item basis="100%" class="coupon-item border-1px" v-for="(coupon, index) in coupons" :key="index">
              <div class="title" :class="{'expired': coupon.status == 3 || coupon.status == 5}">
                <div class="box">
                  <p class="money" v-if="coupon.type === 1">¥<span class="num">{{coupon.score}}</span></p>
                  <p class="money" v-else>{{coupon.total || 0}}选1</span></p>
                  <p class="message">{{getCouponType(coupon.type)}}</p>
                </div>
                <i class="tag"><span class="text">{{getCouponStatus(coupon.status)}}</span></i>
                <div class="dotbar"></div>
              </div>
              <div class="circle-tag circle-left"></div>
              <div class="circle-tag circle-right"></div>
              <div class="content">
                <p class="line text" v-if="coupon.title">{{coupon.title}}</p>
                <p class="line" v-if="coupon.cardNo">卡号：{{coupon.cardNo}}</p>
                <p class="line">有效期：{{getCouponExpire(coupon.expireTimes)}}</p>
                <div class="fastOps" v-if="coupon.type == 1 && (coupon.status == 2 || coupon.status == 4)" @click="exchangeScore(coupon)">立即充值</div>
                <div class="fastOps" v-else-if="coupon.type == 2 && (coupon.status == 2 || coupon.status == 4)" @click="exchangeGoods(coupon)">立即兑换</div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <div class="no-more">—————————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;—————————</div>
        </div>
        <div class="no-coupon" v-show="coupons.length === 0">
          <img src="../../common/images/ticket.png" alt="">
          <p>啊哦，还没有相关记录哦</p>
        </div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
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
        couponTypes: ['', '积分卡', '兑换卡'],
        couponStates: ['', '未激活', '已激活', '已兑换', '已绑定', '已过期', '已删除'],
        loading: false,
        scrollY: 0
      };
    },
    activated() {
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.couponlist;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        this.loading = true;
        api.getMyCards().then(response => {
          this.coupons = response.data;
          this.loading = false;
        }).catch(response => {
          this.loading = false;
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
      exchangeScore(item) {
        api.exchangeCard({
          cardNo: item.cardNo || '',
          code: item.code || ''
        }).then(response => {
          if (response.code == 200) {
            this.$message.success(response.message);
            item.status = 3;
          } else {
           this.$message.error(response.message);
          }
        });
      },
      exchangeGoods(item) {
        this.$router.push({name: 'carddetail', params: {id: item.id}});
      },
      _reset() {
        this.coupons = [];
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
        margin-top: 10px
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
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              margin-bottom: 0
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
                text-align: center
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
                  min-width: 60px
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
              z-index: 10
              &.circle-left
                left: -8px
              &.circle-right
                right: -8px
            .content
              position: relative
              flex: 1
              background: #fff
              height: 100%
              padding: 8px
              box-sizing: border-box
              overflow: hidden
              .fastOps
                position: absolute
                font-size: 12px
                display: inline-block
                right: 15px
                top: 50%
                margin-top: -14px
                padding: 0 8px
                height: 28px
                line-height: 28px
                border-radius: 6px
                background: rgba(250,180,90,0.93)
                color: #fff
                text-align: center
                box-sizing: border-box
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
                  /*! autoprefixer: off */
                  -webkit-box-orient:vertical
                  /*! autoprefixer: on */
                  line-height: 1            
      .no-coupon
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
</style>
