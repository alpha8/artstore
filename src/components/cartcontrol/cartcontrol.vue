<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" :class="{'disable': good.count < 1}" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="good.count >= 0">{{good.count}}</div>
    <div class="cart-add" @click.stop.prevent="addCart">
      <span class="inner icon-add_circle"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      good: {
        type: Object
      }
    },
    methods: {
      addCart() {
        let stockEmpty = false;
        if (!this.good.count) {
          Vue.set(this.good, 'count', 1);
        } else {
          let stock = this.good.stock && this.good.stock.total || 0;
          let bookStock = this.good.stock && this.good.stock.bookTotal || 0;
          let total = stock + bookStock;
          if (this.good.count >= total) {
            this.$store.dispatch('openToast', '超过当前库存数了哦!');
            stockEmpty = true;
          } else {
            this.good.count++;
          }
        }
        if (!stockEmpty) {
          this.$emit('add', event.target);
          this.$store.commit('ADD_QUANTITY', this.good.id);
          this.$store.dispatch('addToCart', this.good);
        }
      },
      decreaseCart() {
        if (this.good.count > 1) {
          this.good.count--;
          this.$store.commit('REDUCE_QUANTITY', this.good.id);
        } else {
          if (!this.good.fromCart) {
            this.good.count = 0;
            this.$store.commit('REDUCE_QUANTITY', this.good.id);
          }
          this.$emit('confirm', this.good);
        }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.disable span
        color: #dedede
      &.move-transition
        opacity: 1
        transform: translate3d(0, 0, 0)
        .inner
          display: inline-block
          line-height: 24px
          font-size: 24px
          color: rgb(0, 160, 220)
          transition: all 0.4s linear
          transform: rotate(0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      font-size: 10px
      padding-top: 6px
      line-height: 24px
      text-align: center
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
