<template>
  <div class="cart">
    <fixedheader title="购物车" right-icon="icon-more" ref="header"></fixedheader>
    <div class="cart-wrapper" ref="cart">
      <div>
        <div class="toolbars">
          <div class="delivery"><span class="icon-address"></span><span v-show="defaultAddress" class="address">{{defaultAddress.address}}</span></div>
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
                  <cartcontrol :good="product" @confirm="confirmRemove"></cartcontrol>
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
            <div class="button remove" @click.stop.prevent="removeCartItem"><span>删除</span></div>
            <!-- <div class="button favorite"><span>移入收藏</span></div> -->
            <!-- <div class="button share"><span>分享</span></div> -->
          </div>
        </div>
        <div class="content-center" v-show="!editMode">
          <span class="totalPrice">总计：<span class="price">{{totalPrice | currency}}</span></span>
        </div>
        <div class="content-right" @click.stop.prevent="pay" v-show="!editMode">
          <div class="pay activated">结算<span>(<em class="count">{{totalCount}}</em>件)</span></div>
        </div>
      </div>
    </div>
    <mydialog :text="dialog.text" :btns="dialog.btns" ref="dialogWin"></mydialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import mydialog from '@/components/common/mydialog';

  export default {
    data() {
      return {
        checkedAll: false,
        editMode: false,
        cartProducts: [],
        total: 0,
        dialog: {
          text: '是否确认删除此商品？',
          btns: {
            ok: {
              text: '确定',
              callback: function() {
                console.log('ok');
              }
            }
          }
        }
      };
    },
    computed: {
      defaultAddress() {
        return this.$store.getters.getDefaultAddress;
      },
      editDesc() {
        if (this.editMode) {
          return '完成';
        } else {
          return '修改商品';
        }
      },
      totalPrice() {
        let total = 0;
        this.cartProducts.forEach((item) => {
          if (item.checked) {
            total += item.count * item.price;
          }
        });
        this.total = total;
        return total;
      },
      totalCount() {
        let count = 0;
        this.cartProducts.forEach((item) => {
          if (item.checked) {
            count += item.count;
          }
        });
        return count;
      }
    },
    activated() {
      this.reloadItems();
      this.$store.commit('HIDE_FOOTER');
    },
    updated() {
      this._initScroll();
    },
    deactivated() {
      this.checkAll(false);
      this.checkedAll = false;
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
      reloadItems() {
        let goods = this.$store.getters.cartProducts;
        this.cartProducts = [];
        goods.forEach((product) => {
          this.cartProducts.push({
            id: product.id,
            name: product.name,
            icon: product.icon,
            src: product.src,
            info: product.info,
            description: product.description,
            price: product.price,
            oldPrice: product.oldPrice,
            count: product.count,
            checked: product.checked || false,
            stock: product.stock,
            fromCart: true
          });
        });
        this._initScroll();
      },
      removeCartItem() {
        let deleteItems = [];
        this.cartProducts.forEach((item) => {
          if (item.checked) {
            deleteItems.push(item);
          }
        });
        this.$store.dispatch('removeCartItems', deleteItems);
        this.reloadItems();
        this.editMode = false;
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
        this.cartProducts.forEach((item) => {
          item.checked = state;
        });
      },
      check(state) {
        let notSame = false;
        this.cartProducts.forEach((item) => {
          if (item.checked !== state) {
            notSame = true;
          }
        });
        if (!notSame && state) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      },
      pay() {
        if (this.total) {
          this.$store.dispatch('addPayGoods', this.cartProducts.filter(item => item.checked));
          // this.$router.push('pay');
          window.location.href = window.location.href.replace('cart', 'pay');
        }
      },
      confirmRemove(good) {
        let vm = this;
        this.dialog.btns.ok.callback = function() {
          vm.$store.commit('REDUCE_QUANTITY', good.id);
          vm.reloadItems();
        };
        this.$refs.dialogWin.show();
      }
    },
    components: {
      fixedheader, cartcontrol, mydialog
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
      display: flex
      align-items: center
      justify-content: space-between
      height: 40px
      line-height: 40px
      color: #666
      background: #fafafa
      font-size: 14px
      .delivery
        display: flex
        align-items: center
        width: 60%
        .icon-address
          width: 15px
          padding-right: 3px
          padding-left: 10px
          overflow: hidden
        .address
          max-width: 80%
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
      .edit
        display: flex
        align-items: center
        padding: 0 15px
        font-weight: 700
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
            display: inline-block
            width: 46px
            float: left
            font-size: 24px
            color: #d3d3d3
            text-align: center
            padding-top: 35px
            vertical-align: top
            &.on
              color: #fb4741
          .pic
            vertical-align: top
            display: inline-block
            width: 30%
            float: left
            padding: 5px 0
            box-sizing: border-box
            img
              width: 95%
              overflow: hidden
          .item-wrapper
            flex: 1
            position: relative
            vertical-align: top
            padding: 0 5px 5px 0
            .item-name
              position: relative
              padding-top: 8px
              overflow: hidden
              font-size: 14px
              a
                display: block
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
                line-height: 1.2
            .amountWrapper
              position: absolute
              display: inline-block
              width: 100%
              bottom: 6px
              .price
                display: inline-block
                margin-top: 10px
                color: #fb4741
                font-size: 13px
              .cartcontrol
                display: inline-block
                float: right
                padding-right: 5px
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
      .empty-text
        color: #ccc
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
          font-size: 16px
          background: rgb(147, 153, 159)
          span
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

