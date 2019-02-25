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
        <div v-for="(item, index) in channelGoods" :key="index">
          <modal-title :title="item.title" moreText="更多" catKey="" catName="" price=""></modal-title>
          <channel :items="item.goods" :cols="2" :section="item.key"></channel>
          <split></split>
        </div>
        <modal-title title="一虎一席茶室艺术空间 (30秒大片)"></modal-title>
        <div class="vipmovie">
          <div id="vip_video_player" :style="getVideoWidth">
            <video oncontextmenu="return false;" controls="controls" loop="loop" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5db404564972818869478317/snapshot/1514945837_2671344614.100_0.jpg" id="vipvideo" :src="videos.vip">
            </video>
          </div>
          <div class="slogan">[深圳国际艺术博览会] VIP室：一虎一席茶室艺术</div>
        </div>
        <split></split>
        <modal-title title="优质茶器(1000元以内)" moreText="更多" catKey="teaart" catName="优质茶器" price="0-1000"></modal-title>
        <channel :items="teaPots" :cols="2" section="cheap_teaware"></channel>
        <split></split>
        <modal-title title="茶席套装.三百席" moreText="更多" catKey="art" catName="茶席套装.三百席"></modal-title>
        <channel :items="arts" :cols="2" section="teasuite"></channel>
        <split></split>
        <modal-title title="贵重茶器(1000元以上)" moreText="更多" catKey="teaart" catName="贵重茶器" price="1000-"></modal-title>
        <channel :items="dearTeapots" :cols="2" section="dearly_teaware"></channel>
         <split></split>
        <modal-title title="一虎一席.200款老茶博物馆" moreText="更多" catKey="museum" catName="一虎一席.200款老茶博物馆"></modal-title>
        <channel :items="oldTeas" :cols="2" section="tealab"></channel>
        <split></split>
        <modal-title title="好茶 (百里挑一、更实惠)" moreText="更多" catKey="welltea" catName="好茶（精选汇聚、更实惠）"></modal-title>
        <channel :items="goodTeas" :cols="2" section="nicetea"></channel>
        <split></split>
        <modal-title title="茶室专业配画 (名家、新锐)" moreText="更多" catKey="paint" catName="茶室专业配画"></modal-title>
        <channel :items="paints" :cols="2" section="teaspace"></channel>
        <split></split>
        <modal-title title="茶室空间雅物" moreText="更多" catKey="graceful" catName="茶室空间雅物"></modal-title>
        <channel :items="ya" :cols="2" section="teagrace"></channel>
        <split v-show="articles && articles.length"></split>
        <section-title title='博览集萃 (茶.书画.美学)' v-show="articles && articles.length" moreText="更多" :getMore="getMoreArticles"></section-title>
        <articlelist :articles="articles" v-show="articles && articles.length" section="articles"></articlelist>
        <split></split>
        <modal-title title='关于 "一虎一席"'></modal-title>
        <div class="aboutus">
          <div id="tencent_video_player" :style="getVideoWidth">
            <video oncontextmenu="return false;" controls="controls" loop="loop" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5d37d4564972818869478170/snapshot/1514945818_4129077795.100_0.jpg" id="springvideo" :src="videos.spring">
            </video>
          </div>
          <div class="slogan">一虎一席东方生活美学雅集《春风十里》</div>
        </div>
        <split v-if="showFollow"></split>
        <modal-title :title="aboutUs" catKey="" catName="" v-show="showFollow"></modal-title>
        <div v-if="showFollow" class="wx_follow">
          <img :src="wxqrcode" border="0" @click.stop.prevent="previewQrcode" />
        </div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
    <quietlogin></quietlogin>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedsearch from '@/components/fixedtoolbar/fixedsearch';
  import swipe from '@/components/swipe/swipe';
  import topchanel from '@/components/channel/topchanelv2';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import sectionTitle from '@/components/common/section-title';
  import channel from '@/components/channel/channel';
  import gotop from '@/components/fixedtoolbar/gotop';
  import search from '@/components/fixedtoolbar/search';
  import articlelist from '@/components/article/articlelist';
  import quietlogin from '@/components/common/quietlogin';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  export default {
    data() {
      return {
        scrollY: 0,
        articles: [],
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
          name: '首单4折区',
          url: '/firstpurchase',
          icon: 'icon-prefer big',
          highlight: true
        }, {
          name: '砍价区',
          url: '/sharepay',
          icon: 'icon-cutingprice big'
        }, {
          name: '3折拼团',
          url: '/tuan',
          icon: 'icon-tuan big',
          highlight: true
        }, {
          name: '4折秒杀',
          url: '/seckill',
          icon: 'icon-miaosha big'
        // }, {
        //   name: '全部栏目',
        //   url: '',
        //   icon: 'icon-down2 big',
        //   tag: 'more',
        //   replace: '收起栏目',
        //   replaceIcon: 'icon-upward2 big'
        }, {
          name: '团 购',
          url: '/groupbuy',
          icon: 'icon-group_purchase',
          css: 'nobottom'
        }, {
          name: '拍 卖',
          url: '/auction',
          icon: 'icon-auction',
          css: 'nobottom'
        }, {
          name: '文 章',
          url: '/articles',
          icon: 'icon-file'
        }, {
          name: '现金券',
          url: '/search?parentCat=teaexpo&key=现金券',
          icon: 'icon-coupon big'
        }],
        swiperSlides: [
          'http://imgcdn.yihuyixi.com/ps/download/5959aca4e4b00faa50475a16?h=500',
          'http://imgcdn.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?h=500',
          'http://imgcdn.yihuyixi.com/ps/download/5959aca5e4b00faa50475a19?h=500'
        ],
        selectedGood: {},
        showTop: false,
        swipeHeight: 0,
        lastInitPlayer: +new Date(),
        videos: {
          'vip': 'http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5db404564972818869478317/v.f20.mp4',
          'spring': 'http://1252423336.vod2.myqcloud.com/950efb46vodtransgzp1252423336/85f5d37d4564972818869478170/v.f20.mp4'
        },
        showFollow: true,
        wxqrcode: api.CONFIG.wxqrcode,
        channelGoods: [],
        coins: {
          coin: 0,
          yourCoin: 0
        }
      };
    },
    created() {
      // 性能优化，增加首页本地缓存
      let appCache = this.$store.getters.loadAppCache;
      if (appCache.home && appCache.home.arts && appCache.home.arts.length) {
        console.log('cache hit.');
        let hitCache = appCache.home;
        this.arts = hitCache.arts || [];
        this.dearTeapots = hitCache.dearTeapots || [];
        this.teaPots = hitCache.teaPots || [];
        this.goodTeas = hitCache.goodTeas || [];
        this.ya = hitCache.ya || [];
        this.oldTeas = hitCache.oldTeas || [];
        this.articles = hitCache.articles || [];
        this.paints = hitCache.paints || [];
        this.channelGoods = hitCache.channelGoods || [];
        setTimeout(() => {
          this.fetchData();
        }, 3000);
      } else {
        this.fetchData();
      }
      this.wxReady();
    },
    mounted() {
      this.scroller = this.$refs.mainWrapper;
      window.addEventListener('scroll', this._handleScroll);
    },
    deactivated() {
      window.removeEventListener('scroll', this._handleScroll);
      this.coins = {
        coin: 0,
        yourCoin: 0
      };
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
      },
      getVideoWidth() {
        let w = document.documentElement.clientWidth;
        return { width: w + 'px', height: w * 0.575 + 'px' };
      },
      aboutUs() {
        return `关于「${api.CONFIG.APPNAME || '一虎一席茶生活美学商城'}」`;
      }
    },
    methods: {
      fetchData() {
        let user = this.$store.getters.getUserInfo;
        let anon = '';
        if (!user.userId) {
          this.$store.dispatch('setAnonymous');
          anon = this.$store.getters.getAnonymous;
        }
        api.getHomeList({
          type: 'home',
          stat: 1,
          unlogin: anon
        }).then((response) => {
          this.channelGoods = [];
          for (let key in response) {
            if (key.length > 20) {
              if (response[key] && response[key].goods && response[key].title) {
                this.channelGoods.push({'key': key, 'title': response[key].title, 'goods': response[key].goods});
              }
            }
          }
          this.arts = response.arts || [];
          this.dearTeapots = response.dearTeapots || [];
          this.teaPots = response.teaPots || [];
          this.goodTeas = response.goodTeas || [];
          this.ya = response.ya || [];
          this.oldTeas = response.oldTeas || [];
          this.articles = response.articles || [];
          this.paints = response.paints || [];
          if (this.arts.length && this.teaPots.length) {
            this.$store.dispatch('updateAppCache', {'home': {
              arts: this.arts,
              dearTeapots: this.dearTeapots,
              teaPots: this.teaPots,
              goodTeas: this.goodTeas,
              ya: this.ya,
              oldTeas: this.oldTeas,
              articles: this.articles,
              paints: this.paints,
              channelGoods: this.channelGoods
            }});
          }
        });
      },
      _initScroll() {
        let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
        this.swipeHeight = swipe.clientHeight;
      },
      selectGood(good) {
        this.selectedGood = good;
        this.$refs.goodDetail.show();
      },
      addFood(target) {
      },
      _initPlayer() {
      },
      getMoreArticles() {
        this.$router.push({name: 'articles'});
      },
      goTop() {
        this.scrollY = 0;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        // let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
        // this.scroll.scrollToElement(swipe, 300);
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
          redirect += '?userId=' + (uid || 0);
        }
        let shareData = {
          title: '[一虎一席茶生活美学商城] 一站式优品商城，品味脱凡',
          desc: '1200款精美茶器、300套茶席佳作、茶室专业配画、200款好茶老茶.【每年递增100%】',
          link: redirect,
          imgUrl: 'http://www.yihuyixi.com/ps/download/5a60046ae4b0a5130574a5fc'
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      getWXFollow() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.showFollow = true;
          return;
        }
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0 && response.user) {
            this.showFollow = (response.user.follow === 0 || response.user.follow === 2);
          }
        }).catch(response => {
          console.error(response);
        });
      },
      previewQrcode() {
        wx.previewImage({
          current: this.wxqrcode,
          urls: [this.wxqrcode]
        });
      },
      _handleScroll(e) {
        this.scrollY = window.pageYOffset;
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
      search,
      articlelist,
      sectionTitle,
      quietlogin
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
    .mainContent
      position: relative
      padding-bottom: 80px
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      background-color: #fff
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
      .vipmovie, .aboutus
        padding-bottom: 8px
    .swipe-wrapper
      position: relative
      width: 100%
      height: auto
      margin: 0 auto
  .wx_follow
    position: relative
    width: 100%
    height: auto
    overflow: hidden
    img
      position: relative
      width: 100%
      height: auto
</style>
