<template>
  <div>
    <fixedheader title="商品分类" right-icon="icon-more"></fixedheader>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{'active': item.id===good.id, 'twoline': item.desc}" @click.stop.prevent="selectMenu(index)">
            <span class="text"><span :class="{'strong': item.css === 'strong'}">{{item.value}}<i v-if="item.css && item.css !== 'strong'" :class="item.css"></i></span><em>({{item.count || 0}})</em></span>
            <i v-if="item.desc">{{item.desc}}</i>
          </li>
        </ul>
      </div>
      <div class="goods-wrapper" ref="goodsWrapper">
        <div class="banner" v-if="sliders.length">
          <swipe :swiperSlides="sliders"></swipe>
        </div>
        <ul>
          <li class="good-list good-list-hook">
            <ul class="itemList" v-if="good.childrens && good.childrens[0].childrens && !good.childrens[0].childrens.length">
              <li v-for="innergood in good.childrens" :class="typeStatus(innergood.status)" v-if="!innergood.hide">
                <router-link :to="{path: '/search', query: {cat: dummyKey(innergood.propertyName), key: (innergood.value === 'thumbnail' ? innergood.desc : innergood.value)}}" class="good-item" :class="{'thumbnail': innergood.value === 'thumbnail'}">
                  <div class="icon" v-if="innergood.value==='thumbnail'">
                    <img :src="innergood.css" border="0" />
                  </div>
                  <div class="content" v-if="innergood.value!=='thumbnail'">
                    <h2 class="name" :class="{'strong': innergood.css === 'strong'}">
                    <span v-if="containsDot(innergood.value)">{{beforeDot(innergood.value)}}<span class="dot">{{afterDot(innergood.value)}}</span></span>
                    <span v-if="!containsDot(innergood.value)">{{innergood.value}}</span>
                    <i v-if="innergood.css" :class="innergood.css"></i><em>({{innergood.count || 0}})</em></h2>
                  </div>
                </router-link>
              </li>
            </ul>
            <div v-if="innergood && innergood.childrens.length && innergood.propertyName !== 'banner'" v-for="innergood in good.childrens">
              <h1 class="title border-1px">{{innergood.value}}</h1>
              <ul class="itemList">
                <li v-for="item in innergood.childrens" :class="typeStatus(item.status)" v-if="!item.hide && good.propertyName === 'art'">
                  <router-link :to="{path: '/search', query: {ck: innergood.propertyName, cv: dummyKey(item.propertyName), parentCat: 'art', key: (item.value === 'thumbnail' ? item.desc: item.value)}}" class="good-item" :class="{'thumbnail': item.value === 'thumbnail'}">
                    <div class="icon" v-if="item.value==='thumbnail'">
                      <img :src="item.css" border="0" />
                    </div>
                    <div class="content" v-if="item.value!=='thumbnail'">
                      <h2 class="name" :class="{'strong': item.css === 'strong'}">{{item.value}}<i v-if="item.css" :class="item.css"></i><em>({{item.count || 0}})</em></h2>
                    </div>
                  </router-link>
                </li>
                <li v-for="item in innergood.childrens" :class="typeStatus(item.status)" v-if="!item.hide && good.propertyName !== 'art'">
                  <router-link :to="{path: '/search', query: {sunCat: dummyKey(item.propertyName), lv1: good.propertyName, lv2: innergood.propertyName, key: (item.value === 'thumbnail' ? item.desc : item.value)}}" class="good-item" :class="{'thumbnail': item.value === 'thumbnail'}">
                    <div class="icon" v-if="item.value==='thumbnail'">
                      <img :src="item.css" border="0" />
                    </div>
                    <div class="content" v-if="item.value!=='thumbnail'">
                      <h2 class="name">
                        <span v-if="containsDot(item.value)" :class="{'strong': item.css === 'strong'}">{{beforeDot(item.value)}}<span class="dot">{{afterDot(item.value)}}</span></span>
                        <span v-if="!containsDot(item.value)" :class="{'strong': item.css === 'strong'}">{{item.value}}</span>
                        <i v-if="item.css" :class="item.css"></i><em>({{item.count || 0}})</em>
                      </h2>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
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
      api.getTeaTotal().then(res => {
        let typeTotal = res.teatype;
        let totalPivot = {};
        typeTotal.forEach(type => {
          for (let key in type) {
            totalPivot[key] = {};
            let item = type[key];
            if (item.length) {
              let total = 0;
              item.forEach(o => {
                totalPivot[key][o.name] = o.count || 0;
                total += o.count || 0;
                let items = o.childrens;
                if (items && items.length) {
                  items.forEach(o1 => {
                    totalPivot[key][o.name + o1.name] = o1.count || 0;
                  });
                }
              });
              totalPivot[key].total = total;
            }
          }
        });
        totalPivot['artcount'] = res.artcount;
        this.teaTotal = totalPivot;

        api.GetCategories().then((response) => {
          this.goods = response.childrens;
          this.goods.forEach(good => {
            try {
              if (good.propertyName === 'art') {
                good.count = this.teaTotal['artcount'] || 0;
              } else {
                good.count = this.teaTotal[good.propertyName] && this.teaTotal[good.propertyName].total || 0;
              }
            } catch (e) {
              console.log(e);
            }
            let lv2Category = good.childrens;
            if (lv2Category.length) {
              lv2Category.forEach(inner => {
                try {
                  let count = this.teaTotal[good.propertyName] && this.teaTotal[good.propertyName][inner.propertyName];
                  inner.count = count || 0;
                  let lv3 = inner.childrens;
                  if (lv3.length) {
                    lv3.forEach(node => {
                      try {
                        let qty = this.teaTotal[good.propertyName] && this.teaTotal[good.propertyName][inner.propertyName + node.propertyName];
                        node.count = qty || 0;
                      } catch (e1) {
                        console.log(e1);
                      }
                    });
                  }
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
        this.$nextTick(() => {
          if (this.good.propertyName === 'ticket') {
            this.good.childrens.forEach(item => {
              Vue.set(item, 'hide', false);
              if (item.propertyName === 'banner') {
                item.hide = true;
              } else if (!this.show4Months(item.propertyName)) {
                item.hide = true;
              }
            });
          }
          let list = this.good.childrens;
          if (list && list.length) {
            list.forEach(item => {
              if (item.propertyName === 'banner') {
                let nodes = item.childrens;
                let sliders = [];
                nodes.forEach(node => {
                  sliders.push({'thumbnail': node.value, 'src': node.value});
                });
                this.sliders = sliders;
              }
            });
          }
          this._initScroll();
        });
      },
      selectGood(good) {
        this.selectedGood = good;
        this.$refs.goodDetail.show();
      },
      dummyKey(key) {
        if (key && key.indexOf('DUM_') > -1) {
          return key.substring(4);
        }
        return key;
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
      },
      show4Months(month) {
        let now = new Date();
        var months = [];
        for (let i = 0; i < 4; i++) {
          let m = now.getMonth() + 1;
          months.push(m);
          now.setMonth(m);
        }
        return months.find(item => item === Number(month));
      },
      containsDot(name) {
        return name && name.indexOf('.') !== -1;
      },
      beforeDot(name) {
        return name && name.substring(0, name.indexOf('.'));
      },
      afterDot(name) {
        return name && name.substring(name.indexOf('.'));
      }
    },
    components: {
      fixedheader, swipe
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
    .strong
      font-weight: 700
    .menu-wrapper
      position: relative
      width: 32%
      float: left
      background: #f3f5f7
      overflow: hidden
      .menu-item
        flex: 1
        height: 65px
        padding: 6px 5px 6px 10px
        border-left: 4px solid transparent
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        &.active
          margin-top: -1px
          background: #fff
          font-weight: 700
          border-left: 4px solid #00bb9c
          color: #00bb9c
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
            font-size: 11px
            color: #999
        .text
          position: relative
          display: block
          width: 100%
          vertical-align: middle
          font-size: 0
          box-sizing: border-box
          overflow: hidden
          span
            position: relative
            display: block
            float: left
            font-size: 13px
            word-wrap: break-word
            text-overflow: ellipsis
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            overflow: hidden
            line-height: 1.45
            max-height: 38px
            padding-right: 7px
            box-sizing: border-box
          em
            display: block
            clear: both
            font-size: 11px
          .highlight
            position: absolute
            width: 5px
            height: 5px
            border-radius: 50%
            background: #fb4741
            right: 0
            top: 2px
            z-index: 10
    .goods-wrapper
      flex: 1
      .banner
        position: relative
        padding: 0 2px 10px
        box-sizing: border-box
      .title
        padding-left: 10px
        height: 40px
        line-height: 40px
        font-size: 12px
        color: #333
        background: #f2f2f2
        border-1px(rgba(7, 17, 27, 0.1))
      .itemList
        display: flex
        flex-wrap: wrap
        width: 100%
        >li
          position: relative
          width: 50%
          height: auto
          max-height: 80px
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
            &.thumbnail
              padding: 0
              vertical-align: middle
              .icon
                font-size: 12px
                height: 60px
                overflow: hidden
              img
                height: 100%
                padding: 2px 0 3px 10px
                box-sizing: border-box
            .icon
              display: block
              font-size: 40px
            .content
              position: relative
              display: block
              .name
                position: relative
                display: block
                float: left
                line-height: 1.2
                font-size: 13px
                color: #505050
                white-space: nowrap
                word-wrap: break-word
                word-break: break-all
                text-overflow: ellipsis
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
                padding-right: 7px
                box-sizing: border-box
                .dot
                  font-size: 11px
                  color: #999
                em
                  display: block
                  clear: both
                  font-size: 11px
                .highlight
                  position: absolute
                  width: 5px
                  height: 5px
                  border-radius: 50%
                  background: #fb4741
                  right: 0
                  top: 0
                  z-index: 10
</style>
