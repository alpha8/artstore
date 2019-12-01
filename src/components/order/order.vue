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
                <span class="order_sn">订单号：{{order.orderSn}}<span class="orderflag" v-if="order.type">({{orderTypeDesc(order)}})</span></span>
                <span class="order_state" :class="{'red': order.status == 0}">{{statusDesc(order)}}</span>
              </div>
              <div class="item-content" v-for="product in order.orderItemList">
                <div class="item-img" @click.stop.prevent="showProductDetail(order, product)"><img :src="getThumbnail(product.productPic)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showOrderDetail(order)">{{product.productName}}</h3>
                  <div class="sku_line" v-show="product.sp1">
                    <div class="sku">{{`${product.sp1 || ''} ${product.sp2 || ''}  ${product.sp3 || ''}`}}</div>
                  </div>
                </div>
                <div class="item-pay">
                  <p class="price">{{product.productPrice | currency}}</p>
                  <p class="nums">x{{product.productQuantity}}</p>
                </div>
              </div>
              <div class="order_total_bar">
                <div class="total_count"><span v-if="order.orderItemList.length">{{getTotalQtyDesc(order)}}</span></div>
                <div class="payment">{{getPaymentText(order)}}：<span class="price">{{order.payAmount | currency}}</span></div>
              </div>
              <div class="item-footer border-top-1px">
                <span class="order_tips" v-if="order.status == 0">{{getLeftTime(order)}}</span>
                <span class="order_tips" v-else></span>
                <span class="button btn-white" v-if="order.status != 0"  @click="viewSameType(order)">看相似</span>
                <span class="button btn-red" v-if="order.status == 0" @click.stop.prevent="weixinPay(order)">去支付</span>
                <!-- <span class="button btn-green" v-if="order.status === 10">催单</span>
                <span class="button btn-blue" v-if="order.status === 10">去评价</span>
                <span class="button btn-red" v-if="order.status === 10">再次购买</span>-->
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
          <el-backtop target=".order-container" :bottom="55" :right="10"></el-backtop>
        </div>
        <div class="no-order" v-show="showRecords === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
      </div>
    </div>
    <quietlogin/>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import {formatDate, countdown} from '@/common/js/date';
  import quietlogin from '@/components/common/quietlogin';

  export default {
    data() {
      return {
        tabItems: [
          { text: '全部', val: '' },
          { text: '待付款', val: 0 },
          { text: '待发货', val: 1 },
          { text: '待收货', val: 2 },
          { text: '已完成', val: 3 }
        ],
        orders: [],
        activeItem: '',
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消', '退款申请中', '退款中', '已退款', '退款失败'],
        pageNumber: 1,
        pageSize: 20,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        paying: false
      };
    },
    activated() {
      this.loadEnd = false;
      let type = this.$route.query.type;
      if (typeof type === 'undefined' || type == '') {
        this.activeItem = '';
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
        if (!this.activeItem) {
          return true;
        } else {
          return this.orders.filter((order) => order.status === this.activeItem).length;
        }
      }
    },
    mounted() {
      this.scroller = this.$refs.orderlist;
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
          status: this.activeItem
        }).then(response => {
          if (response.code == 200) {
            if (response.data && response.data.list && response.data.list.length) {
              response.data.list.forEach(item => {
                this.orders.push(item);
              });
              this.totalPages = response.data.totalPage;
            }
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
      getLeftTime(order) {
        let result = countdown(order.leftPayTimes / 1000);
        var text = `支付剩余`;
        if (result.hours) {
          text += result.hours + '时';
        }
        if (result.mins) {
          text += result.mins + '分';
        }
        return text;
      },
      _reset() {
        this.orders = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = true;
      },
      getThumbnail(pic) {
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getTotalQtyDesc(order) {
        var total = 0;
        order.orderItemList.map(item => {
          total += item.productQuantity;
        });
        return `共${total}件商品`;
      },
      getPaymentText(order) {
        if (order.status == 0) {
          return '应付金额';
        }
        return '实付金额';
      },
      statusDesc(order) {
        return this.mapStatus[order.status];
      },
      orderTypeDesc(item) {
        if (item.orderType == 1) {
          return '秒杀订单';
        }
        return '正常订单';
      },
      changeTab(item) {
        this.activeItem = item.val;
        this.$router.replace({name: 'order', query: {type: item.val}});
        this._reset();
        this.fetchData(true);
      },
      showOrder(order) {
        if (!this.activeItem) {
          return true;
        } else if (order.status === this.activeItem) {
          return true;
        }
        return false;
      },
      showOrderDetail(order) {
        this.$router.push({name: 'orderdetail', params: {id: order.orderSn}});
      },
      showProductDetail(order, product) {
        if (order.orderType == 1) { // 秒杀
          this.$router.push({name: 'seckillDetail', params: {id: product.id}});
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
      viewSameType(order) {
        let cid = order.orderItemList.length && order.orderItemList[0].productCategoryId || '';
        this.$router.push({name: 'search', query: {cid: cid}});
      },
      wxpay(params, order) {
        let that = this;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': params.appId,
            'timeStamp': params.timeStamp,
            'nonceStr': params.nonceStr,
            'package': params.package,
            'signType': params.signType,
            'paySign': params.paySign
          }, function(res) {
            that.paying = false;
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.$store.dispatch('openToast', '支付成功！');
              that.$router.push({name: 'orderdetail', params: {id: order.orderSn}});
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              that.$store.dispatch('openToast', '取消支付！');
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              that.$store.dispatch('openToast', '支付失败！');
            } else {
              that.$router.push({name: 'orderdetail', params: {id: order.orderSn}});
            }
          }
        );
        pay(params);
      },
      weixinPay(order) {
        let openId = this.$store.getters.getOpenId || this.$store.getters.userInfo.openId;
        if (!openId) {
          this.$store.dispatch('openToast', '正在登录中...');
          window.location.href = `${api.CONFIG.ctx}/weixin/base?url=` + encodeURI(location.href);
          return;
        }
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        this.paying = true;
        if (!order.prepayId) {
          api.unifiedOrder({
            openId: openId,
            orderSn: order.orderSn
          }).then(response => {
            if (response.code != 200) {
              this.paying = false;
              this.$store.dispatch('openToast', response.message);
            } else {
              this.paying = false;
              if (response.data.finish) {
                this.$router.push({name: 'orderdetail', params: {id: order.orderSn}});
                return;
              }
              if (!response.data.apiSign) {
                this.$store.dispatch('openToast', '微信支付配置失败，请联系管理后重试!');
                return;
              }
              this.wxpay(response.data.apiSign, order);
            }
          });
        } else {
          api.wxpaySign(order.prepayId).then(response => {
            this.paying = false;
            if (response.code == 200) {
              this.wxpay(response.data, order);
            } else {
              this.$store.dispatch('openToast', '微信支付配置失败，请联系管理后重试!');
            }
          }).catch(error => {
            this.paying = false;
            console.log(error);
            this.$message('网络开了小差，请稍候再试');
          });
        }
      }
    },
    components: {
      fixedheader, quietlogin
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
        padding-bottom: 60px
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        overflow: auto
        .order-list
          position: relative
          width: 100%
          padding: 5px 10px
          box-sizing: border-box
          .order-item
            margin-bottom: 15px
            background: #fff
            border-radius: 8px
            .item-title
              position: relative
              width: 100%
              height: 40px
              line-height: 40px
              font-size: 14px
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
              .order_state
                color: #333
                font-size: 13px
                display: inline-block
                float: right
                padding-right: 20px
                &.red
                  color: #e93b3d
              .orderflag
                margin-left: 5px
                font-size: 13px
                font-weight: 700
            .item-footer
              display: flex
              padding: 10px 10px 0 0
              font-size: 14px
              color: #333
              height: 40px
              position: relative
              .order_tips
                flex: 1
                text-align: right
                font-size: 12px
                padding-top: 6px
              .button
                display: inline-block
                text-align: center
                width: 80px
                border-radius: 4px
                margin-left: 5px
                font-size: 13px
                flex-shrink: 0
                color: #fff
                border: none
                height: 30px
                line-height: 30px
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
            .item-content
              position: relative
              display: flex
              padding: 4px 8px 5px
              font-size: 13px
              box-sizing: border-box
              .item-img
                display: inline-block
                float: left
                width: 75px
                height: 75px
                margin-right: 10px
                img
                  width: 100%
                  height: 100%
                  overflow: hidden
              .item-info
                position: relative
                flex: 1
                padding: 0 5px 5px 0
                box-sizing: border-box
                >.title
                  padding-top: 8px
                  color: #333
                  position: relative
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  /*! autoprefixer: off */
                  -webkit-box-orient:vertical
                  /*! autoprefixer: on */
                  line-height: 1.2
                  font-size: 13px
                >.sku_line
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
                    flex: 1
                    border-radius: 2px
                    overflow: hidden
                    text-overflow: ellipsis
                    display: -webkit-box
                    -webkit-line-clamp: 2
                    /*! autoprefixer: off */
                    -webkit-box-orient:vertical
                    /*! autoprefixer: on */
              .item-pay
                position: relative
                width: 50px
                float: right
                text-align: right
                padding-top: 8px
                color: #333
                .price
                  padding-bottom: 8px
                  font-weight: 400
                .nums
                  text-align: right
            .order_total_bar
              padding: 6px 0
              position: relative
              display: flex
              .total_count
                margin-left: 10px
                font-size: 14px
                color: #999
                line-height: 21px
                text-align: right
                font-size: 12px
                flex: 1
              .payment
                margin-left: 10px
                font-size: 14px
                color: #999
                line-height: 21px
                padding-right: 10px
                >.price
                  color: #151515      
      .no-order
        position: relative
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
