<template>
  <div class="main-wrapper">
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">
        <div class="search-form-box">
          <i class="icon-search"></i>
          <div class="search-form-input">
            <form action="" v-on:submit.stop.prevent="search">
              <input type="search" name="txtSearch" class="txtSearch" placeholder="搜索所有商品" autocomplete="off" v-model="keyword" @keyup.delete.stop.prevent="changeText">
            </form>
          </div>
          <!-- <i class="removeText" v-show="keyword" @click.stop.prevent="clearText"></i> -->
        </div>
      </div>
      <div class="right"><span @click.stop.prevent="search">搜索</span><span @click.stop.prevent="showSidebar">筛选</span></div>
    </div>
    <div class="sortbar-wrapper">
      <div class="sortbar-item" :class="{'active': sort === 'scoreSort'}" @click.stop.prevent="fireSort('scoreSort')">专业评分</div>
      <div class="sortbar-item" :class="{'active': sort === 'saleSort'}" @click.stop.prevent="fireSort('saleSort')">销量</div>
      <div class="sortbar-item" :class="{'active': sort === 'priceSort'}" @click.stop.prevent="fireSort('priceSort')"><span class="sort">价格<i class="arrow_up" :class="{'on': priceSort === '2'}"></i><i class="arrow_down" :class="{'on': priceSort === '1'}"></i></span></div>
      <div class="sortbar-item" :class="{'active': sort === 'commentSort'}" @click.stop.prevent="fireSort('commentSort')">上架时间</div>
    </div>
    <div class="product-wrapper">
      <div class="productlist" ref="productWrapper">
        <mu-flexbox wrap="wrap" justify="space-around" :gutter="0">
          <mu-flexbox-item basis="50%" class="product-item" :key="index" v-for="(product, index) in products">
            <div class="product-thumbnail">
              <router-link :to="{name: 'good', params: {id: product.id}}"><img :src="getThumbnail(product)" /></router-link>
            </div>
            <div class="product-info">
              <div class="product-title"><router-link :to="{name: 'good', params: {id: product.id}}">{{product.name}}</router-link></div>
              <div class="product-price">¥<span class="num">{{product.price}}</span></div>
            </div>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
      </div>
    </div>
    <sidebar ref="sidebar" @fireAction="search"></sidebar>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import sidebar from '@/components/search/sidebar';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';

  export default {
    data() {
      return {
        keyword: '',
        products: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        scrollY: 0,
        lastExec: +new Date(),
        params: {
          artworkTypeName: 'tea',
          categoryName: ''
        },
        sort: 'saleSort',
        priceSort: ''
      };
    },
    activated() {
      this.show();
      this._reset();
      this.keyword = this.$route.query.key || '';
      let parentCategory = this.$route.query.parentCat;
      if (parentCategory) {
        this.params.categoryParentName = parentCategory || '';
      } else {
        this.params.categoryName = this.$route.query.cat || '';
      }
      let searchKeyword = this.$route.query.keyword;
      if (searchKeyword) {
        this.params.keyword = searchKeyword;
        this.keyword = searchKeyword;
      } else {
        this.params.keyword = '';
      }
      this.params.yearName = '';
      this.params.cfName = '';
      this.params.qualityName = '';
      let ck = this.$route.query.ck;
      let cv = this.$route.query.cv;
      if (ck && cv) {
        this.params[ck] = cv;
      }
      this.fetchData(true);
    },
    deactivated() {
      this.$refs.sidebar.reset();
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
        this.params.currentPage = this.pageNumber;
        this.params.pageSize = this.pageSize;
        api.GetGoods(this.params).then((response) => {
          let goods = response.artworks;
          if (goods && goods.length) {
            goods.forEach(item => {
              this.products.push(item);
            });
          }
          this.totalPages = response.totalPages;
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
        this.params.categoryName = '';
        this.params.yearName = '';
        this.params.cfName = '';
        this.params.qualityName = '';
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      showSidebar() {
        this.$store.commit('SHOW_SIDEBAR');
      },
      changeText() {
        if (!this.keyword.length) {
          this.$refs.sidebar.clearForm();
        }
      },
      getThumbnail(item) {
        let pic = item.pictures;
        if (pic && pic.length) {
          return api.CONFIG.psCtx + pic[0].id + '?w=228&h=128';
        } else {
          return api.CONFIG.defaultImg;
        }
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
      search() {
        this._reset();
        let form = this.$refs.sidebar.getFormValue();
        this.params.categoryName = form.categoryName || '';
        this.params.price = form.price || '';
        this.params.shelfTime = form.shelfTime || '0';
        this.params.categoryParentName = form.categoryParentName || '';
        if (this.keyword) {
          this.params.keyword = this.keyword;
        } else {
          this.params.keyword = '';
        }
        let kw = '';
        if (form.keyword) {
          kw = form.keyword;
        } else if (form.parentKeyword) {
          kw = form.parentKeyword;
        }
        if (kw) {
          this.keyword = kw;
          this.params.keyword = '';
        }
        this.fetchData(true);
      },
      fireSort(sortKey) {
        this.sort = sortKey;
        let sortKeys = ['saleSort', 'scoreSort', 'commentSort', 'priceSort'];
        if (sortKey === 'priceSort') {
          if (!this.priceSort || this.priceSort === '1') {
            this.priceSort = '2';
          } else {
            this.priceSort = '1';
          }
        } else {
          this.priceSort = '';
        }
        for (let i = 0; i < sortKeys.length; i++) {
          if (sortKeys[i] !== sortKey) {
            delete this.params[sortKeys[i]];
          }
        }
        this.params[sortKey] = this.priceSort || true;
        this._reset();
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
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      sidebar, gotop
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
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 5px 0 10px
      .search-form-box
        position: relative
        height: 44px
        overflow: hidden
        background: #fafafa
        .icon-search
          position: relative
          display: inline-block
          width: 12px
          height: 12px
          top: 16px
          left: 6px
          float: left
          color: #d5d4d4
        .search-form-input
          display: inline-block
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          .txtSearch
            display: inline-block
            background: 0
            border: 0
            width: 100%
            line-height: 16px
            height: 16px
            vertical-align: middle
            font-size: 14px
            color: #666
            padding: 0 28px
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
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      width: 100%
      padding: 10px 0
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      .mu-flexbox
        display: block
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
      .product-item
        width: 50%
        float: left
        padding: 0 5px 10px 5px
        box-sizing: border-box
        .product-thumbnail
          position: relative
          background: #f2f2f7
          img
            width: 100%
            height: auto
            vertical-align: top
        .product-title
          overflow: hidden
          display: -webkit-box
          color: #666
          font-size: 14px
          height: 20px
          line-height: 20px
          white-space: normal
          word-break: break-all
          text-overflow: ellipsis
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
        .product-price
          margin-top: 2px
          font-size: 12px
          color: #e4393c
          .num
            font-size: 14px
            font-weight: 400
</style>
