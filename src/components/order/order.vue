<template>
  <div>
    <fixedheader title="我的订单"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="tab border-1px">
          <div class="tab-item" :class="{'active': item.val === activeItem}" v-for="item in tabItems" @click.stop.prevent="changeTab(item)">{{item.text}}</div>
        </div>

        <div class="order-container" ref="orderlist" v-show="showRecords > 0">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(order, index) in orders" v-show="showOrder(order)" :key="index">
              <div class="item-title" @click.stop.prevent="showOrderDetail(order)">
                <span class="productNo">订单号：{{order.orderNo}}<span class="orderflag" v-if="order.type">({{orderTypeDesc(order)}})</span></span>
                <span class="op-btns"></span>
              </div>
              <div class="item-summary border-top-1px border-1px">
                <div class="summary">
                  <p class="status"><label>状&nbsp;&nbsp;&nbsp;&nbsp;态：</label><span class="text">{{statusDesc(order.status)}}</span></p>
                  <p class="price"><label>总&nbsp;&nbsp;&nbsp;&nbsp;价：</label><span class="text">{{order.totalFee | currency}}</span></p>
                </div>
                <div class="ops">
                  <span class="button btn-orange" v-if="order.status === 0 && !order.express && order.type !== 6" @click.stop.prevent="goFillAddress(order)">填写收货地址</span>
                  <span class="button btn-red" v-else-if="order.status === 0" @click.stop.prevent="weixinPay(order)">去支付</span>
                  <!-- <span class="button btn-green" v-if="order.status === 10">催单</span>
                  <span class="button btn-blue" v-if="order.status === 10">去评价</span>
                  <span class="button btn-orange" v-if="order.status === 10">再次购买</span>
                  <span class="button btn-white" v-if="order.status === 10">看相似</span> -->
                </div>
              </div>
              <div class="item-content" v-for="product in order.products">
                <div class="item-img" @click.stop.prevent="showProductDetail(order, product)"><img :src="getThumbnail(product)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showOrderDetail(order)">{{product.name}}</h3>
                  <div class="specs" v-show="product.specs">规格：{{product.specs}}</div>
                </div>
                <div class="item-pay">
                  <p class="price">{{product.price | currency}}</p>
                  <p class="nums">x{{product.count}}</p>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-order" v-show="showRecords === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';

  export default {
    data() {
      return {
        tabItems: [
          { text: '全部', val: -1 },
          { text: '待付款', val: 0 },
          { text: '待发货', val: 1 },
          { text: '待收货', val: 2 },
          { text: '退换货', val: 5 }
        ],
        orders: [],
        activeItem: -1,
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消', '退款申请中', '退款中', '已退款', '退款失败'],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        paying: false
      };
    },
    activated() {
      this.loadEnd = false;
      let type = this.$route.query.type;
      if (typeof type === 'undefined') {
        this.activeItem = -1;
      } else {
        this.activeItem = Number(type);
      }
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.paying = false;
      this.hide();
    },
    computed: {
      showRecords() {
        if (this.activeItem === -1) {
          return true;
        } else {
          return this.orders.filter((order) => order.status === this.activeItem).length;
        }
      }
    },
    mounted() {
      this.scroller = this.$refs.orderlist;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        api.getOrders({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          userId: this.$store.getters.getUserInfo.userId || 0,
          status: this.activeItem
        }).then(response => {
          if (response.code === 0) {
            if (response.orders && response.orders.length) {
              response.orders.forEach(item => {
                this.orders.push(item);
              });
            }
            this.totalPages = response.totalPages;
            this.pageNumber++;
            this.lastExec = +new Date();
            this.loading = false;
            this.loadEnd = this.pageNumber > this.totalPages;
          }
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      _reset() {
        this.orders = [];
        this.pageNumber = 1;
        this.totalPages = -1;
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=750&h=500&v=v2';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      statusDesc(status) {
        return this.mapStatus[status];
      },
      orderTypeDesc(item) {
        if (item.type === 3) {
          return '秒杀';
        } else if (item.type === 4) {
          return '团购';
        } else if (item.type === 5) {
          return '拍卖';
        } else if (item.type === 6) {
          return '充值订单';
        } else if (item.type === 7) {
          return '首单特惠';
        } else if (item.type === 8) {
          return '拼团';
        } else if (item.type === 9) {
          return '砍价订单';
        } else if (item.type === 10) {
          return '拼团直购';
        }
        return '';
      },
      changeTab(item) {
        this.activeItem = item.val;
        this.$router.replace({name: 'order', query: {type: item.val}});
        this._reset();
        this.fetchData(true);
      },
      showOrder(order) {
        if ((order.type === 8 || order.type === 9) && (order.status === 0 || order.status === 4)) {
          return false;
        } else if (this.activeItem === -1) {
          return true;
        } else if (order.status === this.activeItem) {
          return true;
        }
        return false;
      },
      showOrderDetail(order) {
        this.$router.push({name: 'orderdetail', params: {id: order.orderNo}});
      },
      showProductDetail(order, product) {
        if (order.type === 3) { // 秒杀
          this.$router.push({name: 'seckillDetail', params: {id: product.id}});
        } else if (order.type === 4) {  // 团购
          this.$router.push({name: 'groupbuyDetail', params: {id: product.id}});
        } else if (order.type === 5) {  // 拍卖
          this.$router.push({name: 'auctiondetail', params: {id: product.id}});
        } else if (order.type === 7) {  // 首单特惠
          this.$router.push({name: 'firstdetail', params: {id: product.id}});
        } else if (order.type === 8 || order.type === 10) {  // 8: 拼团, 10: 拼团直购
          this.$router.push({name: 'tuandetail', params: {id: product.id}, query: {tuanId: order.spreadId || ''}});
        } else if (order.type === 9) {  // 砍价订单
          this.$router.push({name: 'sharedetail', params: {id: product.id}, query: {shareId: order.spreadId || ''}});
        } else {
          this.$router.push({name: 'good', params: {id: product.id}});
        }
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
      loadMore() {
        this.fetchData();
      },
      goFillAddress(order) {
        this.$router.push({name: 'filladdress', params: {id: order.orderNo}});
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      weixinPay(order) {
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.openid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        this.paying = true;
        let payParams = {
          totalFee: order.totalFee || 0,
          openid: userInfo.openid,
          orderNo: order.orderNo,
          body: order.title || order.products[0].name,
          orderId: order.id
        };
        api.wxpay(payParams).then((response) => {
          this.paying = false;
          let that = this;
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              'appId': response.appId,
              'timeStamp': response.timeStamp || +new Date(),
              'nonceStr': response.nonceStr,
              'package': response.packageValue,
              'signType': response.signType || 'MD5',
              'paySign': response.paySign
            }, function(res) {
              // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                that.$store.dispatch('openToast', '支付成功！');
                that._reset();
                that.fetchData(true);
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                that.$store.dispatch('openToast', '取消支付！');
                if (order.type === 8) {
                  // 拼团订单取消付款，删除拼团订单
                  api.deleteTuan(order.orderNo);
                }
              } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                that.$store.dispatch('openToast', '支付失败！');
              }
              that.$router.push('order');
            }
          );
          pay();
        }).catch(response => {
          this.paying = false;
        });
      }
    },
    components: {
      fixedheader, gotop
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    top: 0
    width: 100%
    height: 44px
    overflow: hidden
    z-index: 2
  .order
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .order-wrap
      position: relative
      width: 100%
      .btn-red
        background: #d05148
        color: #f1f1f1
      .btn-blue
        background: #3a77e7
        color: #fff
      .btn-green
        background: #44b549
        color: #fff
      .btn-orange
        background: rgba(250,180,90,0.93)
        color: #f1f1f1
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
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .order-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .order-list
          position: relative
          width: 100%
          .order-item
            padding-bottom: 15px
            border-1px(rgba(7, 17, 27, 0.1))
            .item-title
              position: relative
              width: 100%
              height: 40px
              line-height: 40px
              font-size: 14px
              background-color: #e1e1e1
              padding: 0 8px
              box-sizing: border-box
              &:after
                position: absolute
                display: block
                width: 8px
                height: 8px
                content: ""
                border-top: 1px solid #666
                border-left: 1px solid #666
                -webkit-transform-origin: 50%
                transform-origin: 50%
                -webkit-transform: rotate(135deg)
                transform: rotate(135deg)
                top: 50%
                right: 10px
                margin-top: -4px
              .op-btns
                display: inline-block
                float: right
                padding-right: 20px
              .orderflag
                margin-left: 5px
                font-size: 13px
                font-weight: 700
            .item-summary
              position: relative
              display: flex
              padding: 0 8px
              font-size: 14px
              border-top-1px(rgba(7, 17, 27, 0.1))
              border-1px(rgba(7, 17, 27, 0.1))
              box-sizing: border-box
              .summary
                position: relative
                flex: 1
                p
                  height: auto
                  line-height: 1
                  &.status
                    padding-top: 13px
                    padding-bottom: 5px
                  &.price
                    height: auto
                    line-height: 1
                    padding-bottom: 5px
                  .text
                    color: #f15353
              .ops
                width: 45%
                float: right
                text-align: right
                padding: 10px 0
                height: 50px
                box-sizing: border-box
                overflow: hidden
                .button
                  display: inline-block
                  padding: 6px 10px
                  text-align: center
                  margin-left: 5px
                  font-size: 12px
                  &:first-child
                    margin-left: 0
            .item-content
              position: relative
              display: flex
              padding: 4px 8px 5px
              font-size: 13px
              box-sizing: border-box
              .item-img
                display: inline-block
                float: left
                width: 30%
                img
                  width: 95%
                  overflow: hidden
              .item-info
                position: relative
                flex: 1
                padding: 0 5px 5px 0
                box-sizing: border-box
                >.title
                  padding-top: 8px
                  position: relative
                  color: #666
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                  line-height: 1.3
              .item-pay
                position: relative
                width: 50px
                float: right
                text-align: right
                padding-top: 8px
                color: #666
                .price
                  padding-bottom: 8px
                  color: #e4393c
                  font-weight: 400
                .nums
                  text-align: right
      .no-order
        position: relative
        top: 44px
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
  .address-list-wrap
    position: absolute
    left: 0
    top: auto
    bottom: 0
    z-index: 42
    width: 100%
    max-height: 395px
    background: #fff
    transform: translate3d(0, 0, 0)
    overflow: hidden
    .address
      height: 395px
      overflow: hidden
     .address-wrap
        max-height: 385px
        overflow: hidden
    &.move-enter-active, &.move-leave-active
      transform: translate3d(0, 0, 0)
      transition: all 0.5s
    &.move-enter, &.move-leave-active
      transform: translate3d(0, 100%, 0)
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    bottom: 0
    z-index: 40
    transition: all 0.5s
    background: rgba(7, 17, 27, 0.6)
    &.fade-transition
      transition: all 0.5s
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
