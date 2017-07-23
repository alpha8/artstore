<template>
  <div>
    <fixedheader title="订单详情页"></fixedheader>
    <div class="orderdetail" ref="orderdetail">
      <div class="detail-wrap">
        <div class="order-info">
          <div class="order-state">
            <p><label>订单状态：</label><span class="text-blue">{{statusDesc}}</span></p>
            <p><label>订单编号：</label><span>{{order.orderNo}}</span></p>
            <p><label>下单时间：</label><span>{{order.createAt | formatDate}}</span></p>
          </div>
        </div>
        <split></split>
        <div class="title">配送信息</div>
        <div class="delivery-info">
          <p><label>收货地址：</label><span>{{order.express.expressAddress}}</span></p>
          <p><label>收货人：</label><span>{{order.express.receiver}}</span></p>
          <p><label>联系方式：</label><span>{{order.express.mobile}}</span></p>
          <p><label>支付方式：</label><span>在线支付</span></p>
          <p><label>发票信息：</label><span>普通发票</span></p>
        </div>
        <split></split>
        <div class="title">商品列表</div>
        <ul class="goods-info">
          <li class="good-item" v-for="product in order.products">
            <div class="item-img"><img :src="getThumbnail(product)" alt=""></div>
            <div class="item-info">
              <h3 class="title">{{product.name}}</h3>
            </div>
            <div class="item-pay">
              <p class="price">{{product.price | currency}}</p>
              <p class="nums">x{{product.count}}</p>
            </div>
          </li>
        </ul>
        <split></split>
        <div class="price-summary">
          <ul>
            <li>商品总额<span class="text-red">{{order.totalPrice | currency}}</span></li>
            <li>运费<span class="text-red">+ {{order.shipFee || 0 | currency}}</span></li>
          </ul>
          <p class="total">
            实付金额：<strong class="text-red">{{order.totalPrice + (order.shipFee || 0) | currency}}</strong>
          </p>
        </div>
      </div>
    </div>
    <div class="footer border-top-1px">
      <div class="btn-group">
        <div class="button" v-show="order.status === 0"><span class="btn-red">支付</span></div>
        <div class="button" v-show="order.status === 0"><span class="btn-white">取消订单</span></div>
        <div class="button" v-show="order.status === 6"><span class="btn-white">看相似</span></div>
        <div class="button" v-show="order.status === 6"><span class="btn-orange">再次购买</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';

  export default {
    data() {
      return {
        order: {},
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消']
      };
    },
    activated() {
      this.fetchData();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      statusDesc() {
        return this.mapStatus[this.order.status];
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    methods: {
      fetchData() {
        let id = this.$route.query.deal_id || '';
        api.getOrderDetail(id).then(response => {
          this.order = response;
          this._initScroll();
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.orderdetail, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      back() {
        this.$router.back();
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=70&h=70';
        } else {
          return api.CONFIG.defaultImg;
        }
      }
    },
    components: {
      fixedheader, split
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .btn-red
    background: #f15353
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
  .orderdetail
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    overflow: hidden
    .detail-wrap
      position: relative
      width: 100%
      padding-bottom: 30px
      >.title
        position: relative
        width: 100%
        height: 40px
        line-height: 40px
        font-size: 14px
        padding: 0 8px
        box-sizing: border-box
      .order-info, .delivery-info, .goods-info, .price-summary
        padding: 10px 8px
        p
          line-height: 1.8
          font-size: 12px
          label
            display: inline-block
            min-width: 75px
            color: #999
      .delivery-info, .goods-info
        padding-top: 0
      .price-summary
        font-size: 12px
        ul
          position: relative
          padding-bottom: 15px
          li
            line-height: 1.8
            span
              float: right
        .total
          text-align: right
          strong
            font-weight: 700
            font-size: 16px
      .good-item
        position: relative
        display: flex
        padding: 8px 0
        font-size: 12px
        .item-img
          flex: 15vw 0 0
          img
            width: 60px
            height: 60px
            overflow: hidden
        .item-info
          flex: 1
          padding: 20px 8px 0
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
          padding-top: 20px
          .price
            padding-bottom: 8px
          .nums
            text-align: right
  .footer
    border-top-1px(rgba(7, 17, 27, 0.1))
    position: fixed
    width: 100%
    padding: 0 8px 0 2px
    bottom: 0
    height: 50px
    box-sizing: border-box
    overflow: hidden
    background: #fff
    .btn-group
      position: relative
      font-size: 14px
      padding-top: 5px
      .button
        text-align: center
        float: right
        width: 25%
        padding-right: 8px
        box-sizing: border-box
        &:first-child
          padding-right: 0
        span
          box-sizing: border-box
          display: inline-block
          width: 100%
          height: 40px
          line-height: 40px
</style>
