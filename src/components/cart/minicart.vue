<template>
  <div>
    <div class="shopcart" @click.stop.prevent="toggleList">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0, 'animate-shake': flash}">
              <span class="icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">{{totalPrice | currency}}</div>
          <div class="desc" v-if="isAvailable">首单特惠限购{{maxItems}}件</div>
          <div class="desc" v-else>非首单购买</div>
        </div>
        <div class="content-right" v-if="isAvailable" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
        <div class="content-right" v-else>
          <div class="pay">已参加</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">已选商品：</h1>
            <span class="empty" @click.stop.prevent="empty"><span class="icon-recycle"></span> 清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="good in selectGoods">
                <span class="name">{{good.name}}</span>
                <div class="price">
                  <span>{{good.price * good.count | currency}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addGood" :good="good" :maxCount="1" :stock="good.stock" @refresh="reloadItems"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click.stop.prevent="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';

  export default {
    props: {
      selectGoods: {
        type: Array,
        default() {
          return [];
        }
      },
      maxItems: {
        type: Number,
        default: 0
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        fold: true,
        flash: false  /** LOGO动画 */
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        if (!this.isAvailable) {
          return total;
        }
        this.selectGoods.forEach((good) => {
          total += good.price * good.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        if (!this.isAvailable) {
          return count;
        }
        this.selectGoods.forEach((good) => {
          count += good.count;
        });
        return count;
      },
      payDesc() {
        if (this.selectGoods.length > this.maxItems) {
          return `限购${this.maxItems}件`;
        } else if (this.totalPrice <= 0) {
          return `请选购`;
        } else {
          return `结算`;
        }
      },
      payClass() {
        if (this.totalPrice <= 0 || this.selectGoods.length > this.maxItems) {
          return 'inactivate';
        } else {
          return 'activated';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      empty() {
        this.selectGoods.forEach((good) => {
          good.count = 0;
        });
        this.$store.dispatch('removeSameTypeGoods', this.selectGoods);
        this.$emit('fireEmpty');
      },
      pay() {
        if (this.totalPrice <= 0 || this.selectGoods.length > this.maxItems) {
          return;
        }
        this.$store.dispatch('addPayGoods', this.selectGoods);
        // window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=7';
        window.location.href = 'http://' + location.host + '/weixin/pay?orderType=7';
      },
      addGood(target) {
        this.drop(target);
        this.reloadItems();
      },
      reloadItems(target) {
        this.$emit('fireReload', target);
      },
      drop(el) {
        this.flash = true;
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        };
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          if (el.addEventListener) {
            el.addEventListener('transitionend', done, false);
          } else if (el.attachEvent) {
            el.attachEvent('transitionend', done);
            el.attachEvent('onTransitionend', done);
          }
          setTimeout(() => {
            this.flash = false;
            this.afterDrop(el);
          }, 450);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: rgba(61,61,63,1)
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: rgba(61,61,63,0.9)
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            will-change: transform
            &.highlight
              background: rgb(0, 160, 220)
              >.icon-shopping_cart
                color: #fff
            &.animate-shake
              animation:animate-shake .5s ease-in-out
              @keyframes animate-shake{
                0%{-webkit-transform:scale(1);transform:scale(1)}
                25%{-webkit-transform:scale(.8);transform:scale(.8)}
                50%{-webkit-transform:scale(1.1);transform:scale(1.1)}
                75%{-webkit-transform:scale(.9);transform:scale(.9)}
                to{-webkit-transform:scale(1);transform:scale(1)}
              }
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
          .num
            position: absolute
            top: 0
            right: -6px
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 13px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 13px
          font-weight: 700
          background: #444
          &.activated
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        padding: 12px 10px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        box-sizing: border-box
        .title
          float: left
          font-size: 15px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 13px
          color: rgb(7, 17, 27)
          .icon-recycle
            display: inline-block
            vertical-align: bottom
      .list-content
        padding: 0 10px 20px
        max-height: 217px
        min-height: 130px
        background: #fff
        overflow: hidden
        .food
          position: relative
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          display: flex
          padding: 4px 0
          .name
            flex: 7.5
            font-size: 14px
            height: 40px
            line-height: 40px
            color: rgb(7, 17, 27)
            overflow: hidden
            display: -webkit-box
            word-wrap: break-word
            word-break: break-all
            text-overflow: ellipsis
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
          .price
            flex: 1.5
            height: 40px
            line-height: 40px
            font-size: 16px
            font-weight: 700
            color: rgb(240, 20, 20)
            text-align: center
          .cartcontrol-wrapper
            flex: 3
            height: 40px
            line-height: 40px
            margin-top: 2px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    transition: all 0.5s
    background: rgba(7, 17, 27, 0.6)
    backdrop-filter: blur(10px)
    &.fade-transition
      transition: all 0.5s
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)

</style>
