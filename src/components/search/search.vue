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
            <img :src="product.img" />
          </div>
          <div class="product-info">
            <div class="product-title">{{product.name}}</div>
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
          { id: '10001', name: '大宋官窑-梅花盖碗钧瓷梅花  手抓壶盖碗茶杯三才碗功夫茶', price: 390.00, img: 'http://img3x6.ddimg.cn/14/23/1384884086-1_h_3.jpg' },
          { id: '10002', name: '大宋官窑-小斗笠碗钧瓷斗笠  茶杯小茶盏窑变主人杯功夫茶', price: 360.00, img: 'http://img3x6.ddimg.cn/30/32/1384885686-1_h_3.jpg' },
          { id: '10003', name: '手绘龙泉青瓷家用带盖主人喝茶杯子办公室会议水杯陶瓷个人泡茶杯', price: 79.00, img: 'http://img3x0.ddimg.cn/67/30/1019563150-1_h_2.jpg' },
          { id: '10004', name: '手绘龙泉青瓷家用带盖主人喝茶杯子办公室会议水杯陶瓷个人泡茶杯', price: 79.00, img: 'http://img3x0.ddimg.cn/67/30/1019563150-1_h_2.jpg' },
          { id: '10005', name: '手绘龙泉青瓷家用带盖主人喝茶杯子办公室会议水杯陶瓷个人泡茶杯', price: 79.00, img: 'http://img3x0.ddimg.cn/67/30/1019563150-1_h_2.jpg' },
          { id: '10006', name: '手绘龙泉青瓷家用带盖主人喝茶杯子办公室会议水杯陶瓷个人泡茶杯', price: 79.00, img: 'http://img3x0.ddimg.cn/67/30/1019563150-1_h_2.jpg' },
          { id: '10007', name: '手绘龙泉青瓷家用带盖主人喝茶杯子办公室会议水杯陶瓷个人泡茶杯', price: 79.00, img: 'http://img3x0.ddimg.cn/67/30/1019563150-1_h_2.jpg' }
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
          background: url(/static/images/close.png) no-repeat
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
