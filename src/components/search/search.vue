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
            <input type="text" name="txtSearch" class="txtSearch" placeholder="搜索所有商品" autocomplete="off" v-model="keyword" @keyup.enter="search" @change="search">
          </div>
          <i class="removeText" v-show="keyword" @click.stop.prevent="clearText"></i>
        </div>
      </div>
      <div class="right" @click.stop.prevent="showSidebar">筛选</div>
    </div>
    <div class="sortbar-wrapper">
      <div class="sortbar-item active">专业评分</div>
      <div class="sortbar-item">销量</div>
      <div class="sortbar-item"><span class="sort">价格<i class="arrow_up"></i><i class="arrow_down"></i></span></div>
      <div class="sortbar-item">评论数</div>
    </div>
    <div class="product-wrapper" ref="productWrapper">
      <div class="productlist">
        <div class="product-item" v-for="(product, index) in products" key="index">
          <div class="product-thumbnail">
            <router-link :to="{name: 'good', params: {id: product.id}}"><img :src="product.image" /></router-link>
          </div>
          <div class="product-info">
            <div class="product-title"><router-link :to="{name: 'good', params: {id: product.id}}">{{product.name}}</router-link></div>
            <div class="product-price">¥<span class="num">{{product.price}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <sidebar></sidebar>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import sidebar from '@/components/search/sidebar';
  export default {
    data() {
      return {
        keyword: '',
        products: [
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
          },
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
          },
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
          },
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
        ]
      };
    },
    activated() {
      this._initScroll();
      this.keyword = this.$route.query.key || '';
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.productWrapper, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      showSidebar() {
        this.$store.commit('SHOW_SIDEBAR');
      },
      back() {
        this.$router.back();
      },
      search() {
        this.$store.dispatch('openLoading');
        setTimeout(() => {
          this.$store.dispatch('closeLoading');
          console.log(`搜索关键字：${this.keyword}`);
        }, 1500);
      },
      clearText() {
        this.keyword = '';
      }
    },
    components: {
      sidebar
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .header
    position: relative
    display: flex
    background: #f2f2f2
    line-height: 44px
    text-align: center
    color: #9B9B9B
    padding: 0 8px
    box-sizing: border-box
    .left
      flex: 30px 0 0
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 10px
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
      flex: 0 0 50px
      font-size: 14px
      i
        font-size: 18px
        color: #666
  .sortbar-wrapper
    position: relative
    display: flex
    width: 100%
    height: 44px
    line-height: 44px
    border-1px(rgba(7, 17, 27, 0.1))
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
    position: fixed
    top: 88px
    bottom: 50px
    left: 0
    right: 0
    z-index: 8
    overflow: hidden
    .productlist
      position: relative
      display: flex
      flex-wrap: wrap
      .product-item
        width: 50%
        float: left
        padding: 0 5px 10px 5px
        box-sizing: border-box
        .product-thumbnail
          position: relative
          height: 0
          padding-top: 100%
          overflow: hidden
          background: #f2f2f7
          img
            position: absolute
            width: 100%
            height: auto
            left: 0
            top: 0
            vertical-align: top
        .product-title
          overflow: hidden
          display: -webkit-box
          color: #666
          font-size: 14px
          height: 38px
          line-height: 1.3
          white-space: normal
          word-break: break-all
          text-overflow: ellipsis
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
        .product-price
          margin-top: 8px
          font-size: 14px
          color: #e4393c
          .num
            font-size: 18px
            font-weight: 400
</style>
