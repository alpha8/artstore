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

  export default {
    data() {
      return {
        scrollY: 0,
        teas: [],
        hotGoods: [],
        teapotGoods: [],
        sculptures: [],
        channels: [{
          name: '分类',
          url: '/category',
          icon: 'icon-classify'
        }, {
          name: '茶席艺术',
          url: '/category',
          icon: 'icon-kettle'
        }, {
          name: '精选茶',
          url: '/category',
          icon: 'icon-teapot_and_cup'
        }, {
          name: '二折抢拍',
          url: '/auction',
          icon: 'icon-auction'
        }, {
          name: '团购',
          url: '/category',
          icon: 'icon-funds'
        }],
        swiperSlides: [
          'http://www.yihuyixi.com/ps/download/5959aca4e4b00faa50475a16?h=410',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?h=410',
          'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a19?h=410'
        ],
        selectedGood: {},
        showTop: false,
        showFixed: false,
        winHeight: document.documentElement.clientHeight
      };
    },
    created() {
      api.GetGoods({
        artworkTypeName: 'tea',
        categoryParentName: 'welltea'
      }).then((response) => {
        this.teas = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryName: 'teahouse'
      }).then((response) => {
        this.hotGoods = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryName: 'teacup'
      }).then((response) => {
        this.teapotGoods = response.artworks;
      });

      api.GetGoods({
        artworkTypeName: 'tea',
        categoryName: 'sculpture'
      }).then((response) => {
        this.sculptures = response.artworks;
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
    .mainContent
      position: relative
      padding-bottom: 60px
    .swipe-wrapper
      position: relative
      width: 100%
      height: auto
      margin: 0 auto
</style>
