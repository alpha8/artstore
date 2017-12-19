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
        <modal-title title="茶席套装" moreText="更多" catKey="art" catName="茶席套装"></modal-title>
        <channel :items="arts" :cols="2"></channel>
        <split></split>
        <modal-title title="优质茶器" moreText="更多" catKey="teaart" catName="优质茶器"></modal-title>
        <channel :items="teaPots" :cols="2"></channel>
        <split></split>
        <modal-title title="好茶" moreText="更多" catKey="welltea" catName="好茶"></modal-title>
        <channel :items="goodTeas" :cols="2"></channel>
        <split></split>
        <modal-title title="茶室专业配画" moreText="更多" catKey="paint" catName="茶室专业配画"></modal-title>
        <channel :items="paints" :cols="2"></channel>
        <split></split>
        <modal-title title="茶室空间雅物" moreText="更多" catKey="graceful" catName="茶室空间雅物"></modal-title>
        <channel :items="ya" :cols="2"></channel>
        <split></split>
        <modal-title title='关于 "一虎一席"'></modal-title>
        <div class="aboutus">
          <div id="tencent_video_player" :style="getVideoWidth"></div>
          <div class="slogan">一虎一席东方生活美学雅集.春风十里</div>
        </div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
    <frame></frame>
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
  import frame from '@/components/common/myiframe';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  export default {
    data() {
      return {
        scrollY: 0,
        arts: [],
        teaPots: [],
        goodTeas: [],
        paints: [],
        ya: [],
        channels: [{
          name: '茶席套装',
          url: '/search?parentCat=art&key=茶席套装',
          icon: 'icon-teapot_kitchen'
        }, {
          name: '优质茶器',
          url: '/search?parentCat=teaart&key=优质茶器',
          icon: 'icon-kettle big'
        }, {
          name: '好茶',
          url: '/search?parentCat=welltea&key=好茶',
          icon: 'icon-tea_drink big'
        }, {
          name: '四折秒杀',
          url: '/seckill',
          icon: 'icon-miaosha'
        }, {
          name: '五折团购',
          url: '/groupbuy',
          icon: 'icon-group_purchase'
        }, {
          name: '五折抢拍',
          url: '/auction',
          icon: 'icon-auction'
        }],
        swiperSlides: [
          'http://www.yihuyixi.com/ps/download/5959aca4e4b00faa50475a16?h=500',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?h=500',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a19?h=500'
        ],
        selectedGood: {},
        showTop: false,
        swipeHeight: 0
      };
    },
    created() {
      this.wxReady();
      this.loadTencentPlayer();
      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'art',
        currentPage: 1,
        pageSize: 20,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.arts = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'teaart',
        currentPage: 1,
        pageSize: 20,
        commodityStatesId: 2,
        scoreSort: true
      }).then((response) => {
        this.teaPots = response.artworks;
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
    deactivated() {
      this.scrollY = 0;
    },
    computed: {
      showFixed() {
        return this.scrollY >= this.swipeHeight;
      },
      getVideoWidth() {
        return { width: (document.documentElement.clientWidth - 5) + 'px' };
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
              this.scrollY = Math.abs(Math.round(pos.y));
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      loadTencentPlayer() {
        let option = {
          'auto_play': '0',
          'file_id': '4564972818673793787',
          'app_id': '1252423336',
          'width': 640,
          'height': 368,
          'https': 1,
          'hide_h5_setting': true
        };
        document.addEventListener('DOMContentLoaded', () => {
          if (window.qcVideo) {
            new qcVideo.Player('tencent_video_player', option);
          } else {
            setTimeout(() => {
              new qcVideo.Player('tencent_video_player', option);
            }, 800);
          }
          setTimeout(() => {
            let video = document.getElementsByTagName('video')[0];
            if (video) {
              video.setAttribute('x5-playsinline', 'true');
            }
          }, 2000);
        });
      },
      selectGood(good) {
        this.selectedGood = good;
        this.$refs.goodDetail.show();
      },
      addFood(target) {
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
        let redirect = location.href.replace('?from=singlemessage&isappinstalled=0', '');
        let uid = this.$store.getters.getUserInfo.userId;
        if (uid) {
          redirect += '?userId=' + uid;
        }
        let shareData = {
          title: '一虎一席茶席艺术平台',
          desc: '「一虎一席茶席艺术平台」精品。新关注用户送百元现金券。',
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
      search,
      frame
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
      #tencent_video_player
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
    .swipe-wrapper
      position: relative
      width: 100%
      height: auto
      margin: 0 auto
</style>
