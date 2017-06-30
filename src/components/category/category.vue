<template>
  <div>
    <fixedheader title="商品分类"></fixedheader>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :class="{'current': item.id===good.id}" @click.stop.prevent="selectMenu(index)">
            <span class="text border-1px">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="goods-wrapper" ref="goodsWrapper">
        <ul>
          <li class="good-list good-list-hook">
            <ul class="itemList">
              <li v-for="good in good.items">
                <router-link :to="{path: '/search', query: {key: good.name, cid: good.id}}" class="good-item">
                  <div class="icon" v-show="good.icon">
                    <!-- <img :src="good.icon" width="57" height="57" alt=""> -->
                    <i :class="good.icon"></i>
                  </div>
                  <div class="content">
                    <h2 class="name">{{good.name}}<em>({{good.count}})</em></h2>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  // import api from '@/api/api';
  // const ERR_OK = 0;

  export default {
    data() {
      return {
        goods: [
          {
            'id': '2000',
            'name': '茶席艺术',
            'items': [
              { 'id': '2001', 'name': '茶杯', 'icon': 'icon-hot_tea', 'count': 200 },
              { 'id': '2002', 'name': '茶壶', 'icon': 'icon-teapot', 'count': 990 },
              { 'id': '2003', 'name': '雕塑', 'icon': 'icon-teapot2', 'count': 80 },
              { 'id': '2004', 'name': '配画', 'icon': 'icon-heart', 'count': 80 },
              { 'id': '2005', 'name': '茶仓', 'icon': 'icon-kettle', 'count': 20 },
              { 'id': '2005', 'name': '火炉', 'icon': 'icon-teapot_and_cup', 'count': 10 }
            ]
          },
          {
            'id': '1000',
            'name': '精选茶',
            'items': [
              { 'id': '1001', 'name': '红茶', 'icon': 'icon-hot_tea', 'count': 20 },
              { 'id': '1002', 'name': '绿茶', 'icon': 'icon-hot_tea', 'count': 80 },
              { 'id': '1003', 'name': '乌龙茶', 'icon': 'icon-hot_tea', 'count': 1300 },
              { 'id': '1004', 'name': '普洱茶', 'icon': 'icon-hot_tea', 'count': 120 },
              { 'id': '1005', 'name': '白茶', 'icon': 'icon-hot_tea', 'count': 500 },
              { 'id': '1005', 'name': '黄茶', 'icon': 'icon-hot_tea', 'count': 800 }
            ]
          }
        ],
        good: {
            'id': '2000',
            'name': '茶席艺术',
            'items': [
              { 'id': '2001', 'name': '茶杯', 'icon': 'icon-hot_tea', 'count': 200 },
              { 'id': '2002', 'name': '茶壶', 'icon': 'icon-teapot', 'count': 990 },
              { 'id': '2003', 'name': '雕塑', 'icon': 'icon-teapot2', 'count': 80 },
              { 'id': '2004', 'name': '配画', 'icon': 'icon-heart', 'count': 80 },
              { 'id': '2005', 'name': '茶仓', 'icon': 'icon-kettle', 'count': 20 },
              { 'id': '2005', 'name': '火炉', 'icon': 'icon-teapot_and_cup', 'count': 10 }
            ]
          },
        heightArr: [],
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        let arr = this.heightArr;
        for (let i = 0; i < arr.length; i++) {
          let h = arr[i];
          let next = arr[i + 1];
          if (!next || (this.scrollY >= h && this.scrollY < next)) {
            return i;
          }
        }
        return 0;
      }
    },
    activated() {
      this._initScroll();
    },
    methods: {
      selectMenu(index) {
        this.good = this.goods[index];
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      selectGood(good) {
        this.selectedGood = good;
        this.$refs.goodDetail.show();
      },
      addFood(target) {
        this._drop(target);
      },
      _drop(target) {
      },
      _initScroll() {
        if (!this.menuScroll) {
          this.menuScroll = new BScroll(this.$refs.menuWrapper, {
            click: true
          });
          this.goodsScroll = new BScroll(this.$refs.goodsWrapper, {
            click: true,
            probeType: 3
          });
        } else {
          this.menuScroll.refresh();
          this.goodsScroll.refresh();
        }

        this.goodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calcHeight() {
        let goodList = this.$refs.goodsWrapper.getElementsByClassName('good-list-hook');
        let height = 0;
        this.heightArr.push(height);
        for (let i = 0; i < goodList.length; i++) {
          let item = goodList[i];
          height += item.clientHeight;
          this.heightArr.push(height);
        }
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .goods
    display: flex
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        border-left: 4px solid transparent
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          border-left: 4px solid #00bb9c
          color: #00bb9c
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
    .goods-wrapper
      flex: 1
      .title
        padding: 8px 0 8px 14px
        height: 26px
        line-height: 26px
        font-size: 12px
        font-weight: 700
        color: #666
        background: #f1f1f1
      .itemList
        display: flex
        flex-wrap: wrap
        width: 100%
        >li
          position: relative
          width: 50%
          height: auto
          .good-item
            display: inline-block
            width: 100%
            padding: 15px 0
            text-align: center
            border-1px(rgba(7, 17, 27, 0.1))
            color: #00bb9c
            &:last-child
              border-none()
              margin-bottom: 0
            .icon
              display: block
              font-size: 40px
            .content
              display: block
              .name
                margin: 2px 0 8px 0
                height: 14px
                line-height: 14px
                font-size: 12px
                color: rgb(7, 17, 27)
                em
                  font-size: 8px
</style>
