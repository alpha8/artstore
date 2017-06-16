<template>
  <div>
    <fixedheader title="商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <img :src="good.image" alt="">
          <!-- <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div> -->
        </div>
        <div class="content">
          <h1 class="title">{{good.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{good.sellCount}}份</span>
          </div>
          <div class="price">
            <span class="now">￥{{good.price}}</span><span class="old" v-show="good.oldPrice">￥{{good.oldPrice}}</span>
          </div>          
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addGood" :good="good"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!good.count || good.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="good.info"></split>
        <div class="info" v-show="good.info">
          <h1 class="title">商品信息</h1>
          <div class="text">{{good.info}}</div>
        </div>
        <split></split>  
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="good.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="good.ratings && good.ratings.length">
              <li class="rating-item border-1px" v-for="rating in good.ratings" v-show="needShow(rating.rateType, rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" alt="" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!good.ratings || !good.ratings.length">暂无评论</div>
          </div>
        </div>      
      </div>
      <fixedcart ref="shopcart" @add="addToCart"></fixedcart>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '@/common/js/date';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedcart from '@/components/fixedtoolbar/fixedcart';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;
  const ERR_OK = 0;

  export default {
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.hide();
    },
    data() {
      return {
        good: {},
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        },
        addedProducts: this.$store.getters.addedProducts
      };
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        api.GetGood(id).then(response => {
          if (response.errno === ERR_OK) {
            let good = response.data;
            let sid = 'p' + good.id;
            var qty = this.addedProducts && this.addedProducts[sid];
            good.count = qty || 0;
            this.good = good;
            this.show();
            return;
          }
        });
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.good, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      back() {
        this.$router.back();
      },
      addFirst(event) {
        Vue.set(this.good, 'count', 1);
        this._drop(event.target);
        this.$store.commit('ADD_QUANTITY', this.good.id);
        this.$store.dispatch('addToCart', this.good);
      },
      addGood(target) {
        this._drop(target);
        this.$store.dispatch('addToCart', this.good);
      },
      addToCart() {
        if (!this.good.count) {
          Vue.set(this.good, 'count', 1);
        } else {
          this.good.count++;
        }
        this.$store.commit('ADD_QUANTITY', this.good.id);
        this.$store.dispatch('addToCart', this.good);
      },
      _drop(target) {
        // 优化体验，异步执行小球下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedcart, fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'

  .good
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    background: #fff
    overflow: hidden
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 10px
        border-radius: 50%
        background: rgba(7, 17, 27, 0.4)
        .icon-arrow_lift
          display: block
          padding: 6px 6px 6px 4px
          font-size: 18px
          color: #fafafa
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220)
        transition: all 0.2s
        &.fade-enter-active, &.fade-leave-active
          opacity: 1
        &.fade-enter, &.fade-leave-active
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        margin-left: 18px
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
