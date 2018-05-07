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
              <div v-for="(filter, index) in filters" :key="index" v-show="filter.children.length">
                <li class="filter-item border-1px">
                  <div class="item-name">{{filter.name}}</div>
                  <div class="status" @click.stop.prevent="toggle(filter)">
                    <em>{{filter.selectText}}</em>
                    <i class="icon-arrow_up" v-show="filter.checked"></i>
                    <i class="icon-arrow_down" v-show="!filter.checked"></i>
                  </div>
                </li>
                <ul class="list" v-show="filter.level === 1 && filter.children.length" :class="{'mini': !filter.checked}">
                  <li v-for="item in filter.children" :class="{'on': item.checked}" v-if="item.name !== 'thumbnail'">
                    <span v-show="!item.val" @click.stop.prevent="checkAll(item, filter)">{{item.name}}</span>
                    <span v-if="filter.multiple && item.val" @click.stop.prevent="checkItem(item, filter)">{{item.name}}</span>
                    <span v-else-if="!filter.multiple && item.val" @click.stop.prevent="checkCategoryItem(item, filter)">{{item.name}}</span>
                  </li>
                </ul>
                <ul class="list" v-show="!filter.level && filter.children.length">
                  <li class="half" v-for="item in filter.children" :class="{'on': item.checked}"><span @click.stop.prevent="checkOnly(item, filter)">{{item.name}}</span></li>
                  <li class="half" v-show="filter.val === 'price'">
                    <span>
                      <input type="number" autocomplete=no class="min-price" v-model="form.minPrice" placeholder="最低价" @change.stop.prevent="inputPrice(filter)" /><em>-</em>
                      <input type="number" autocomplete=no class="max-price" v-model="form.maxPrice" placeholder="最高价" @change.stop.prevent="inputPrice(filter)" />
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
  import api from '@/api/api';
  export default {
    data() {
      return {
        filters: [
          {
            name: '分类',
            val: 'categoryParentName',
            checked: false,
            selectText: '全部展开',
            multiple: false,
            level: 1,
            children: []
          },
          {
            name: '子分类',
            val: 'categoryName',
            checked: false,
            selectText: '全部展开',
            multiple: true,
            level: 1,
            children: []
          },
          {
            name: '价格',
            val: 'price',
            checked: false,
            selectText: '全部展开',
            multiple: false,
            children: [
              {name: '全部', val: '0', checked: false},
              {name: '¥1000以下', val: '0-1000', checked: false},
              {name: '¥1000 - ¥2000', val: '1001-2000', checked: false},
              {name: '¥2000 - ¥5000', val: '2001-5000', checked: false},
              {name: '¥5000 - ¥10000', val: '5000-10000', checked: false},
              {name: '¥10000以上', val: '10000-', checked: false}
            ]
          },
          {
            name: '上架时间',
            val: 'shelfTime',
            checked: false,
            selectText: '全部展开',
            multiple: false,
            children: [
              {name: '全部', val: '', checked: false},
              {name: '两周', val: '0.5', checked: false},
              {name: '一月', val: '1', checked: false},
              {name: '二月', val: '2', checked: false},
              {name: '三月', val: '3', checked: false},
              {name: '半年', val: '6', checked: false}
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
      api.GetConfigList('cms/basedata/tea/type').then(response => {
        let items = [{name: '全部', val: '', checked: false}];
        response.childrens.forEach(item => {
          items.push({id: item.id, name: item.value, val: item.propertyName, checked: false, children: item.childrens});
        });
        this.filters[0].children = items;
      });
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
      },
      checkAll(item, parent) {
        item.checked = true;
        let checkedList = [];
        let categoryList = [];
        if (parent.val === 'categoryParentName') {
          this.filters[1].children = [];
        }
        parent.children.forEach((child) => {
          if (child.val !== item.val && child.checked) {
            child.checked = false;
          }
        });
        parent.selectText = checkedList.join(',');
        this.form[parent.val] = categoryList.join(',');
        if (parent.val === 'categoryName') {
          this.form.keyword = parent.selectText === '全部' ? '' : parent.selectText;
        } else if (parent.val === 'categoryParentName') {
          this.form.parentKeyword = parent.selectText === '全部' ? '' : parent.selectText;
        }
        if (!parent.selectText) {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }
      },
      checkItem(item, parent) {
        item.checked = !item.checked;
        let checkedList = [];
        let categoryList = [];
        parent.children.forEach((child) => {
          if (child.val === '') {
            child.checked = false;
          }
          if (child.checked) {
            checkedList.push(child.name);
            categoryList.push(child.val);
          }
        });
        parent.selectText = checkedList.join(',');
        this.form[parent.val] = categoryList.join(',');
        if (parent.val === 'categoryName') {
          this.form.keyword = parent.selectText === '全部' ? '' : parent.selectText;
        } else if (parent.val === 'categoryParentName') {
          this.form.parentKeyword = parent.selectText === '全部' ? '' : parent.selectText;
        }
        if (!parent.selectText) {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }

        // 显示二级分类
        if (item.checked && item.children && item.children.length) {
          let items = [];
          item.children.forEach(node => {
            items.push({id: node.id, name: node.value, val: node.propertyName, checked: false});
          });
          /* if (this.filters[1].children.length) {
            Array.prototype.push.apply(this.filters[1].children, items);
          } else {
            items.splice(0, 0, {name: '全部', val: '', checked: false});
            this.filters[1].children = items;
          } */
          items.splice(0, 0, {name: '全部', val: '', checked: false});
          this.filters[1].children = items;
        } else if (!item.checked && item.children && item.children.length) {
          let items = this.filters[1].children;
          item.children.forEach(o => {
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === o.id) {
                items.splice(i, 1);
              }
            }
          });
          this.filters[1].children = items;
        } else if (!item.val || !parent.val) {
          this.filters[1].children = [];
        }
      },
      checkCategoryItem(item, parent) {
        item.checked = !item.checked;
        let checkedList = [];
        let categoryList = [];
        parent.children.forEach((child) => {
          if (child.checked && child.val !== item.val) {
            child.checked = false;
          }
        });
        if (item.checked) {
          checkedList.push(item.name);
          categoryList.push(item.val);
        }
        parent.selectText = checkedList.join(',');
        this.form[parent.val] = categoryList.join(',');
        if (parent.val === 'categoryName') {
          this.form.keyword = parent.selectText === '全部' ? '' : parent.selectText;
        } else if (parent.val === 'categoryParentName') {
          this.form.parentKeyword = parent.selectText === '全部' ? '' : parent.selectText;
        }
        if (!parent.selectText) {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }

        // 显示二级分类
        if (item.checked && item.children && item.children.length) {
          let items = [];
          item.children.forEach(node => {
            items.push({id: node.id, name: node.value, val: node.propertyName, checked: false});
          });
          items.splice(0, 0, {name: '全部', val: '', checked: false});
          this.filters[1].children = items;
        } else if (!item.checked && item.children && item.children.length) {
          let items = this.filters[1].children;
          item.children.forEach(o => {
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === o.id) {
                items.splice(i, 1);
              }
            }
          });
          this.filters[1].children = items;
        } else if (!item.val || !parent.val) {
          this.filters[1].children = [];
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
          this.form[parent.val] = item.val;
        } else {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }
        this.form.minPrice = this.form.maxPrice = '';
      },
      inputPrice(parent) {
        parent.children.forEach((child) => {
          child.checked = false;
        });
        if (this.form.minPrice || this.form.maxPrice) {
          parent.selectText = this.form.minPrice + '-' + this.form.maxPrice;
        } else {
          parent.selectText = parent.checked ? '全部收起' : '全部展开';
        }
      },
      hideSidebar() {
        this.$store.commit('HIDE_SIDEBAR');
      },
      reset() {
        this.filters.forEach(item => {
          item.checked = false;
          item.selectText = '全部展开';
          item.children.forEach(child => {
            child.checked = false;
          });
        });
        this.form = {};
        this.$emit('fireReset');
        this.$store.commit('HIDE_SIDEBAR');
      },
      clearForm() {
        this.form.minPrice = this.form.maxPrice = '';
        this.filters.forEach(item => {
          item.checked = false;
          item.selectText = '全部展开';
          item.children.forEach(child => {
            child.checked = false;
          });
        });
        this.form = {};
      },
      ok() {
        if (this.form.minPrice || this.form.maxPrice) {
          this.price = (this.form.minPrice || 0) + '-' + (this.maxPrice || '');
        }
        this.$emit('fireAction');
        this.$store.commit('HIDE_SIDEBAR');
      },
      getFormValue() {
        return this.form;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .mask
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 20
    background: rgba(0, 0, 0, 0.75)
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
       bottom: 44px
       width: 100%
       z-index: 18
       overflow-y: auto
       overflow-x: hidden
       .filter
        position: relative
        display: block
        width: 100%
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
          font-size: 13px
          padding: 8px 0 10px 10px
          box-sizing: border-box
          overflow: hidden
          &.mini
            max-height: 102px
            height: auto
          li
            display: block
            width: 33.3333%
            padding-right: 9px
            padding-bottom: 9px
            box-sizing: border-box
            &.half
              width: 50%
            span
              display: block
              border-radius: 0
              text-align: left
              background: #F1F2F6
              color: #666
              height: 36px
              line-height: 36px
              padding: 0 8px
              border: 1px solid transparent
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              border-sizing: border-box
            &.on span
              color: #ff463c
        .min-price, .max-price
          height: 100%
          width: 45%
          background-color: transparent
          text-align: center
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
        height: 44px
        line-height: 44px
        .ops-button
          display: flex
          width: 100%
          height: 100%
          .button
            flex: 1
            text-align: center
            &.reset
              color: #666
            &.ok
              background-color: #fb4741
              color: #fff
</style>
