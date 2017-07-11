<template>
  <div>
    <fixedheader title="我的订单"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="tab border-1px">
          <div class="tab-item" :class="{'active': item.val === activeItem}" v-for="item in tabItems" @click.stop.prevent="changeTab(item)">{{item.text}}</div>
        </div>
        <div class="order-container" ref="orderlist" v-show="showRecords > 0">
          <ul class="order-list">
            <li class="order-item" v-for="order in orders" v-show="showOrder(order)">
              <div class="item-title" @click.stop.prevent="showOrderDetail(order)">
                <span class="productNo">订单号：{{order.orderNo}}</span>
                <span class="op-btns"></span>
              </div>
              <div class="item-summary border-top-1px border-1px">
                <div class="summary">
                  <p class="status"><label>状&nbsp;&nbsp;&nbsp;&nbsp;态：</label><span class="text">{{statusDesc(order.status)}}</span></p>
                  <p class="price"><label>总&nbsp;&nbsp;&nbsp;&nbsp;价：</label><span class="text">{{order.totalPrice | currency}}</span></p>
                </div>
                <div class="ops">
                  <span class="button btn-red" v-show="order.status === 0">去支付</span>
                  <span class="button btn-green" v-show="order.status === 1">催单</span>
                  <span class="button btn-blue" v-show="order.status === 5">去评价</span>
                  <span class="button btn-orange" v-show="order.status === 5">再次购买</span>
                  <span class="button btn-white" v-show="order.status === 10">看相似</span>
                </div>
              </div>
              <div class="item-content" v-for="product in order.items">
                <div class="item-img" @click.stop.prevent="showProductDetail(product)"><img :src="product.icon" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showOrderDetail(order)">{{product.productName}}</h3>
                  <div class="specs" v-show="product.specs">规格：{{product.specs}}</div>
                </div>
                <div class="item-pay">
                  <p class="price">{{product.price | currency}}</p>
                  <p class="nums">x{{product.count}}</p>
                </div>
              </div>
              <split v-show="showRecords > 0"></split>
            </li>
          </ul>
        </div>
        <div class="no-order" v-show="showRecords === 0">您暂时还没有订单。</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';

  export default {
    data() {
      return {
        tabItems: [
          { text: '全部', val: -1 },
          { text: '待付款', val: 0 },
          { text: '待发货', val: 1 },
          { text: '待收货', val: 2 },
          { text: '退换货', val: 6 }
        ],
        orders: [{
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }, {
          orderNo: 'A000001',
          totalPrice: 3400,
          status: 1,
          items: [{
            productId: '4000',
            productName: '云中鹰茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959acffe4b00faa50475a3d?w=70&h=70',
            price: 1200,
            count: 1
          }, {
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100,
            count: 2
          }]
        }, {
          orderNo: 'A000002',
          totalPrice: 2200,
          status: 0,
          items: [{
            productId: '4001',
            productName: '隐樵山柴烧茶仓',
            productSpec: '1000g',
            icon: 'http://www.yihuyixi.com/ps/download/5959ad01e4b00faa50475a41?w=70&h=70',
            price: 1100.00,
            count: 2
          }]
        }],
        activeItem: -1,
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消']
      };
    },
    activated() {
      this._initScroll();
      let type = this.$route.query.type;
      if (typeof type === 'undefined') {
        this.activeItem = -1;
      } else {
        this.activeItem = Number(type);
      }
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      showRecords() {
        if (this.activeItem === -1) {
          return 1;
        } else {
          return this.orders.filter((order) => order.status === this.activeItem).length;
        }
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.orderlist, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      statusDesc(status) {
        return this.mapStatus[status];
      },
      changeTab(item) {
        this.activeItem = item.val;
        this._initScroll();
      },
      showOrder(order) {
        return this.activeItem === -1 || order.status === this.activeItem;
      },
      showOrderDetail(order) {
        this.$router.push({name: 'orderdetail', query: {deal_id: order.orderNo}});
      },
      showProductDetail(product) {
        this.$router.push({name: 'good', params: {id: product.productId}});
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      back() {
        this.$router.back();
      }
    },
    components: {
      fixedheader, split
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .order
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .order-wrap
      width: 100%
      height: 100%
      .btn-red
        background: #d05148
        color: #fff
      .btn-blue
        background: #3a77e7
        color: #fff
      .btn-green
        background: #44b549
        color: #fff
      .btn-orange
        background: #f19325
        color: #fff
      .btn-white
        background: #fff
        color: #333
        border: 1px solid #ddd
      .tab
        position: relative
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
          flex: 1
          font-size: 14px
          padding: 15px 0
          text-align: center
          border-bottom: 2px solid transparent
          &.active
            color: #f15353
            border-bottom: 2px solid #f15353
      .order-container
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        .order-list
          position: relative
          width: 100%
          padding-bottom: 50px
          .order-item
            padding: 0 8px 15px 8px
            .item-title
              position: relative
              width: 100%
              height: 40px
              line-height: 40px
              font-size: 14px              
              &:after
                position: absolute
                display: block
                width: 10px
                height: 10px
                content: ""
                border-top: 1px solid #666
                border-left: 1px solid #666
                -webkit-transform-origin: 50%
                transform-origin: 50%
                -webkit-transform: rotate(135deg)
                transform: rotate(135deg)
                top: 50%
                right: 5px
                margin-top: -4px
              .op-btns
                display: inline-block
                float: right
                padding-right: 20px
            .item-summary
              position: relative
              display: flex
              padding: 8px 0
              font-size: 12px
              border-top-1px(rgba(7, 17, 27, 0.1))
              border-1px(rgba(7, 17, 27, 0.1))
              .summary
                flex: 1
                p
                  height: 25px
                  line-height: 25px
                  .text
                    color: #f15353
              .ops
                flex: 0 0 45vw
                text-align: right
                padding: 10px 0
                height: 50px
                box-sizing: border-box
                overflow: hidden
                .button
                  display: inline-block
                  padding: 8px 12px
                  text-align: center                  
                  margin-left: 5px
                  &:first-child
                    margin-left: 0
            .item-content
              position: relative
              display: flex
              padding: 8px 0
              font-size: 12px
              .item-img
                flex: 15vw 0 0
              .item-info
                flex: 1
                padding: 0 8px
                >.title
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                  line-height: 1.45
                div
                  padding-top: 10px
              .item-pay
                flex: 0 0 15vw
                text-align: right
                .price
                  padding-bottom: 8px
                .nums
                  text-align: right
      .no-order
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
