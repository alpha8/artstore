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
        <modal-title title="精选茶"></modal-title>
        <channel :items="teas" :cols="2" @select="selectGood"></channel>
        <split></split>
        <modal-title title="人气商品"></modal-title>
        <channel :items="hotGoods" :cols="2" @select="selectGood"></channel>
        <split></split>
        <modal-title title="精选茶席器皿"></modal-title>
        <channel :items="teapotGoods" :cols="2" @select="selectGood"></channel>
        <split></split>
        <modal-title title="雕塑"></modal-title>
        <channel :items="sculptures" :cols="2" @select="selectGood"></channel>
      </div>
    </div>
    <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
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

  const ERR_OK = 0;

  export default {
    data() {
      return {
        scrollY: 0,
        teas: [],
        hotGoods: [],
        teapotGoods: [],
        sculptures: [],
        channels: [{
          name: '二折抢拍',
          url: '/category',
          icon: 'icon-auction'
        }, {
          name: '分类',
          url: '/category',
          icon: 'icon-classify'
        }, {
          name: '茶席艺术',
          url: '/category',
          icon: 'icon-kettle'
        }, {
          name: '团购',
          url: '/category',
          icon: 'icon-funds'
        }, {
          name: '老茶鉴藏',
          url: '/category',
          icon: 'icon-teapot_and_cup'
        }],
        swiperSlides: [
          '/static/images/slider/1.jpg',
          '/static/images/slider/2.jpg',
          '/static/images/slider/3.jpg'
        ],
        selectedGood: {},
        showTop: false,
        showFixed: false,
        winHeight: document.documentElement.clientHeight
      };
    },
    created() {
      api.GetGoods().then(response => {
        if (response.errno === ERR_OK) {
          let goods = response.data;
          let tmp = goods.filter((good) => {
            return good.id === '1';
          });
          if (tmp && tmp.length) {
            this.teas = tmp[0].items;
          }

          let hotTmp = goods.filter((good) => {
            return good.id === '4';
          });
          if (hotTmp && hotTmp.length) {
            this.hotGoods = hotTmp[0].items;
          }

          let hotpotTmp = goods.filter((good) => {
            return good.id === '3';
          });
          if (hotpotTmp && hotpotTmp.length) {
            this.teapotGoods = hotpotTmp[0].items;
          }

          let sTmp = goods.filter((good) => {
            return good.id === '2';
          });
          if (sTmp && sTmp.length) {
            this.sculptures = sTmp[0].items;
          }
          setTimeout(() => {
            this._initScroll();
          }, 800);
        }
      });
    },
    activated() {
      this._initScroll();
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.mainWrapper, {
              click: true,
              probeType: 3
            });
            let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
            let h = swipe.clientHeight;
            let search = this.$refs.search.$el;
            this.scroll.on('scroll', (pos) => {
              this.scrollY = Math.abs(Math.round(pos.y));
              if (this.scrollY > h) {
                search.className = 'toolbar fixed';
                this.showFixed = true;
              } else {
                search.className = 'toolbar';
                this.showFixed = false;
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
      goTop() {
        let swipe = this.$refs.mainWrapper.getElementsByClassName('swipe-hook')[0];
        this.scroll.scrollToElement(swipe, 300);
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
    .swipe-wrapper
      position: relative
      width: 100%
      height: auto
      margin: 0 auto
</style>
