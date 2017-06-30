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
  // import api from '@/api/api';

  // const ERR_OK = 0;

  export default {
    data() {
      return {
        scrollY: 0,
        teas: [
          {
            'id': '1000',
            'name': '80年代绿茶',
            'price': 100000,
            'oldPrice': '',
            'description': '80年代绿茶（茉莉花茶）（珍品） 10万/斤',
            'sellCount': 1,
            'rating': 100,
            'info': '80年代绿茶（茉莉花茶）（珍品）',
            'src': 'http://www.yihuyixi.com/ps/download/5930c948e4b0b0797c093323?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c948e4b0b0797c093323?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c948e4b0b0797c093323?w=750&h=750'
          },
          {
            'id': '1001',
            'name': '1990年铁观音',
            'price': 100000,
            'oldPrice': '',
            'description': '1990年铁观音（特级珍品）   10万/斤',
            'sellCount': 0,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8a6e4b0b0797c0932ea?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8a6e4b0b0797c0932ea?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8a6e4b0b0797c0932ea?w=750&h=750'
          },
          {
            'id': '1002',
            'name': '1992年铁观音',
            'price': 95000,
            'oldPrice': '',
            'description': '1992年铁观音（特级珍品）   9.5万/斤',
            'sellCount': 2,
            'rating': 85,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c89ee4b0b0797c0932e5?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c89ee4b0b0797c0932e5?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c89ee4b0b0797c0932e5?w=750&h=750'
            },
          {
            'id': '1003',
            'name': '2006象明山乔木生普',
            'price': 800,
            'oldPrice': '',
            'description': '2006象明山乔木生普（鉴藏级）800/斤',
            'sellCount': 10,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8b3e4b0b0797c0932f0?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8b3e4b0b0797c0932f0?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8b3e4b0b0797c0932f0?w=750&h=750'
          }
        ],
        hotGoods: [
              {
                'id': '4000',
                'name': '云中鹰茶仓',
                'price': 1200,
                'oldPrice': '',
                'description': '云中鹰茶仓（存货紧缺）',
                'sellCount': 1,
                'rating': '',
                'info': '',
                'src': 'http://www.yihuyixi.com/ps/download/5930c8cbe4b0b0797c0932fc?w=228&h=128',
                'icon': 'http://www.yihuyixi.com/ps/download/5930c8cbe4b0b0797c0932fc?w=114&h=114',
                'image': 'http://www.yihuyixi.com/ps/download/5930c8cbe4b0b0797c0932fc?w=750&h=750'
              },
              {
                'id': '4001',
                'name': '隐樵山柴烧茶仓',
                'price': 1100,
                'oldPrice': '',
                'description': '隐樵山柴烧茶仓（存货紧缺）',
                'sellCount': 7,
                'rating': 100,
                'info': '',
                'src': 'http://www.yihuyixi.com/ps/download/5930c8e1e4b0b0797c093306?w=228&h=128',
                'icon': 'http://www.yihuyixi.com/ps/download/5930c8e1e4b0b0797c093306?w=114&h=114',
                'image': 'http://www.yihuyixi.com/ps/download/5930c8e1e4b0b0797c093306?w=750&h=750'
              },
              {
                'id': '4002',
                'name': '80年代老厂红泥小火炉',
                'price': 1600,
                'oldPrice': '',
                'description': '80年代老厂红泥小火炉（特级，存货紧缺）',
                'sellCount': 15,
                'rating': 100,
                'info': '',
                'src': 'http://www.yihuyixi.com/ps/download/5930c94ae4b0b0797c093324?w=228&h=128',
                'icon': 'http://www.yihuyixi.com/ps/download/5930c94ae4b0b0797c093324?w=114&h=114',
                'image': 'http://www.yihuyixi.com/ps/download/5930c94ae4b0b0797c093324?w=750&h=750'
              }
        ],
        teapotGoods: [
          {
            'id': '3000',
            'name': '荷塘鸣雀杯',
            'price': 850,
            'oldPrice': 1000,
            'description': '荷塘鸣雀杯（特级）',
            'sellCount': 15,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8b1e4b0b0797c0932ef?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8b1e4b0b0797c0932ef?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8b1e4b0b0797c0932ef?w=750&h=750'
          },
          {
            'id': '3001',
            'name': '鹅黄釉相思鸟品茗杯',
            'price': 850,
            'oldPrice': '',
            'description': '鹅黄釉相思鸟品茗杯（特级）',
            'sellCount': 15,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c94ce4b0b0797c093325?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c94ce4b0b0797c093325?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c94ce4b0b0797c093325?w=750&h=750'
          },
          {
            'id': '3002',
            'name': '闲云野鹤杯',
            'price': 520,
            'oldPrice': '',
            'description': '闲云野鹤杯（特级）',
            'sellCount': 15,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8d0e4b0b0797c0932fd?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8d0e4b0b0797c0932fd?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8d0e4b0b0797c0932fd?w=750&h=750'
          },
          {
            'id': '3003',
            'name': '千叶马蹄杯',
            'price': 450,
            'oldPrice': '',
            'description': '千叶马蹄杯（特级）',
            'sellCount': 150,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932df?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932df?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932df?w=750&h=750'
          },
          {
            'id': '3004',
            'name': '小云朵影青玉兰杯',
            'price': 260,
            'oldPrice': 300,
            'description': '小云朵影青玉兰杯',
            'sellCount': 105,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8d7e4b0b0797c093300?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8d7e4b0b0797c093300?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8d7e4b0b0797c093300?w=750&h=750'
          },
          {
            'id': '3005',
            'name': '葵口方鼎杯',
            'price': 120,
            'oldPrice': '',
            'description': '葵口方鼎杯',
            'sellCount': 1200,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8a1e4b0b0797c0932e7?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8a1e4b0b0797c0932e7?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8a1e4b0b0797c0932e7?w=750&h=750'
          },
          {
            'id': '3006',
            'name': '千仞悟杯',
            'price': 90,
            'oldPrice': '',
            'description': '千仞悟杯',
            'sellCount': 5005,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8c7e4b0b0797c0932f9?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8c7e4b0b0797c0932f9?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8c7e4b0b0797c0932f9?w=750&h=750'
          },
          {
            'id': '3007',
            'name': '五福天青壶承',
            'price': 450,
            'oldPrice': '',
            'description': '五福天青壶承',
            'sellCount': 1000,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8c8e4b0b0797c0932fb?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8c8e4b0b0797c0932fb?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8c8e4b0b0797c0932fb?w=750&h=750'
          }
        ],
        sculptures: [
          {
            'id': '2000',
            'name': '唐蹴鞠瓷雕',
            'price': 2800,
            'oldPrice': 3000,
            'description': '唐蹴鞠瓷雕（特级）',
            'sellCount': 170,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8bbe4b0b0797c0932f4?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8bbe4b0b0797c0932f4?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8bbe4b0b0797c0932f4?w=750&h=750'
          },
          {
            'id': '2001',
            'name': '遨云皮丘铜雕',
            'price': 1200,
            'oldPrice': '',
            'description': '遨云皮丘铜雕（特级）',
            'sellCount': 1800,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c897e4b0b0797c0932e1?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c897e4b0b0797c0932e1?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c897e4b0b0797c0932e1?w=750&h=750'
          },
          {
            'id': '2003',
            'name': '将军螃蟹铜雕',
            'price': 350,
            'oldPrice': '',
            'description': '将军螃蟹铜雕（特级）',
            'sellCount': 1000,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932de?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932de?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c890e4b0b0797c0932de?w=750&h=750'
          },
          {
            'id': '2004',
            'name': '熙园双鹊瓷雕',
            'price': 320,
            'oldPrice': '',
            'description': '熙园双鹊瓷雕（特级）',
            'sellCount': 2000,
            'rating': 100,
            'info': '',
            'src': 'http://www.yihuyixi.com/ps/download/5930c8b5e4b0b0797c0932f2?w=228&h=128',
            'icon': 'http://www.yihuyixi.com/ps/download/5930c8b5e4b0b0797c0932f2?w=114&h=114',
            'image': 'http://www.yihuyixi.com/ps/download/5930c8b5e4b0b0797c0932f2?w=750&h=750'
          }
        ],
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
          url: '/category',
          icon: 'icon-auction'
        }, {
          name: '团购',
          url: '/category',
          icon: 'icon-funds'
        }],
        swiperSlides: [
          'http://www.yihuyixi.com/ps/download/58d0a8a4e4b0d22abd5efbc2?h=410',
          'http://www.yihuyixi.com/ps/download/58d0a896e4b0d22abd5efbbc?h=410',
          'http://www.yihuyixi.com/ps/download/58d0a89be4b0d22abd5efbc0?h=410'
        ],
        selectedGood: {},
        showTop: false,
        showFixed: false,
        winHeight: document.documentElement.clientHeight
      };
    },
    created() {
      /* api.GetGoods().then(response => {
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
      }); */
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
