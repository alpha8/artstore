<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" :class="{'disable': good.quantity < 1}" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-quantity" v-show="good.quantity > 0">{{good.quantity}}</div>
    <div class="cart-add" v-if="stock == -1 || good.quantity < stock" @click.stop.prevent="addCart">
      <span class="inner icon-add_circle"></span>
    </div>
    <div class="cart-add disable" v-else>
      <span class="inner icon-add_circle"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      good: {
        type: Object
      },
      stock: {
        type: Number,
        default() {
          return -1;
        }
      }
    },
    methods: {
      addCart() {
        let stockEmpty = false;
        if (!this.good.quantity) {
          this.$set(this.good, 'quantity', 1);
        } else {
          let total = this.stock || 0;
          if (this.stock != -1 && this.good.quantity >= total) {
            this.$store.dispatch('openToast', '超过当前库存数了哦!');
            stockEmpty = true;
          } else {
            this.good.quantity++;
            this.$set(this.good, 'quantity', this.good.quantity);
          }
        }
        if (!stockEmpty) {
          // this.$store.dispatch('addToCart', this.good);
          this.$emit('add', this.good);
        }
      },
      decreaseCart() {
        if (this.good.quantity > 1) {
          this.good.quantity--;
          this.$emit('minus', this.good);
        } else {
          this.$emit('confirm', this.good);
        }
      },
      getGoodsId() {
        return this.good.id;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
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
    .cart-quantity
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
      &.disable span
        color: #dedede
</style>
