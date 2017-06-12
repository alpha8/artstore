<template>
  <div class="cart">
    <fixedheader title="购物车" right-icon="icon-search" rightLink="/category"></fixedheader>
    <div class="cart-wrapper">
      <ul class="good-list" v-show="cartProducts && cartProducts.length > 0">
        <li class="good-item" v-for="product in cartProducts">
          <span>{{product}}</span>
        </li>
      </ul>
      <div class="no-product" v-show="!cartProducts || !cartProducts.length">您的购物车内还没有商品！</div>
    </div>
    <fixedcheckout></fixedcheckout>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import fixedcheckout from '@/components/fixedtoolbar/fixedcheckout';
  import {mapGetters} from 'vuex';

  export default {
    computed: {
      ...mapGetters(['cartProducts'])
    },
    components: {
      fixedheader, fixedcheckout
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .cart-wrapper
    position: fixed
    left: 0
    top: 40px
    bottom: 50px
    width: 100%
    z-index: 30
    background: #fff
    .no-product
      width: 100%
      padding: 40px 0
      text-align: center
      font-size: 12px
</style>

