<template>
  <div class="main-wrapper">
    <fixedheader title="砍价" right-icon="icon-more"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="groupbuy" v-show="products.length">
          <div class="rules-wrap">
            <div class="rule-title">“砍价” 简介：</div>
            <div class="rule-button" @click.stop.prevent="showDetail">规则</div>
            <div class="rule-flow">
              <div class="flow-item">
                <i class="icon-shopping_bag"></i>
                <div class="text">分享砍价商品</div>
              </div>
              <div class="flow-item">
                <i class="icon-dancers"></i>
                <div class="text">每个新访客浏览<br>您获得递减N元</div>
              </div>
              <div class="flow-item">
                <i class="icon-time_of_appointment"></i>
                <div class="text">48小时内付款</div>
              </div>
            </div>
          </div>
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" :key="index" v-for="(item, index) in products">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="goGoodDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="goGoodDetail(item)">{{reduceName(item.name)}}</h3>
                  <div class="sellpoint" v-if="item.sellPoint">{{item.sellPoint}}</div>
                  <div class="extra-wrap">
                    <div class="price-wrap">
                      <div class="countdowntips">&nbsp;</div>
                      <div class="price">
                        <span>{{item.buttomFee | currency}}</span>
                        <del>{{item.fieldPrice | currency}}</del>
                      </div>
                    </div>
                    <div class="more-ops">
                      <span class="btn-buy disabled" v-if="item.status === 3">已下架</span>
                      <span class="btn-buy disabled" v-else-if="item.stock <= 0 || item.status === 1">已售罄</span>
                      <span class="btn-buy" v-else-if="item.status === 0" @click.stop.prevent="goGoodDetail(item)">砍价</span>
                    </div>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-order" v-show="!products.length && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
    <rules ref="rules" title="砍价活动规则"></rules>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import rules from '@/components/sharepay/rules';
  import {reduceGoodsName} from '@/common/js/util';
  import api from '@/api/api';

  export default {
    data() {
      return {
        products: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        scrollY: 0,
        lastExec: +new Date()
      };
    },
    activated() {
      this.loadEnd = false;
      this.show();
      this.fetchData(true);
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.groupbuy;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        api.firstpayGoods({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          type: 1
        }).then((response) => {
          let goods = response.list;
          if (goods && goods.length) {
            goods.forEach(item => {
              this.products.push(item);
            });
          }
          this.totalPages = response.pages;
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
      _reset() {
        this.products = [];
        this.pageNumber = 1;
        this.totalPages = -1;
      },
      fillName(name) {
        name = name || '';
        return name.replace('[一虎一席]', '');
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=750&h=500&v=v2';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      goGoodDetail(item) {
        this.$router.push({name: 'sharedetail', params: {id: item.id}});
      },
      reduceName(name) {
        return reduceGoodsName(name);
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
      },
      showDetail() {
        this.$refs.rules.showDetail();
      }
    },
    components: {
      gotop, fixedheader, rules
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .order
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .order-wrap
      position: relative
      width: 100%
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
      .order-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        background-color: #fff
        .rules-wrap
          position: relative
          width: 100%
          background: #e45050
          padding-bottom: 15px
          .rule-title
            width: 100%
            font-size: 14px
            padding: 10px
            color: #eee
            box-sizing: border-box
          .rule-button
            width: 36px
            height: 30px
            line-height: 30px
            position: absolute
            top: 0
            right: 10px
            border-bottom-left-radius: 18px
            border-bottom-right-radius: 18px
            background: #e4c017
            color: #a17400
            font-size: 11px
            text-align: center
          .rule-flow
            position: relative
            display: flex
            .flow-item
              position: relative
              flex: 1
              text-align: center
              color: #eee
              &:not(:first-child)::after
                display: block
                position: absolute
                width: 50px
                height: 2px
                border-top: 1px dashed #eee
                top: 50%
                left: -25px
                margin-top: -10px
                content: ' '
              i
                display: block
                font-size: 36px
                padding: 10px 15px
              .text
                font-size: 14px
        .order-list
          position: relative
          width: 100%
          .order-item
            padding: 0 8px
            border-1px(rgba(7, 17, 27, 0.1))
            .item-content
              position: relative
              display: flex
              padding: 8px 0
              font-size: 12px
              .item-img
                display: inline-block
                width: 35%
                float: left
                img
                  width: 95%
                  margin-right: 10px
                  overflow: hidden
                  min-height: 68px
              .item-info
                flex: 1
                position: relative
                font-size: 14px
                color: #333
                >.title
                  position: relative
                  color: #000
                  padding-top: 5px
                  line-height: 1.2
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 1
                  -webkit-box-orient: vertical
                .sellpoint
                  display: block
                  font-size: 12px
                  color: #7f7f7f
                  margin-top: 2px
                  height: 17px
                  line-height: 17px
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 1
                  -webkit-box-orient: vertical
                .extra-wrap
                  position: absolute
                  display: flex
                  width: 100%
                  bottom: 2px
                .price-wrap
                  position: relative
                  display: block
                  float: left
                  width: auto
                  line-height: 1.3
                  .countdowntips
                    margin-top: 5px
                    font-size: 12px
                    color: #999
                  span
                    display: inline-block
                    padding-top: 3px
                    color: #e4393c
                    font-size: 14px
                    font-weight: 700
                  del
                    display: inline-block
                    color: #999
                    font-size: 12px
                .more-ops
                  position: relative
                  display: block
                  flex: 1
                  text-align: right
                  margin-right: 2px
                  .btn-buy
                    position: absolute
                    bottom: 0
                    right: 0
                    display: inline-block
                    padding: 0 6px
                    height: 25px
                    line-height: 25px
                    text-align: center
                    font-size: 11px
                    background: #e4393c
                    color: #fff
                    border-radius: 2px
                    min-width: 56px
                    box-sizing: border-box
                    &.disabled
                      background: #999
                    &.orange
                      background: rgba(250,180,90,0.93)
                      color: #fff
                    &.green
                      background: #44b549
                      color: #fff
                    &.darkred
                      background: #d05148
                      color: #fff
                    &.blue
                      background: #00a0dc
                      color: #fff
                  .items-reserve
                    display: block
                    position: relative
                    padding-top: 3px
                    text-align: right
                    font-size: 12px
                    color: #999
                    strong
                      font-weight: 400
                      font-size: 11px
                    .progress-bar
                      position: relative
                      display: inline-block
                      margin-top: -2px
                      margin-left: 1px
                      width: 56px
                      height: 6px
                      vertical-align: middle
                      backgrouns-size: 2px 2px
                      border-radius: 12px
                      overflow: hidden
                      &::after
                        position: absolute
                        content: ''
                        z-index: 1
                        background-color: #b9b8b8
                        background: none
                        border: 1px solid #999
                        top: 0
                        left: 0
                        right: -100%
                        bottom: -100%
                        border-radius: 12px
                        border-color: #999
                        -webkit-transform: scale(.5)
                        -webkit-transform-origin: 0 0
                        pointer-events: none
                      em
                        display: block
                        height: 6px
                        background-color: #b9b8b8
      .no-order
        position: relative
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
