<template>
  <div class="fixed-foot">
    <div class="foot-wrapper">
      <router-link to="/cart" class="mini-favorite-item">
        <span class="badge" v-show="getCartAmount">{{getCartAmount}}</span>
        <span class="button-lg"><i class="icon-cart"></i></span>
      </router-link>
      <span class="mini-favorite-item" @click.stop.prevent="mark">
        <span class="button-lg"><i :class="{'icon-favorite': marked, 'icon-heart': !marked}"></i></span>
      </span>
      <div class="foot-item" v-if="good.stock && (good.stock.total > 0 || good.stock.bookTotal > 0)" @click.stop.prevent="addGood">
        <span class="button-lg red">加入购物车</span>
      </div>
      <!-- <div class="foot-item" v-if="good.stock && good.stock.total > 0" @click.stop.prevent="pay">
        <span class="button-lg red">立即购买</span>
      </div>
      <div class="foot-item" v-else-if="good.stock && good.stock.status === 1" @click.stop.prevent="bookBuy">
        <span class="button-lg red">预定购买</span>
      </div> -->
      <div class="foot-item" v-else-if="good.stock && good.stock.total <= 0 && good.stock.bookTotal <= 0">
        <span class="button-lg disable">已售磬</span>
      </div>
      <div class="foot-item" v-if="good.stock && good.stock.total <= 0 && good.stock.bookTotal <= 0" @click.stop.prevent="bookNotify">
        <span class="button-lg red">到货提醒</span>
      </div>
      <div class="foot-item btn-share" v-else @click.stop.prevent="wxshare">
        <span class="button-lg orange">分享有礼</span>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  export default {
    props: {
      good: {
        type: Object
      }
    },
    data() {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        marked: false
      };
    },
    computed: {
      getCartAmount() {
        return this.$store.getters.getCartAmount;
      }
    },
    watch: {
      'good'() {
        this._initMarkState();
      }
    },
    activated() {
      this._initMarkState();
    },
    deactivated() {
      this.marked = false;
    },
    methods: {
      _initMarkState() {
        let uid = this.$store.getters.getUserInfo.userId;
        let ids = this.good && this.good.collected || [];
        let flag = false;
        for (let i = 0; i < ids.length; i++) {
          if (uid === ids[i]) {
            flag = true;
          }
        }
        this.marked = flag;
      },
      addGood() {
        this.$emit('add', event.target);
      },
      pay() {
        if (!this.good.count) {
          this.$emit('add');
        }
        let good = {
          id: this.good.id,
          name: this.good.name,
          pictures: this.good.pictures,
          src: this.good.src,
          content: this.good.content,
          price: this.good.price,
          oldPrice: this.good.oldPrice,
          count: this.good.count,
          icon: (this.good.pictures && this.good.pictures.length) ? api.CONFIG.psCtx + this.good.pictures[0].id + '?w=750&h=500' : api.CONFIG.defaultImg,
          checked: false
        };
        this.$store.dispatch('addPayGoods', [good]);
        // this.$router.push('/pay');
        window.location.href = 'http://' + location.host + location.pathname + '#/pay';
      },
      bookBuy() {
        this.pay();
      },
      wxshare() {
        this.$emit('share');
      },
      bookNotify() {
        let openid = this.$store.getters.getUserInfo.openid;
        api.arrivalNotify({
          id: this.good.id,
          openid: openid
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '设置成功, 请留意微信通知！');
          } else {
            this.$store.dispatch('openToast', '网络太忙了，请稍候再来吧！');
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络太忙了，请稍候再来吧！');
        });
      },
      mark() {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        let params = {
          userId: uid,
          type: 1,
          artworkId: this.good.id,
          price: this.good.price,
          name: this.good.name,
          icons: this.good.pictures,
          fromCart: false
        };
        if (this.marked) {
          delete params.name;
          delete params.icons;
          delete params.price;
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              this.good.collected = [];
            }
          });
          this.marked = false;
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (this.good.collected) {
              this.good.collected.push(uid);
            } else {
              this.good.collected = [uid];
            }
            this.marked = true;
          }
        });
      },
      drop(el) {
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
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fixed-foot
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 50px
    z-index: 80
    background: #fafafa
    .foot-wrapper
      display: flex
      height: 100%
      .foot-item, .mini-favorite-item
        flex: 1
        position: relative
        height: 100%
        font-size: 12px
        text-align: center
        color: #666
        &.active
          color: #00bb9c
        .icon
          display: block
          line-height: 1
          padding-top: 5px
          i
            display: inline-block
            width: 20px
            height: 20px
            font-size: 16px
        .text
          display: block
          line-height: 1
          font-size: 10px
        .button-lg
          display: block
          line-height: 50px
          font-size: 14px
          i
            font-size: 22px
          &.orange
            background: rgba(250,180,90,0.93)
            color: #fff
          &.red
            background: #ff463c
            color: #fff
          &.darkred
            background: #e4393c
            color: #fff
          &.disable
            background: #aaa
            color: #fff
          .icon-favorite
            color: #ff463c  
      .btn-share
        flex: none
        float: left
        width: 28%
        display: block
      .mini-favorite-item
        flex: 70px 0 0
        .button-lg
          height: 50px
          line-height: 30px
          margin-top: 15px
          overflow: hidden
        .badge
          display: inline-block
          position: absolute
          top: 6px
          right: 13px
          background: #f23030
          color: #fff
          border-radius: 50%
          padding: 2px
          width: 14px
          height: 14px
          line-height: 14px
          font-size: 10px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
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
</style>
