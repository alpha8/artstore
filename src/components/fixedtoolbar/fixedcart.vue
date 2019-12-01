<template>
  <div class="fixed-foot">
    <div class="foot-wrapper">
      <router-link to="/cart" class="mini-favorite-item">
        <span class="badge" v-show="getCartAmount">{{getCartAmount}}</span>
        <span class="add_num" :class="{'show': showAddOne}" id="popone">+1</span>
        <span class="button-lg"><i class="icon-cart"></i></span>
      </router-link>
      <span class="mini-favorite-item">
        <span class="button-lg" @click="mark"><i :class="{'icon-favorite': marked, 'icon-heart': !marked}"></i></span>
      </span>
      <div class="foot-item" v-if="good.stock" @click.stop.prevent="addGood">
        <span class="button-lg orange">加入购物车</span>
      </div>
      <div class="foot-item" v-else>
        <span class="button-lg disable">已售磬</span>
      </div>
      <div class="foot-item" v-if="good.stock" @click.stop.prevent="fastPay">
        <span class="button-lg red">立即购买</span>
      </div>
      <!-- <div class="foot-item" v-else @click.stop.prevent="bookNotify">
        <span class="button-lg red">到货提醒</span>
      </div> -->
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
        showAddOne: false,
        marked: false
      };
    },
    watch: {
      good(newValue) {
        if (!newValue) {
          return;
        }
        var userId = this.$store.getters.userId;
        if (!userId) {
          return;
        }
        api.existCollect(userId, newValue.id).then(response => {
          if (response.code == 200) {
            this.marked = response.data;
          }
        });
      }
    },
    computed: {
      getCartAmount() {
        return this.$store.getters.getCartAmount;
      }
    },
    methods: {
      addGood() {
        if (!this.$store.getters.userId) {
          this.$router.push({name: 'login', query: {redirect: encodeURI(location.href)}});
          return;
        }
        this.$emit('add', event.target);
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (!sku) {
          this.$store.dispatch('showSkuWin', this.good);
          this.$store.dispatch('addSku', this.good);
        }
      },
      mark() {
        if (this.marked) {
          this.$store.dispatch('openToast', '商品已收藏！');
        }
        var user = this.$store.getters.userInfo;
        if (!user.id) {
          this.$store.dispatch('openToast', '未登录！');
          this.$router.push({name: 'login', query: {redirect: encodeURI(location.href)}});
          return;
        }
        api.addProductCollect({
          memberIcon: user.icon,
          memberId: user.id,
          memberNickname: user.nickname,
          productId: this.good.id,
          productName: this.good.name,
          productPic: this.good.pic,
          productPrice: this.good.price,
          productSubTitle: this.good.subTitle
        }).then(response => {
          if (response.code == 200) {
            this.marked = true;
          }
        });
      },
      fastPay() {
        if (!this.$store.getters.userId) {
          this.$router.push({name: 'login', query: {redirect: encodeURI(location.href)}});
          return;
        }
        this.$emit('fastAdd', event.target);
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (!sku) {
          this.$store.dispatch('showSkuWin', this.good);
          this.$store.dispatch('addSku', this.good);
        }
      },
      bookNotify() {
        let openid = this.$store.getters.userInfo.openId;
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
        this.showAddOne = true;
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
          this.showAddOne = false;
        }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
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
        >.add_num
          position: absolute
          padding: 2px 3px
          color: #e4393c
          font-weight: 700
          top: -10px
          left: 50%
          margin-left: -9px
          display: none
          font-size: 18px
          pointer-events: none
          z-index: 30
          &.show
            display: block
            opacity: 0
            animation: de_add_num 2s
            -webkit-animation: de_add_num 2s
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
          background: $color-main
          transition: all 0.4s linear
</style>
