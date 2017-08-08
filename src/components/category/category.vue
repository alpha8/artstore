<template>
  <div>
    <fixedheader title="商品分类"></fixedheader>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :class="{'current': item.id===good.id}" @click.stop.prevent="selectMenu(index)">
            <span class="text border-1px">{{item.value}}</span>
          </li>
        </ul>
      </div>
      <div class="goods-wrapper" ref="goodsWrapper">
        <ul>
          <li class="good-list good-list-hook">
            <ul class="itemList">
              <li v-for="good in good.childrens" :class="typeStatus(good.status)">
                <router-link :to="{path: '/search', query: {cat: good.propertyName, key: good.value}}" class="good-item">
                  <!-- <div class="icon" v-show="good.desc">
                    <i :class="good.desc"></i>
                  </div> -->
                  <div class="content">
                    <h2 class="name">{{good.value}}<em>({{good.count || 0}})</em></h2>
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
  import api from '@/api/api';

  export default {
    data() {
      return {
        goods: [],
        good: {},
        heightArr: [],
        scrollY: 0,
        teaTotal: {}
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
      api.getTeaTotal().then(res => {
        let typeTotal = res.teatype;
        let totalPivot = {};
        typeTotal.forEach(type => {
          for (let key in type) {
            totalPivot[key] = {};
            let item = type[key];
            if (item.length) {
              item.forEach(o => {
                totalPivot[key][o.name] = o.count || 0;
              });
            }
          }
        });
        this.teaTotal = totalPivot;

        api.GetCategories().then((response) => {
          this.goods = response.childrens;
          this.goods.forEach(good => {
            let lv2Category = good.childrens;
            if (lv2Category.length) {
              lv2Category.forEach(inner => {
                try {
                  let count = this.teaTotal[good.propertyName] && this.teaTotal[good.propertyName][inner.propertyName];
                  inner.count = count || 0;
                } catch (e) {
                  console.log(e);
                }
              });
            }
          });
          if (this.goods.length) {
            this.good = this.goods[0];
          }
          this._initScroll();
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
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
        if (last === 2 && status === last) {
          this.lastCol = 0;
          return 'type' + status + 'delta';
        }
        this.lastCol = status;
        return 'type' + status;
      },
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
          overflow: hidden
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          clear: both
          &.type0
            width: 50%
          &.type1
            width: 100%
          &.type2
            width: 33.3%
          &.type2delta
            width: 66.6%
          &.type3
            width: 33.3%
          .good-item
            display: inline-block
            width: 100%
            padding: 15px 10px
            text-align: left
            border-1px(rgba(7, 17, 27, 0.1))
            color: #00bb9c
            box-sizing: border-box
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
                word-wrap: break-word
                word-break: break-all
                text-overflow: ellipsis
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
                em
                  display: block
                  font-size: 8px
</style>
