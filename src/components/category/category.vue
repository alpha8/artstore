<template>
  <div>
    <fixedheader title="商品分类" right-icon="icon-more"></fixedheader>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{'active': item.id===good.id}" @click.stop.prevent="selectMenu(index)" :key="item.id">
            <span class="text">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="goods-wrapper" ref="goodsWrapper">
        <div>
          <div class="banner" v-if="sliders.length">
            <swipe :swiperSlides="sliders"></swipe>
          </div>
          <ul>
            <li class="good-list good-list-hook">
              <ul class="itemList" v-if="good.children && good.children.length">
                <li v-for="innergood in good.children" :key="innergood.id" class="type3">
                  <router-link :to="{path: '/search'}" class="good-item" :class="{'thumbnail': innergood.icon}">
                    <div class="icon" v-if="innergood.icon">
                      <img :src="getCategoryIcon(innergood.icon)" border="0"/>
                    </div>
                    <div class="name">{{innergood.name}}</div>
                  </router-link>
                </li>
              </ul>
              <div class="nomore" v-else>正在疯狂上新中...</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import swipe from '@/components/swipe/minisliders';
  import api from '@/api/api';

  export default {
    data() {
      return {
        goods: [],
        good: {},
        heightArr: [],
        scrollY: 0,
        teaTotal: {},
        sliders: []
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
    created() {
      this.$store.dispatch('openLoading');
      api.GetCategories().then((response) => {
        this.goods = response.data;
        if (this.goods && this.goods.length) {
          this.good = this.goods[0];
        }
        this._initScroll();
        this.$store.dispatch('closeLoading');
      }).catch(response => {
        this.$store.dispatch('closeLoading');
      });
    },
    updated() {
      this._initScroll();
    },
    activated() {
      this._initScroll();
    },
    methods: {
      typeStatus(status) {
        let last = this.lastCol;
        /** 特殊处理，有缩略图的一行显示2个的分类，第一个分类占66%， 第二个33% */
        if (last === 22 && status === last) {
          this.lastCol = 0;
          return 'type2';
        } else if (status === 22) {
          this.lastCol = status;
          return 'type2delta';
        }
        if (last === 2 && status === last) {
          this.lastCol = 0;
          return 'type' + status + 'delta';
        }
        this.lastCol = status;
        return 'type' + status;
      },
      selectMenu(index) {
        this.good = this.goods[index];
        this.sliders.splice(0, this.sliders.length);
        if (this.good.icon) {
          this.sliders.push({'thumbnail': `${this.good.icon}?imageView2/2/w/750/h/500`, 'src': this.good.icon});
        }
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
      getCategoryIcon(icon) {
        return icon ? `${icon}?imageView2/2/w/140/h/140` : icon;
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
      fixedheader, swipe
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";
  @require "../../common/stylus/variables";

  .goods
    display: flex
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    overflow: hidden
    .strong
      font-weight: 700
    .menu-wrapper
      position: relative
      width: 32%
      float: left
      background: $color-lightgrey
      overflow: hidden
      .menu-item
        flex: 1
        height: 45px
        line-height: 45px
        padding-left: 10px
        border-left: 4px solid transparent
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        &.active
          margin-top: -1px
          background: #fff
          font-weight: 700
          border-left: 4px solid $color-main
          color: $color-main
          .text
            border-none()
        &.twoline
          position: relative
          .text
            max-height: 40px
            min-height: 35px
          i
            height: 10px
            line-height: 10px
            display: block
            font-size: $fontsize-small-s
            color: $color-gray
        .text
          position: relative
          display: block
          width: 100%
          vertical-align: middle
          box-sizing: border-box
          font-size: $fontsize-medium-s
          word-wrap: break-word
          text-overflow: ellipsis
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          overflow: hidden
          em
            display: block
            clear: both
            font-size: $fontsize-small-s
          .highlight
            position: absolute
            width: 5px
            height: 5px
            border-radius: 50%
            background: $color-redpoint
            right: 0
            top: 2px
            z-index: 10
    .goods-wrapper
      flex: 1
      padding-top: 10px
      background-color: #fff
      .banner
        position: relative
        margin-top: -10px
        padding: 0 2px 5px
        box-sizing: border-box
      .title
        padding-left: 10px
        height: 40px
        line-height: 40px
        font-size: $fontsize-small
        color: #333
        background: $color-lightgray
        border-1px(rgba(7, 17, 27, 0.1))
      .item-footer
        position: relative
        width: 100%
        padding: 14px 0 10px 0
        text-align: center
        color: $color-gray
        font-size: $fontsize-small
        box-sizing: border-box
      .itemList
        display: flex
        flex-wrap: wrap
        width: 100%
        background-color: #fff
        >li
          position: relative
          width: 50%
          height: auto
          overflow: hidden
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          clear: both
          &.type0
            width: 50%
            float: left
          &.type1
            width: 100%
          &.type2
            width: 33.3%
            float: left
          &.type2delta
            width: 66.6%
            float: left
          &.type3
            width: 32.8%
            float: left
          .good-item
            display: inline-block
            width: 100%
            padding: 15px 10px
            text-align: center
            border-1px(rgba(7, 17, 27, 0.1))
            color: #00bb9c
            box-sizing: border-box
            &:last-child
              border-none()
              margin-bottom: 0
            &.thumbnail
              padding: 0
              vertical-align: middle
              .icon
                font-size: $fontsize-small
                overflow: hidden
              img
                width: 70px
                height: 70px
                box-sizing: border-box
            .icon
              display: block
            .name
              position: relative
              display: block
              line-height: 1.2
              font-size: $fontsize-medium-s
              color: $color-dark
              white-space: nowrap
              word-wrap: break-word
              word-break: break-all
              text-overflow: ellipsis
              -webkit-line-clamp: 1
              -webkit-box-orient: vertical
              box-sizing: border-box
              text-align: center
              height: 35px;
              margin-top: 2px;
              -webkit-box-pack: start;
    .nomore
      line-height: 25px
      height: 25px
      text-align: center
      font-size: 14px
      color: #999
</style>
