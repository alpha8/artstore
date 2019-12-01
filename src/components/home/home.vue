<template>
  <div class="home">
    <fixedsearch ref="search" :showFixed="showFixed"></fixedsearch>
    <search ref="advancedSearch"></search>
    <div class="main" ref="mainWrapper">
      <div class="mainContent">
        <div class="swipe-wrapper swipe-hook">
          <swipe :swiperSlides="homeData.advertiseList"></swipe>
        </div>
        <topchanel :channels="homeData.channelList"></topchanel>
        <!-- <split v-if="homeData.homeFlashPromotion.productList && homeData.homeFlashPromotion.productList.length"></split>
        <seckill :items="homeData.homeFlashPromotion.productList" :session="homeData.homeFlashPromotion.startTimes" v-if="homeData.homeFlashPromotion.productList && homeData.homeFlashPromotion.productList.length"></seckill>
        <split></split> -->
        <!-- <modal-title title="热销商品" moreText="更多" catName="热销商品"></modal-title>
        <channel :items="homeData.hotProductList" :cols="2"></channel>
        <split></split>
        <modal-title title="新品上市" moreText="更多" catName="新品上市"></modal-title>
        <channel :items="homeData.newProductList" :cols="2"></channel>
        <split></split>
        <brand :items="homeData.brandList" section="brandList"></brand>
        <split></split> -->
        <div v-for="item in homeData.floorList">
          <floor :category="item.category" :productList="item.products"></floor>
          <split v-if="item.products.length"></split>
        </div>
        <modal-title title="猜您喜欢" catName="猜您喜欢"></modal-title>
        <div class="product-wrapper">
          <div class="productlist" ref="productWrapper">
            <mu-flexbox wrap="wrap" justify="space-around" :gutter="0">
              <mu-flexbox-item basis="50%" class="product-item" :key="product.id" v-for="(product, index) in list">
                <div class="product-thumbnail">
                  <router-link :to="{name: 'good', params: {id: product.id}}"><img :src="getThumbnail(product)" /></router-link>
                </div>
                <div class="product-info">
                  <div class="product-title" @click.stop.prevent="goGoodDetail(product)">{{product.name}}</div>
                  <div class="product-price"><div class="num">{{product.memberPrice || product.price | currency}}</div></div>
                </div>
              </mu-flexbox-item>
            </mu-flexbox>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
            <!-- <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;我是有底线的&nbsp;&nbsp;———</div> -->
          </div>
        </div>
        <el-backtop target=".mainContent" :bottom="55" :right="10"></el-backtop>
        <div class="copyright">Copyright &copy; 2014-2019 深圳市未来科技文化有限公司 版权所有</div>
      </div>
    </div>
    <quietlogin />
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedsearch from '@/components/fixedtoolbar/fixedsearch';
  import swipe from '@/components/swipe/swipe';
  import topchanel from '@/components/channel/topchanelv2';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import seckill from '@/components/channel/seckill-channel';
  import brand from '@/components/channel/brand';
  import search from '@/components/fixedtoolbar/search';
  import quietlogin from '@/components/common/quietlogin';
  import floor from '@/components/channel/floor';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 30
  };
  export default {
    data() {
      return {
        scrollY: 0,
        swiperSlides: [],
        showTop: false,
        swipeHeight: 0,
        homeData: {},
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        loadEnd: false,
        scroller: null,
        loading: false
      };
    },
    created() {
      // 性能优化，增加首页本地缓存
      let appCache = this.$store.getters.loadAppCache;
      if (appCache) {
        console.log('cache hit.');
        this.homeData = appCache;
        setTimeout(() => {
          this.fetchData();
        }, 3000);
      } else {
        this.fetchData();
      }
      this.getList();
      this.wxReady();
    },
    mounted() {
      window.addEventListener('scroll', this._handleScroll);
      this.scroller = this.$refs.productWrapper;
    },
    deactivated() {
      window.removeEventListener('scroll', this._handleScroll);
    },
    updated() {
      this._initScroll();
    },
    activated() {
      this._initScroll();
      window.removeEventListener('scroll', this._handleScroll);
      window.addEventListener('scroll', this._handleScroll);
    },
    computed: {
      showFixed() {
        return this.scrollY >= this.swipeHeight;
      }
    },
    methods: {
      fetchData() {
        api.getHomeList().then(response => {
          this.homeData = response.data;
          if (this.homeData) {
            this.$store.dispatch('updateAppCache', this.homeData);
          }
        });
      },
      goGoodDetail(item) {
        this.$router.push({name: 'good', params: {id: item.id}});
      },
      getList() {
        this.loading = true;
        api.getRecommendProducts(this.listQuery).then(response => {
          this.loading = false;
          this.list = response.data.list;
          this.total = response.data.totalPage;
          if (this.pageNum < this.total) {
            this.pageNum++;
          } else {
            this.loadEnd = true;
          }
        });
      },
      loadMore() {
        this.getList();
      },
      getThumbnail(item) {
        let pic = item.pic;
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      _initScroll() {
        let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
        this.swipeHeight = swipe.clientHeight;
      },
      wxReady() {
        api.apiSign(encodeURIComponent(location.href.split('#')[0])).then(res => {
          let response = res.data;
          wx.config({
            // debug: true, // 开启调试模式
            appId: response.appId,      // 必填，公众号的唯一标识
            timestamp: response.timestamp,  // 必填，生成签名的时间戳
            nonceStr: response.nonceStr,   // 必填，生成签名的随机串
            signature: response.signature,  // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
          });
        });
        let redirect = 'http://' + location.host + location.pathname;
        let uid = this.$store.getters.userId;
        if (uid) {
          redirect += '?uid=' + uid;
        }
        let shareData = {
          title: '[未来科技电商平台]',
          desc: '深耕于国内礼品采购和积分兑换业务，您贴心的礼品小助手，欢迎围观!',
          link: redirect,
          imgUrl: api.CONFIG.logo
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      _handleScroll(e) {
        if (e) {
          this.scrollY = window.pageYOffset;
        }
      }
    },
    components: {
      swipe,
      topchanel,
      split,
      modalTitle,
      channel,
      fixedsearch,
      search,
      seckill,
      brand,
      quietlogin,
      floor
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .main
    position: relative
    box-sizing: border-box
    .mainContent
      position: relative
      width: 100%
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      padding-bottom: 60px
      overflow-x: hidden
      overflow-y: auto
    .swipe-wrapper
      position: relative
      width: 100%
      height: 9.35rem
      margin: 0 auto
  .copyright
    text-align: center
    color: #848689
    font-size: 1.86667vw
    padding: 2vw 0
  .product-wrapper
    position: relative
    width: 100%
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      margin: 0 8px 10px
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      border-top: 2px #f0f2f5 solid
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
</style>
