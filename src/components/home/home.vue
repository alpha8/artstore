<template>
  <div class="home">
    <fixedsearch ref="search" :showFixed="showFixed"></fixedsearch>
    <search ref="advancedSearch"></search>
    <div class="main" ref="mainWrapper">
      <div class="mainContent">
        <div class="swipe-wrapper swipe-hook">
          <swipe :swiperSlides="swiperSlides"></swipe>
        </div>
        <topchanel :channels="channels"></topchanel>
        <split></split>
        <modal-title title="茶席套装.三百席" moreText="更多" catKey="art" catName="茶席套装.三百席"></modal-title>
        <channel :items="arts" :cols="2"></channel>
        <split></split>
        <modal-title title="优质茶器(1000元以内)" moreText="更多" catKey="teaart" catName="优质茶器" price="0-1000"></modal-title>
        <channel :items="teaPots" :cols="2"></channel>
        <split></split>
        <modal-title title="贵重茶器(1000元以上)" moreText="更多" catKey="teaart" catName="贵重茶器" price="1000-"></modal-title>
        <channel :items="dearTeapots" :cols="2"></channel>
         <split></split>
        <modal-title title="一虎一席.200款老茶博物馆" moreText="更多" catKey="museum" catName="一虎一席.200款老茶博物馆"></modal-title>
        <channel :items="oldTeas" :cols="2"></channel>
        <split></split>
        <modal-title title="好茶 (百里挑一、更实惠)" moreText="更多" catKey="welltea" catName="好茶（精选汇聚、更实惠）"></modal-title>
        <channel :items="goodTeas" :cols="2"></channel>
        <split></split>
        <modal-title title="一虎一席茶室艺术空间"></modal-title>
        <div class="vipmovie">
          <div id="vip_video_player" :style="getVideoWidth">
            <video oncontextmenu="return false;" controls="controls" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5db404564972818869478317/snapshot/1514945837_2671344614.100_0.jpg" id="vipvideo" :src="videos.vip">
            </video>
          </div>
          <div class="slogan">[深圳国际艺术博览会] VIP室：一虎一席茶室艺术</div>
        </div>
        <split></split>
        <modal-title title="茶室专业配画" moreText="更多" catKey="paint" catName="茶室专业配画"></modal-title>
        <channel :items="paints" :cols="2"></channel>
        <split></split>
        <modal-title title="茶室空间雅物" moreText="更多" catKey="graceful" catName="茶室空间雅物"></modal-title>
        <channel :items="ya" :cols="2"></channel>
        <split></split>
        <modal-title title='关于 "一虎一席"'></modal-title>
        <div class="aboutus">
          <div id="tencent_video_player" :style="getVideoWidth">
            <video oncontextmenu="return false;" controls="controls" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5d37d4564972818869478170/snapshot/1514945818_4129077795.100_0.jpg" id="springvideo" :src="videos.spring">
            </video>
          </div>
          <div class="slogan">一虎一席东方生活美学雅集《春风十里》</div>
        </div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedsearch from '@/components/fixedtoolbar/fixedsearch';
  import swipe from '@/components/swipe/swipe';
  import topchanel from '@/components/channel/topchanel';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import gotop from '@/components/fixedtoolbar/gotop';
  import search from '@/components/fixedtoolbar/search';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  export default {
    data() {
      return {
        scrollY: 0,
        arts: [],
        teaPots: [],
        dearTeapots: [],
        goodTeas: [],
        oldTeas: [],
        paints: [],
        ya: [],
        channels: [{
          name: '茶席套装',
          url: '/search?parentCat=art&key=茶席套装',
          icon: 'icon-teapot_kitchen'
        }, {
          name: '茶器优品',
          url: '/search?parentCat=teaart&key=茶器优品',
          icon: 'icon-blackteapot big'
        }, {
          name: '茶室配画',
          url: '/search?parentCat=paint&key=茶室配画',
          icon: 'icon-paint big'
        }, {
          name: '茶室雅物',
          url: '/search?parentCat=graceful&key=茶室雅物',
          icon: 'icon-snowlotus big'
        }, {
          name: '好茶惠聚',
          url: '/search?parentCat=welltea&key=好茶惠聚',
          icon: 'icon-tea_drink big'
        }, {
          name: '老茶博物馆',
          url: '/search?parentCat=museum&key=老茶博物馆',
          icon: 'icon-museum big'
        }, {
          name: '四折秒杀',
          url: '/seckill',
          icon: 'icon-miaosha big'
        }, {
          name: '全部栏目',
          url: '',
          icon: 'icon-down2 big',
          tag: 'more',
          replace: '收起栏目',
          replaceIcon: 'icon-upward2 big'
        }, {
          name: '五折团购',
          url: '/groupbuy',
          icon: 'icon-group_purchase',
          css: 'nobottom'
        }, {
          name: '五折抢拍',
          url: '/auction',
          icon: 'icon-auction',
          css: 'nobottom'
        }],
        swiperSlides: [
          'http://www.yihuyixi.com/ps/download/5959aca4e4b00faa50475a16?h=500',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?h=500',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a19?h=500'
        ],
        selectedGood: {},
        showTop: false,
        swipeHeight: 0,
        lastInitPlayer: +new Date(),
        videos: {
          'vip': 'http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5db404564972818869478317/v.f20.mp4',
          'spring': 'http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5d37d4564972818869478170/v.f20.mp4'
        }
      };
    },
    created() {
      this.wxReady();
      // this.loadTencentPlayer();
      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'art',
        currentPage: 1,
        pageSize: 16,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.arts = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'teaart',
        currentPage: 1,
        pageSize: 30,
        commodityStatesId: 2,
        price: '0-1000',
        scoreSort: true
      }).then((response) => {
        this.teaPots = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'teaart',
        currentPage: 1,
        pageSize: 16,
        commodityStatesId: 2,
        price: '1000-',
        scoreSort: true
      }).then((response) => {
        this.dearTeapots = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'welltea',
        currentPage: 1,
        pageSize: 20,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.goodTeas = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'museum',
        currentPage: 1,
        pageSize: 8,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.oldTeas = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'paint',
        currentPage: 1,
        pageSize: 20,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.paints = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'graceful',
        currentPage: 1,
        pageSize: 20,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.ya = response.artworks;
      });
    },
    mounted() {
      this._initScroll();
    },
    updated() {
      this._initScroll();
    },
    activated() {
      this._initScroll();
    },
    computed: {
      showFixed() {
        return this.scrollY >= this.swipeHeight;
      },
      getVideoWidth() {
        let w = document.documentElement.clientWidth;
        return { width: w + 'px', height: w * 0.575 + 'px' };
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.mainWrapper, {
              click: true,
              probeType: 3,
              bounce: false
            });
            let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
            this.swipeHeight = swipe.clientHeight;
            this.scroll.on('scroll', (pos) => {
              let offset = Math.abs(Math.round(pos.y));
              if (this.scrollY !== offset) {
                this.scrollY = offset;
              }
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      selectGood(good) {
        this.selectedGood = good;
        this.$refs.goodDetail.show();
      },
      addFood(target) {
      },
      _initPlayer() {
      },
      goTop() {
        let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
        this.scroll.scrollToElement(swipe, 300);
      },
      wxReady() {
        api.wxsignature(encodeURIComponent(location.href.split('#')[0])).then(response => {
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
        let uid = this.$store.getters.getUserInfo.userId;
        if (uid) {
          redirect += '?userId=' + uid;
        }
        let shareData = {
          title: '[一虎一席茶席艺术平台] 商城',
          desc: '优质茶生活，茶文化高端礼品. “领略东方生活之美”.【一站式优品商城，品味脱凡】',
          link: redirect,
          imgUrl: 'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?w=423&h=423'
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      }
    },
    components: {
      swipe,
      topchanel,
      split,
      modalTitle,
      channel,
      fixedsearch,
      gotop,
      search
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .main
    position: absolute
    left: 0
    top: 0
    bottom: 50px
    width: 100%
    overflow: hidden
    .mainContent
      position: relative
      padding-bottom: 20px
      #tencent_video_player, #vip_video_player
        position: relative
        width: 100%
        height: auto
        padding: 0 5px
        box-sizing: border-box
        overflow: hidden
      .slogan
        line-height: 1.5
        font-size: 14px
        padding: 3px 8px
        white-space: normal
        word-break: break-all
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        text-overflow: ellipsis
        overflow: hidden
      .vipmovie
        padding-bottom: 10px
    .swipe-wrapper
      position: relative
      width: 100%
      height: auto
      margin: 0 auto
</style>
