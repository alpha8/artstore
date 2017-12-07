<template>
  <div class="header border-bottom-1px">
    <div class="left" v-show="showBack">
      <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
    </div>
    <h2 class="title">{{title}}</h2>
    <div class="right" v-show="!rightIcon"></div>
    <div class="right" v-show="rightIcon" @click.stop.prevent="toggle">
      <i :class="rightIcon" v-show="!toggleFlag"></i>
      <i class="icon-close" v-show="toggleFlag"></i>
    </div>
    <nav class="nav" v-show="toggleFlag" :class="{'active': toggleFlag}">
      <ul>
        <li v-for="item in items">
          <router-link :to="item.link">
            <i class="icon" :class="item.icon"></i>
            <span class="text">{{item.text}}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      rightIcon: {
        type: String,
        default: ''
      },
      rightLink: {
        type: String,
        default: ''
      },
      showBack: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        toggleFlag: false,
        items: [{
          link: '/home', icon: 'icon-home', text: '首页'
        }, {
          link: '/search', icon: 'icon-search', text: '搜索'
        }, {
          link: '/category', icon: 'icon-classify', text: '分类'
        }, {
          link: '/cart', icon: 'icon-cart', text: '购物车'
        }, {
          link: '/my', icon: 'icon-user2', text: '个人中心'
        }]
      };
    },
    activated() {
      this.hide();
    },
    methods: {
      toggle() {
        this.toggleFlag = !this.toggleFlag;
      },
      hide() {
        this.toggleFlag = false;
      },
      back() {
        if (window.history.length <= 1) {
          this.$router.push('/home');
        } else {
          this.$router.back();
        }
      }
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
    .left
      flex: 30px 0 0
      padding-left: 8px
      i
        font-size: 18px
    .title
      flex: 1
      color: #666
    .right
      flex: 0 0 30px
      padding-right: 8px
      i
        font-size: 18px
        color: #666
      .icon-close
        color: #fb4741
        font-size: 20px
        font-weight: 700
    .nav
      position: absolute
      left: 0
      right: 0
      top: 44px
      z-index: 99
      background: #f1f1f1
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      &.active
        border-bottom: 1px solid #d8d8d8
      ul
        display: flex
        padding: 8px 0
        li
          flex: 1
          .icon
            display: block
            line-height: 1
            padding-bottom: 3px
            font-size: 20px
          .text
            display: block
            line-height: 1
            font-size: 12px
</style>

