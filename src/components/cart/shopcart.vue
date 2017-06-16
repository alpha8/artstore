<template>
  <div class="cart">
    <fixedheader title="购物车" right-icon="icon-more" ref="header"></fixedheader>
    <div class="cart-wrapper" ref="cart">
      <div>
        <div class="toolbars">
          <div class="delivery"><span class="icon-address"></span><span class="address">{{defaultAddress}}</span></div>
          <div class="edit" @click.stop.prevent="editProduct">{{editDesc}}</div>
        </div>
        <ul class="good-list" v-show="cartProducts && cartProducts.length > 0">
          <li class="good-item" v-for="product in cartProducts">
            <div class="cart-item border-top-1px">
              <span class="icon-check_circle" :class="{'on': product.checked}" @click.stop.prevent="toggleCheckout(product)"></span>
              <router-link class="pic" :to="{name:'good', params: { id: product.id }}">
                <img :src="product.icon" alt="">
              </router-link>
              <div class="item-wrapper">
                <div class="item-name">
                  <router-link :to="{name:'good', params: { id: product.id }}">{{product.name}}</router-link>
                </div>
                <div class="amountWrapper">
                  <div class="price">{{product.price | currency}}</div>
                  <cartcontrol :good="product"></cartcontrol>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="no-product" v-show="!cartProducts || !cartProducts.length">
          <p class="empty-cart"><i class="icon-cart"></i></p>
          <p class="empty-text">您的购物车内还没有商品！</p>
        </div>
      </div>
    </div>
    <div class="fixed-foot">
      <div class="content">
        <div class="content-left">
          <div class="checkbox" @click.stop.prevent="toggleCheckAll">
            <span class="icon icon-check_circle" :class="{'on': checkedAll}"></span><span class="iconword">全选</span>
          </div>
        </div>
        <div class="content-center" v-show="editMode">
          <div class="button-wrapper">
            <div class="button remove"><span>删除</span></div>
            <div class="button favorite"><span>移入收藏</span></div>
            <div class="button share"><span>分享</span></div>
          </div>
        </div>
        <div class="content-center" v-show="!editMode">
          <span class="totalPrice">总计：<span class="price">{{totalPrice | currency}}</span></span>
        </div>
        <div class="content-right" @click.stop.prevent="pay" v-show="!editMode">
          <div class="pay activated">结算<span>(<em class="count">{{selectedCount}}</em>件)</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import {mapGetters} from 'vuex';

  export default {
    data() {
      return {
        checkedAll: false,
        totalPrice: 0,
        selectedCount: 0,
        defaultAddress: '深圳市',
        editMode: false
      };
    },
    computed: {
      ...mapGetters(['cartProducts']),
      editDesc() {
        if (this.editMode) {
          return '完成';
        } else {
          return '修改商品';
        }
      }
    },
    activated() {
      this._initScroll();
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
      this.$refs.header.hide();
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.cart, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      toggleCheckAll() {
        this.checkedAll = !this.checkedAll;
        this.checkAll(this.checkedAll);
      },
      toggleCheckout(item) {
        item.checked = !item.checked;
        this.check(item.checked);
      },
      editProduct() {
        this.editMode = !this.editMode;
        this.checkAll(false);
        this.checkedAll = false;
      },
      checkAll(state) {
        let count = 0;
        let total = 0;
        this.cartProducts.forEach((item) => {
          item.checked = state;

          if (item.checked) {
            count += item.count;
            total += item.count * item.price;
          }
        });
        this.selectedCount = count;
        this.totalPrice = total;
      },
      check(state) {
        let notSame = false;
        let count = 0;
        let total = 0;
        this.cartProducts.forEach((item) => {
          if (item.checked !== state) {
            notSame = true;
          }

          if (item.checked) {
            count += item.count;
            total += item.count * item.price;
          }
        });
        if (!notSame && state) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
        this.selectedCount = count;
        this.totalPrice = total;
      },
      pay() {
        if (this.totalPrice) {
          alert(`支付${this.totalPrice}元`);
        }
      }
    },
    components: {
      fixedheader, cartcontrol
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .cart-wrapper
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    background: #fff
    overflow: hidden
    .toolbars
      position: relative
      height: 40px
      line-height: 40px
      width: 100%
      color: #666
      background: #fafafa
      font-size: 14px
      .delivery
        display: inline-block
        float: left
        padding-left: 15px
        .address
          padding-left: 5px
      .edit
        display: inline-block
        float: right
        padding: 0 15px
        text-align: center
        .icon-edit
          padding-right: 5px
    .good-list
      display: block
      .good-item
        position: relative
        .cart-item
          display: flex
          position: relative
          border-top-1px(rgba(7, 17, 27, 0.1))
          .icon-check_circle
            flex: 15vw 0 0
            font-size: 24px
            color: #d3d3d3
            text-align: center
            padding-top: 50px
            vertical-align: top
            &.on
              color: #fb4741
          .pic
            vertical-align: top
            flex: 15vw 0 0
            padding: 10px 10px 10px 0
            img
              width: 114px
              height: 114px
          .item-wrapper
            flex: 1
            position: relative
            vertical-align: top
            padding: 0 15px 5px 5px
            .item-name
              height: 42px
              margin-top: 15px
              overflow: hidden
              font-size: 14px
              a
                display: inline-block
                height: 100%
                overflow: hidden
                text-overflow: ellipsis
                word-wrap: break-word
            .amountWrapper
              position: absolute
              display: inline-block
              width: 100%
              bottom: 15px
              .price
                display: inline-block
                margin-top: 10px
                color: #fb4741
              .cartcontrol
                display: inline-block
                float: right
                padding-right: 15px
            .num
              color: #666
    .no-product
      width: 100%
      margin-top: 40%
      text-align: center
      font-size: 12px
      .empty-cart
        font-size: 60px
        color: rgba(7, 17, 27, 0.1)
        padding-bottom: 5px
  .fixed-foot
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 50px
    z-index: 99
    background: #fafafa
    .content
      display: flex
      font-size: 0
      text-align: center
      color: #666
      .content-left
        flex: 20vw 0 0
        .checkbox
          height: 100%
          font-size: 14px
          line-height: 50px  
          .icon
            display: inline-block
            vertical-align: top
            line-height: 50px
            font-size: 24px
            color: #d3d3d3
            padding-right: 3px
            &.on
              color: #FB4741
          .iconword
            display: inline-block
            vertical-align: top
            width: 28px
            line-height: 50px
          .text
            display: block
            line-height: 1
            font-size: 10px
      .content-center
        flex: 1
        text-align: right
        padding: 0 10px
        line-height: 50px
        .totalPrice
          display: block
          font-size: 16px
          .price
            color: #e4393c
        .savePrice
          display: block
          line-height: 1
          font-size: 10px
        .button-wrapper
          width: 100%
          height: 100%
          .button
            display: inline-block
            float: right
            width: 28%
            height: 20px
            line-height: 20px
            padding: 10px 0
            font-size: 12px
            text-align: center
            margin-top: 5px
            margin-left: 10px
            color: #fff
            &.remove
              background: rgba(250,180,90,0.93)
            &.favorite
              background: #5e6a6e
            &.share
              background: rgba(0,160,220,0.93)              
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 50px
          line-height: 50px
          font-family: "黑体"
          font-size: 16px
          background: rgb(147, 153, 159)
          span
            font-family: none
            font-size: 12px
            font-weight: 400
          &.disable
            cursor: default
            color: #fff
            background: rgb(147, 153, 159)
          &.activated
            background: #FB4741
            color: #fff
</style>

