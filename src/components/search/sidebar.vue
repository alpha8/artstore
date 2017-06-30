<template>
  <div class="sidebar-wrapper">
    <div class="mask" v-show="showMask"></div>
    <transition name="move">
      <div class="sidebar" v-show="showSidebar">
        <section class="filterBox">
          <div class="title border-1px">
            <i class="icon-close" @click.stop.prevent="hideSidebar"></i>
            <span>筛选</span>
          </div>
          <div class="filter-wrapper" ref="filter">
            <ul class="filter">
              <div v-for="(filter, index) in filters" key="index">
                <li class="filter-item border-1px">
                  <div class="item-name">{{filter.name}}</div>
                  <div class="status" @click.stop.prevent="toggle(filter)">
                    <em>{{filter.selectText}}</em>
                    <i class="icon-arrow_up" v-show="filter.checked"></i>
                    <i class="icon-arrow_down" v-show="!filter.checked"></i>
                  </div>
                </li>
                <ul class="list" v-show="filter.multiple && filter.children" :class="{'mini': !filter.checked}">
                  <li v-for="item in filter.children" :class="{'on': item.checked}"><span @click.stop.prevent="checkItem(item, filter)">{{item.name}}</span></li>
                </ul>
                <ul class="list" v-show="!filter.multiple && filter.children">
                  <li class="half" v-for="item in filter.children" :class="{'on': item.checked}"><span @click.stop.prevent="checkOnly(item, filter)">{{item.name}}</span></li>
                  <li class="half" v-show="filter.val === 'price'">
                    <span>
                      <input type="number" autocomplete=no class="min-price" v-model="form.minPrice" placeholder="最低价" /><em>-</em>
                      <input type="number" autocomplete=no class="max-price" v-model="form.maxPrice" placeholder="最高价" />
                    </span>
                  </li>
                </ul>
              </div>
            </ul>
          </div>
          <div class="bottom">
            <div class="ops-button">
              <div class="button reset" @click.stop.prevent="reset">重置</div>
              <div class="button ok" @click.stop.prevent="ok">确定</div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        filters: [
          {
            name: '分类',
            val: 'category',
            checked: false,
            selectText: '全部展开',
            multiple: true,
            children: [
              {name: '全部', val: '', checked: false},
              {name: '茶具配件', val: '', checked: false},
              {name: '整套茶具', val: '', checked: false},
              {name: '茶盘茶托', val: '', checked: false},
              {name: '茶宠摆件', val: '', checked: false},
              {name: '茶杯', val: '', checked: false},
              {name: '茶叶罐', val: '', checked: false},
              {name: '茶壶', val: '', checked: false},
              {name: '其他', val: '', checked: false}
            ]
          },
          {
            name: '品牌',
            val: 'brand',
            checked: false,
            selectText: '全部展开',
            multiple: true,
            children: [
              {name: '金灶 (KAMJOVE)', val: '', checked: false},
              {name: '容山堂', val: '', checked: false},
              {name: '唐丰 (TANGFENG)', val: '', checked: false},
              {name: '品茶忆友', val: '', checked: false},
              {name: '汉唐', val: '', checked: false},
              {name: '三界', val: '', checked: false},
              {name: '梅兰竹菊', val: '', checked: false},
              {name: '友茗堂', val: '', checked: false},
              {name: '龍阡堂 (longqiantang)', val: '', checked: false}
            ]
          },
          {
            name: '价格',
            val: 'price',
            checked: false,
            selectText: '全部展开',
            multiple: false,
            children: [
              {name: '¥1000以下', val: '', checked: false},
              {name: '¥1000 - ¥2000', val: '', checked: false},
              {name: '¥2000 - ¥5000', val: '', checked: false},
              {name: '¥5000 - ¥10000', val: '', checked: false},
              {name: '¥10000以上', val: '', checked: false}
            ]
          }
        ],
        form: {
          minPrice: '',
          maxPrice: ''
        }
      };
    },
    created() {
      this._initScroll();
    },
    mounted() {
      this._initScroll();
    },
    computed: {
      showSidebar() {
        return this.$store.state.showSidebar;
      },
      showMask() {
        return this.$store.state.showSidebarMask;
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.filter, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      toggle(item) {
        item.checked = !item.checked;
        if (item.selectText === '全部收起' || item.selectText === '全部展开') {
          if (item.checked) {
            item.selectText = '全部收起';
          } else {
            item.selectText = '全部展开';
          }
        }
        this.scroll.refresh();
      },
      checkItem(item, parent) {
        item.checked = !item.checked;
        let checkedList = [];
        parent.children.forEach((child) => {
          if (child.checked) {
            checkedList.push(child.name);
          }
        });
        parent.selectText = checkedList.join(',');
        if (!parent.selectText) {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }
      },
      checkOnly(item, parent) {
        parent.children.forEach((child) => {
          if (child.checked && child.name !== item.name) {
            child.checked = false;
          }
        });
        item.checked = !item.checked;
        if (item.checked) {
          parent.selectText = item.name;
        } else {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }
      },
      hideSidebar() {
        this.$store.commit('HIDE_SIDEBAR');
      },
      reset() {
        this.$store.commit('HIDE_SIDEBAR');
      },
      ok() {
        this.$store.commit('HIDE_SIDEBAR');
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .mask
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 18
    background: rgba(0, 0, 0, 0.5)
  .sidebar
    position: fixed
    right: 0
    top: 0
    width: 20rem
    height: 100%
    z-index: 20
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s ease-out
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .filterBox
      position: relative
      width: 100%
      height: 100%
      overflow: hidden
      background-color: #fff
      .filter-wrapper
       position: absolute
       top: 44px
       bottom: 50px
       left: 0
       right: 0
       z-index: 18
       overflow: hidden
       .filter
        display: block
        width: 100%
        overflow: hidden
        .filter-item
          padding: 10px 10px 10px 15px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 14px
          height: 20px
          line-height: 20px
          .item-name
            float: left
          .status
            float: right
            position: relative
            max-width: 80%
            color: #6f6f6f
            em
              display: block
              padding-right: 20px
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
            i
              position: absolute
              display: block
              float: right
              top: 3px
              right: 0
              width: 15px
              height: auto
        .list
          position: relative
          display: flex
          flex-wrap: wrap
          clear: both
          width: 100%
          height: auto
          max-height: none
          font-size: 14px
          padding: 10px
          box-sizing: border-box
          overflow: hidden
          &.mini
            max-height: 106px
            height: auto
          li
            display: block
            width: 33.3333%
            padding-right: 10px
            padding-bottom: 12px
            box-sizing: border-box
            &.half
              width: 50%
            span
              display: block
              border-radius: 5px
              text-align: center
              background: #f5f5f5
              color: #323232
              height: 36px
              line-height: 36px
              padding: 0 8px
              border: 1px solid transparent
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              border-sizing: border-box
            &.on span
              border: 1px solid #ff463c
              background: url(../../common/images/box-checked.png) transparent right bottom no-repeat
              background-size: 15px
              color: #ff463c
        .min-price, .max-price
          height: 100%
          width: 45%
          background-color: transparent
      .title
        height: 44px
        line-height: 44px
        background: #fcfcfc
        border-1px(rgba(7, 17, 27,0.1))
        i
          position: absolute
          top: 50%
          left: 10px
          width: 25px
          height: 25px
          font-size: 25px
          margin-top: -11px
        span
          display: block
          width: 100%
          text-align: center
      .bottom
        position: absolute
        bottom: 0
        left: 0
        right: 0
        height: 50px
        .ops-button
          display: flex
          width: 100%
          height: 100%
          line-height: 50px
          .button
            flex: 1
            text-align: center
            &.reset
              color: #666
            &.ok
              background-color: #fb4741
              color: #fff
</style>
