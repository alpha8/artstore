<template>
  <div>
    <fixedheader title="我的优惠券"></fixedheader>
    <div class="coupon">
      <div class="coupon-wrap">
        <div class="coupon-container" ref="couponlist" v-show="coupons.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="coupon-list">
            <mu-flexbox-item basis="100%" class="coupon-item border-1px" v-for="(coupon, index) in coupons" :key="index">
              <div class="title">
                <div class="box">
                  <p class="money">¥<span class="num">{{coupon.money}}</span></p>
                  <p class="message">{{coupon.type}}</p>
                </div>
                <div class="dotbar"></div>
              </div>
              <div class="circle-tag circle-left"></div>
              <div class="circle-tag circle-right"></div>
              <div class="content">
                <p class="line text">{{coupon.text}}</p>
                <p class="line">适用平台：{{coupon.fitType}}</p>
                <p class="line">有效期至：{{coupon.expires}}</p>
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
  // import api from '@/api/api';

  export default {
    data() {
      return {
        coupons: [
          {id: 1, type: '现金券', money: 50, text: '50元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
          {id: 2, type: '现金券', money: 100, text: '100元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
          {id: 3, type: '现金券', money: 200, text: '200元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
          {id: 4, type: '现金券', money: 500, text: '500元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'}
        ],
        pageNumber: 1,
        pageSize: 5,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
      };
    },
    activated() {
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      // this._reset();
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
        if (this.totalPages && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        /*
        this.loading = true;
        setTimeout(() => {
          let coupons = [
            {id: 1, type: '现金券', money: 50, text: '50元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
            {id: 2, type: '现金券', money: 100, text: '100元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
            {id: 3, type: '现金券', money: 200, text: '200元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'},
            {id: 4, type: '现金券', money: 500, text: '500元现金券(可累加使用)', fitType: '全平台', expires: '2018-7-30'}
          ];
          coupons.forEach(coupon => {
            this.coupons.push(coupon);
          });
          this.totalPages = 3;
          this.pageNumber++;
          this.lastExec = +new Date();
          this.loading = false;
          this.loadEnd = this.pageNumber > this.totalPages;
        }, 1000);
        */
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
      back() {
        this.$router.back();
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
    bottom: 0
    width: 100%
    .coupon-wrap
      position: relative
      width: 100%
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
