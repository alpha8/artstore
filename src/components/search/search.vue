<template>
  <div class="main-wrapper">
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">
        <div class="search-form-box">
          <i class="icon-search2"></i>
          <div class="search-form-input">
            <form action="" v-on:submit.stop.prevent="search">
              <input type="search" name="txtSearch" class="txtSearch" placeholder="搜索所有商品" autocomplete="off" v-model="text" @keyup.delete.stop.prevent="changeText">
            </form>
          </div>
        </div>
      </div>
      <div class="right"><span @click.stop.prevent="search">搜索</span><!-- <span @click.stop.prevent="showSidebar">筛选</span> --></div>
    </div>
    <div class="sortbar-wrapper">
      <div class="sortbar-item" :class="{'active': !sort}" @click.stop.prevent="fireSort('')">综合</div>
      <div class="sortbar-item" :class="{'active': sort == 'sale'}" @click.stop.prevent="fireSort('sale')">销量</div>
      <div class="sortbar-item" :class="{'active': sort == 'price'}" @click.stop.prevent="fireSort('price')"><span class="sort">价格<i class="arrow_up" :class="{'on': !desc}"></i><i class="arrow_down" :class="{'on': desc}"></i></span></div>
      <div class="sortbar-item" :class="{'active': sort == 'time'}" @click.stop.prevent="fireSort('time')">上架时间</div>
    </div>
    <div class="product-wrapper">
      <div class="productlist" ref="productWrapper">
        <mu-flexbox wrap="wrap" justify="space-around" :gutter="0">
          <mu-flexbox-item basis="50%" class="product-item" :key="index" v-for="(product, index) in products">
            <div class="product-thumbnail">
              <router-link :to="{name: 'good', params: {id: product.id}}"><img :src="getThumbnail(product)" /></router-link>
            </div>
            <div class="product-info">
              <div class="product-title" @click.stop.prevent="goGoodDetail(product)">{{fillName(product.name)}}</div>
              <div class="product-price"><div class="num">{{product.memberPrice || product.price | currency}}</div><div class="salesCount">(已售:{{product.sale || 0}}件)</div></div>
            </div>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
        <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;千款精品库每周上新，敬请饱览美物&nbsp;&nbsp;———</div>
        <el-backtop target=".productlist" :bottom="55" :right="10"></el-backtop>
      </div>
    </div>
    <!-- <sidebar ref="sidebar" @fireAction="search" @fireReset="clearSearch"></sidebar> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  // import sidebar from '@/components/search/sidebar';
  import api from '@/api/api';

  export default {
    data() {
      return {
        products: [],
        pageNum: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        params: {
          keyword: ''
        },
        text: '',
        sort: '',
        desc: false
      };
    },
    activated() {
      this.show();
      this._reset();
      this.text = this.$route.query.key || '';
      this.params.keyword = this.$route.query.keyword || '';
      if (this.params.keyword) {
        this.text = this.params.keyword;
      }
      this.params.productCategoryId = this.$route.query.cid || '';
      this.params.parentCategoryId = this.$route.query.pid || '';
      this.params.brandId = this.$route.query.brand || '';
      this.scroller = this.$refs.productWrapper;
      this.fetchData(true);
    },
    deactivated() {
      this.hide();
      this.loadEnd = true;
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNum > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        this.params.pageNum = this.pageNum;
        this.params.pageSize = this.pageSize;
        api.GetGoods(this.params).then((response) => {
          if (response.code != 200) {
            return;
          }
          let goods = response.data.list || [];
          if (goods && goods.length) {
            goods.forEach(item => {
              this.products.push(item);
            });
          }
          this.totalPages = response.data.totalPage;
          this.pageNum++;
          this.lastExec = +new Date();
          this.loading = false;
          this.loadEnd = this.pageNum > this.totalPages;
        }).catch(response => {
          this.products = [];
          this.loadEnd = true;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      _reset() {
        this.params = {
          keyword: ''
        };
        this.text = '';
        this.products = [];
        this.pageNum = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      showSidebar() {
        this.$store.commit('SHOW_SIDEBAR');
      },
      changeText() {
        if (!this.keyword.length) {
          // this.$refs.sidebar.clearForm();
        }
      },
      fillName(name) {
        return name;
      },
      getThumbnail(item) {
        let pic = item.pic;
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      goGoodDetail(item) {
        this.$router.push({name: 'good', params: {id: item.id}});
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
        this.$store.commit('HIDE_SIDEBAR');
      },
      back() {
        this.$router.back();
      },
      clearSearch() {
        this.keyword = '';
        this.search(true);
      },
      search() {
        this._reset();
        this.params.keyword = this.text;
        this.fetchData(true);
      },
      fireSort(sortKey) {
        this.sort = sortKey;
        if (sortKey == 'price') {
          this.desc = !this.desc;
        } else if (sortKey == 'time') {
          this.desc = true;
        } else {
          this.desc = false;
        }
        this.params.sortBy = sortKey;
        this.params.desc = this.desc || false;
        this.products = [];
        this.pageNum = 1;
        this.totalPages = -1;
        this.loadEnd = false;
        this.fetchData(true);
      },
      clearText() {
        this.keyword = '';
        this.params.keyword = '';
        this._reset();
        this.fetchData(true);
      },
      loadMore() {
        this.fetchData();
      }
    },
    components: {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .header
    position: fixed
    display: flex
    padding-left: 8px
    padding-right: 5px
    top: 0
    width: 100%
    height: 44px
    line-height: 44px
    text-align: center
    color: #9B9B9B
    background: #f2f2f2
    box-sizing: border-box
    overflow: hidden
    z-index: 20
    .left
      flex: 30px 0 0
      margin-top: 2px
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 8px
      box-sizing: border-box
      .search-form-box
        position: relative
        height: 44px
        overflow: hidden
        background: #fafafa
        .icon-search2
          position: relative
          display: inline-block
          width: 13px
          height: 13px
          top: 50%
          left: 5px
          float: left
          color: #d5d4d4
          font-size: 13px
          margin-top: -6.5px
        .search-form-input
          display: inline-block
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          form
            position: relative
            height: 100%
          .txtSearch
            display: block
            background: 0
            width: 100%
            height: auto
            vertical-align: middle
            font-size: 14px
            color: #666
            padding: 14px 0 14px 22px
            box-sizing: border-box
        .removeText
          position: absolute
          top: 50%
          right: 3px
          width: 20px
          height: 20px
          margin-top: -10px
          background: url(../../common/images/close.png) no-repeat
          background-size: 20px auto
    .right
      flex: 0 0 90px
      font-size: 14px
      box-sizing: border-box
      span
        padding-right: 10px
        border-right: 1px solid rgba(7, 17, 27,0.1)
        box-sizing: border-box
        &:last-child
          padding-left: 10px
          padding-right: 0
          border-right: none
      i
        font-size: 18px
        color: #666
  .sortbar-wrapper
    border-1px(rgba(7, 17, 27, 0.1))
    position: fixed
    display: flex
    width: 100%
    height: 44px
    line-height: 44px
    top: 44px
    box-sizing: border-box
    background: #fff
    overflow: hidden
    z-index: 20
    .sortbar-item
      flex: 1
      position: relative
      font-size: 14px
      text-align: center
      height: 100%
      &.active
        color: #ff463c
      .sort
        position: relative
        display: inline-block
        padding-right: 14px
        .arrow_up, .arrow_down
          position: absolute
          display: inline-block
          right: 0
          width: 0
          height: 0
          font-size: 0
          line-height: 0
          border-color: transparent transparent #777f86 transparent
          border-width: 0 3px 3px
          border-style: solid
          vertical-align: middle
        .arrow_up
          top: 16px
          &.on
            border-color: transparent transparent #ff463c transparent
        .arrow_down
          border-color: #777f86 transparent transparent transparent
          border-width: 3px 3px 0
          bottom: 16px
          &.on
            border-color: #ff463c transparent transparent transparent
  .product-wrapper
    position: absolute
    top: 88px
    bottom: 0
    width: 100%
    background-color: #f0f2f5
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      width: 100%
      padding: 2px 0 6px
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
        box-sizing: border-box
        padding-bottom: 4px
        overflow: hidden
        &:nth-child(2n)
          padding-left: 2px
        &:nth-child(odd)
          padding-right: 2px
        .product-thumbnail
          position: relative
          width: 100%
          min-height: 102px
          overflow: hidden
          background-color: #fff
          a
            display: inline-block
            width: 100%
            overflow: hidden
            img
              width: 194px
              height: 194px
              vertical-align: top
              overflow: hidden
        .product-info
          position: relative
          width: 100%
          padding-left: 3px
          box-sizing: border-box
          background-color: #fff
          padding-bottom: 4px
          overflow: hidden
        .product-title
          line-height: 16px
          margin-bottom: 3px
          padding: 0 4px
          box-sizing: border-box
          height: 31px
          font-size: 13px
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          /*! autoprefixer: off */
          -webkit-box-orient:vertical
          /*! autoprefixer: on */
          word-break: break-word
        .product-price
          font-size: 16px
          font-weight: 700
          color: #ff463c
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: bottom
          padding: 0 4px
          height: 25px
          line-height: 25px
          .salesCount
            display: inline-block
            color: #999
            font-size: 11px
            margin-left: 6px
          .num
            display: inline-block
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
