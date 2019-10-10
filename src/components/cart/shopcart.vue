<template>
  <div class="cart">
    <fixedheader title="购物车" right-icon="icon-more" ref="header"></fixedheader>
    <div class="cart-wrapper" ref="cart">
      <div>
        <div class="toolbars">
          <div class="delivery"><span class="icon-address"></span><span v-show="defaultAddress" class="gpsaddress">{{defaultAddress.address}}</span></div>
          <div class="edit" @click.stop.prevent="editProduct">{{editDesc}}</div>
        </div>
        <ul class="good-list" v-show="cartProducts && cartProducts.length > 0">
          <li class="good-item" v-for="product in cartProducts">
            <div class="cart-item border-top-1px">
              <span class="icon-check_circle" :class="{'on': product.checked}" @click.stop.prevent="toggleCheckout(product)"></span>
              <div class="pic" @click="goGoodDetail(product)">
                <img :src="getThumbnail(product.productPic)" alt="">
              </div>
              <div class="item-wrapper">
                <div class="item-name">
                  <div @click="goGoodDetail(product)">{{product.productName}}</div>
                </div>
                <div class="sku_line" v-show="product.sp1">
                  <div class="sku">{{`${product.sp1 || ''} ${product.sp2 || ''}  ${product.sp3 || ''}`}}</div>
                </div>
                <div class="amountWrapper">
                  <div class="price">{{product.price | currency}}</div>
                  <cartcontrol :good="product" @confirm="confirmRemove" @add="doAdd" @minus="doMinus"></cartcontrol>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import api from '@/api/api';

  export default {
    data() {
      return {
        checkedAll: false,
        editMode: false,
        cartProducts: [],
        total: 0
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
            total += item.quantity * item.price;
          }
        });
        this.total = total;
        return total;
      },
      totalCount() {
        let count = 0;
        this.cartProducts.forEach((item) => {
          if (item.checked) {
            count += item.quantity;
          }
        });
        return count;
      }
    },
    activated() {
      this.fetchData();
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.checkAll(false);
      this.checkedAll = false;
      this.$store.commit('SHOW_FOOTER');
      this.$refs.header.hide();
    },
    methods: {
      fetchData() {
        this.$store.dispatch('openLoading');
        api.getCartList().then(response => {
          if (response.code == 200) {
            this.cartProducts = response.data;
            var sum = 0;
            this.cartProducts.forEach(product => {
              if (!product.checked) {
                this.$set(product, 'checked', false);
              }
              sum += product.quantity;
            });
            this.$store.dispatch('updateCartAmount', sum);
          }
          this.$store.dispatch('closeLoading');
        }).catch(error => {
          console.log(error);
          this.$store.dispatch('closeLoading');
        });
      },
      removeCartItem() {
        var deleteCount = 0;
        var ids = [];
        this.cartProducts.forEach((item) => {
          if (item.checked) {
            deleteCount++;
            ids.push(item.id);
          }
        });
        if (deleteCount == 0) {
          this.$store.dispatch('openToast', '请选择一件需要删除的商品');
          return;
        }
        this.$confirm('是否确认删除此商品?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append('ids', ids);
          api.deleteCartProducts(params).then(response => {
            if (response.code == 200) {
              this.fetchData();
              this.editMode = false;
            }
          });
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
        this.cartProducts.forEach((item) => {
          item.checked = state;
        });
      },
      getThumbnail(pic) {
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
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
          window.location.href = 'http://' + location.host + '#/pay';
        }
      },
      confirmRemove(good) {
        this.$confirm('是否确认删除此商品?', '', {
          confirmButtonText: '删除',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append('ids', [good.id]);
          api.deleteCartProducts(params).then(response => {
            if (response.code == 200) {
              this.fetchData();
            }
          });
        });
      },
      doAdd(good) {
        this.changeQty(good);
      },
      doMinus(good) {
        this.changeQty(good);
      },
      changeQty(good) {
        api.updateCartQty({
          id: good.id,
          quantity: good.quantity
        }).then(response => {
          if (response.code == 200) {
            this.fetchData();
          }
        });
      },
      goGoodDetail(product) {
        this.$store.dispatch('addSkuSpec', {
          id: product.productId,
          spec: JSON.parse(product.productAttr || '[]'),
          checkedSpec: [(product.sp1 || ''), (product.sp2 || ''), (product.sp3 || '')],
          count: product.quantity || 1
        });
        this.$router.push({name: 'good', params: { id: product.productId }});
      }
    },
    components: {
      fixedheader, cartcontrol
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  @import '../../common/stylus/mixin';
  .cart-wrapper
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    background: #fff
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
        .gpsaddress
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
      background: #fff
      padding-bottom: 100px
      -webkit-overflow-scrolling: touch
      overflow-x: hidden
      overflow-y: auto
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
            font-size: 20px
            color: #d3d3d3
            text-align: center
            padding-top: 35px
            vertical-align: top
            &.on
              color: #fb4741
          .pic
            vertical-align: top
            display: inline-block
            float: left
            padding: 5px 10px 0 0
            box-sizing: border-box
            img
              width: 100px
              height: 100px
              overflow: hidden
          .item-wrapper
            flex: 1
            position: relative
            vertical-align: top
            padding: 5px 5px 5px 0
            box-sizing: border-box
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
                /*! autoprefixer: off */
                -webkit-box-orient:vertical
                /*! autoprefixer: on */
                line-height: 1.2
            .sku_line
              display: flex
              align-items: center
              margin: 3px 10px 0 0
              justify-content: space-between
              font-size: 12px
              .sku
                position: relative
                background: #f7f7f7
                padding: 0 15px 0 5px
                height: 20px
                line-height: 20px
                color: #666
                flex: 1;
                border-radius: 2px;
            .amountWrapper
              position: absolute
              display: inline-block
              width: 100%
              bottom: 2px
              .price
                display: inline-block
                margin-top: 10px
                color: #f2270c
                font-size: 13px
                font-weight: 700
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
            color: #f2270c
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
            font-size: 14px
            text-align: center
            margin-top: 5px
            margin-left: 10px
            color: #fff
            letter-spacing: 2px
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

