<template>
  <div class="main-wrapper">
    <fixedheader title="首单特惠" right-icon="icon-more"></fixedheader>
    <div class="product-wrapper">
      <div class="productlist" ref="productWrapper">
        <mu-flexbox wrap="wrap" justify="space-around" :gutter="0">
          <mu-flexbox-item basis="50%" class="product-item" :key="index" v-for="(product, index) in products">
            <div class="product-thumbnail">
              <router-link :to="{name: 'firstdetail', params: {id: product.id}}"><img :src="getThumbnail(product)" /></router-link>
            </div>
            <div class="product-info">
              <div class="product-title" @click.stop.prevent="goGoodDetail(product)">{{fillName(product.name)}}</div>
              <div class="sellpoint" v-if="product.sellPoint">{{product.sellPoint}}</div>
              <div class="product-price"><div class="num">{{product.buttomFee | currency}}</div><del class="salesCount" v-if="product.fieldPrice">{{product.fieldPrice | currency}}</del></div>
            </div>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
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
      this.show();
      this.fetchData(true);
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.productWrapper;
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
          type: 3
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
        this.loadEnd = false;
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
        this.$router.push({name: 'firstdetail', params: {id: item.id}});
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
      gotop, fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .product-wrapper
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      width: 100%
      padding: 0 0 10px 5px
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      .mu-flexbox
        display: block
      .no-more
        width: 100%
        padding: 10px 0
        color: #999
        text-align: center
        font-size: 12px
      .product-item
        width: 50%
        float: left
        padding-bottom: 10px
        box-sizing: border-box
        .product-thumbnail
          position: relative
          width: 100%
          min-height: 102px
          overflow: hidden
          a
            display: inline-block
            width: 100%
            overflow: hidden
            img
              width: 48vw
              vertical-align: top
              overflow: hidden
        .product-info
          position: relative
          width: 100%
          padding: 0 3px
          box-sizing: border-box
        .product-title
          overflow: hidden
          display: -webkit-box
          font-size: 14px
          height: 20px
          line-height: 1.5
          word-wrap: break-word
          word-break: break-all
          text-overflow: ellipsis
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
        .sellpoint
          display: block
          font-size: 12px
          color: #7f7f7f
          padding: 2px 0 3px
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
        .product-price
          position: relative
          font-size: 14px
          font-weight: 700
          color: #ff463c
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: bottom
          .salesCount
            display: block
            color: #999
            font-size: 11px
            margin-left: 6px
            float: left
            margin-top: 1.5px
          .num
            display: block
            float: left
            bottom: 0
        .icon
          position: absolute
          top: 50%
          margin-top: -20px
          right: 0
          width: 40px
          height: 40px
          line-height: 40px
          text-align: center
          font-size: 20px
          box-sizing: border-box
          .icon-favorite
            color: #ff463c
</style>
