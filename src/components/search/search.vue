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
              <input type="search" name="txtSearch" class="txtSearch" placeholder="搜索所有商品" autocomplete="off" v-model="keyword" @keyup.delete.stop.prevent="changeText">
            </form>
          </div>
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
              <div class="product-title" @click.stop.prevent="goGoodDetail(product)">{{product.name}}</div>
              <div class="sellpoint" v-if="product.sellPoint">{{product.sellPoint}}</div>
              <div class="product-price"><div class="num">{{product.price | currency}}</div><div class="salesCount">(已售:{{product.stock && product.stock.salesCount || 0}}件)</div></div>
              <div class="icon" @click.stop.prevent="mark(product)"><i :class="favorited(product)"></i></div>
            </div>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;千款精品库每周上新，敬请饱览美物&nbsp;&nbsp;———</div>
      </div>
    </div>
    <sidebar ref="sidebar" @fireAction="search" @fireReset="clearSearch"></sidebar>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
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
        sort: '',
        priceSort: ''
      };
    },
    activated() {
      this.show();
      this._reset();
      this.keyword = this.$route.query.key || '';
      let parentCategory = this.$route.query.parentCat;
      let cat = this.$route.query.cat;
      let sunCat = this.$route.query.sunCat;
      let lv1 = this.$route.query.lv1;
      let lv2 = this.$route.query.lv2;
      if (parentCategory) {
        this.params.categoryParentName = parentCategory || '';
      } else if (cat) {
        this.params.categoryName = this.$route.query.cat || '';
      } else if (lv1 !== 'brand' && sunCat) {
        this.params.categorychildrenName = sunCat || '';
      }
      if (lv1 === 'brand') {
        this.params.brandType = lv2 || '';
        this.params.brandName = sunCat || '';
      } else {
        this.params.brandType = '';
        this.params.brandName = '';
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
      let price = this.$route.query.price;
      if (price) {
        this.params.price = price;
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
        this.params.commodityStatesId = 2;
        if (!this.sort) {
          this.params.scoreSort = true;
          this.sort = 'scoreSort';
        }
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
        this.params.yearName = '';
        this.params.cfName = '';
        this.params.qualityName = '';
        this.params.categoryName = '';
        this.params.categoryParentName = '';
        this.params.categorychildrenName = '';
        this.params.brandType = '';
        this.params.brandName = '';
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
          let icon = pic[0];
          if (icon && icon.width < icon.height || icon.height / icon.width <= 1) {
            return api.CONFIG.psCtx + icon.id + '?w=750&h=500&v=v2';
          }
          return api.CONFIG.psCtx + icon.id + '?w=750&h=500';
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
      search(clear) {
        this._reset();
        let form = this.$refs.sidebar.getFormValue();
        this.params.categoryName = form.categoryName || '';
        this.params.price = form.price || '';
        if (form.minPrice || form.maxPrice) {
          this.params.price = `${form.minPrice || 0}-${form.maxPrice || ''}`;
        }
        this.params.shelfTime = form.shelfTime || '0';
        this.params.categoryParentName = form.categoryParentName || '';
        if (this.keyword) {
          this.params.keyword = this.keyword;
          this.$store.dispatch('addSearchHistory', this.keyword);
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
        if (!clear && !this.params.categoryName && !this.params.categoryParentName && !this.params.categorychildrenName) {
          let parentCategory = this.$route.query.parentCat;
          let cat = this.$route.query.cat;
          let sunCat = this.$route.query.sunCat;
          if (parentCategory) {
            this.params.categoryParentName = parentCategory || '';
          } else if (cat) {
            this.params.categoryName = this.$route.query.cat || '';
          } else if (sunCat) {
            this.params.categorychildrenName = this.$route.query.sunCat || '';
          }
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
        this.products = [];
        this.pageNumber = 1;
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
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      favorited(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        let ids = good.collected || [];
        let flag = false;
        for (let i = 0, len = ids.length; i < len; i++) {
          if (uid === ids[i]) {
            flag = true;
          }
        }
        if (typeof good.marked === 'undefined') {
          Vue.set(good, 'marked', false);
        }
        if (flag) {
          good.marked = true;
          return 'icon-favorite';
        } else {
          good.marked = false;
          return 'icon-heart';
        }
      },
      mark(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        let params = {
          userId: uid,
          type: 1,
          artworkId: good.id,
          price: good.price,
          name: good.name,
          icons: good.pictures,
          fromCart: false
        };
        if (good.marked) {
          delete params.name;
          delete params.icons;
          delete params.price;
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              good.collected = [];
              good.marked = false;
              this.favorited(good);
            }
          });
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (good.collected) {
              good.collected.push(uid);
            } else {
              good.collected = [uid];
            }
            good.marked = true;
            this.favorited(good);
          }
        });
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
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      width: 100%
      padding: 10px 0 10px 5px
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
          padding-right: 40px
          padding-left: 3px
          min-height: 51px
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
