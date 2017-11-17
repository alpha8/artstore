<template>
  <div>
    <fixedheader title="订单详情页"></fixedheader>
    <div class="orderdetail" ref="orderdetail">
      <div class="detail-wrap">
        <div class="order-info">
          <div class="order-state">
            <p><label>订单状态：</label><span class="text-blue">{{statusDesc}}</span></p>
            <p v-if="order.type"><label>订单类型：</label><span>{{orderTypeDesc}}</span></p>
            <p><label>订单编号：</label><span>{{order.orderNo}}</span></p>
            <p><label>下单时间：</label><span>{{order.createAt | formatDate}}</span></p>
            <div v-if="order.refund">
              <p v-if="order.refund.userStage"><label>发起退款：</label><span>{{order.refund.userStage.createTime | formatDate}}</span></p>
              <p v-if="order.refund.userStage"><label>退款原因：</label><span>{{order.refund.userStage.desc}}</span></p>
              <p v-if="order.refund.auditStage && order.refund.auditStage.createTime"><label>审批退款：</label><span>{{order.refund.auditStage.createTime | formatDate}}</span></p>
              <p v-if="order.refund.auditStage"><label>审批备注：</label><span>{{order.refund.auditStage.desc}}</span></p>
              <p v-if="order.refund.finishStage"><label>退款成功：</label><span>{{order.refund.finishStage.createTime | formatDate}}</span></p>
            </div>
            <p v-if="order.receiverAt"><label>订单完成：</label><span>{{order.receiverAt | formatDate}}</span></p>
          </div>
        </div>
        <split v-if="order.express"></split>
        <div class="title" v-if="order.express">配送信息</div>
        <div class="delivery-info" v-if="order.express">
          <p><label>收货地址：</label><span>{{order.express.expressAddress}}</span></p>
          <p><label>收货人：</label><span>{{order.express.receiver}}</span></p>
          <p><label>联系方式：</label><span>{{order.express.mobile}}</span></p>
          <p v-if="order.express.expressNo"><label>快递单号：</label><span>{{order.express.expressNo}}</span></p>
          <p v-if="order.express.expressCompany"><label>快递公司：</label><span>{{order.express.expressCompany}}</span></p>
          <p v-if="order.express.deliverAt"><label>发货时间：</label><span>{{order.express.deliverAt | formatDate}}</span></p>
          <p><label>支付方式：</label><span>在线支付</span></p>
          <!-- <p><label>发票信息：</label><span>普通发票</span></p> -->
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
            <li>商品总额<span class="text-red">{{order.totalFee + (order.couponFee || 0) + (order.discount || 0) | currency}}</span></li>
            <li>运费<span class="text-red">+ {{order.shipFee || 0 | currency}}</span></li>
            <li>优惠券<span class="text-red">- {{order.couponFee || 0 | currency}}</span></li>
            <li>商家折扣<span class="text-red">- {{order.discount || 0 | currency}}</span></li>
          </ul>
          <p class="total">
            实付金额：<strong class="text-red">{{order.totalFee | currency}}</strong>
          </p>
        </div>
      </div>
    </div>
    <div class="footer border-top-1px">
      <div class="btn-group">
       <div class="button" v-if="order.status === 0 && !order.express" @click.stop.prevent="goFillAddress"><span class="btn-red">填写收货地址</span></div>
        <div class="button" v-else-if="order.status === 0" @click.stop.prevent="weixinPay"><span class="btn-red">支付</span></div>
        <div class="button" v-if="order.status === 0" @click.stop.prevent="cancelOrder"><span class="btn-white">取消订单</span></div>
        <div class="button" v-if="order.status === 1" @click.stop.prevent="showRefund"><span class="btn-red">申请退款</span></div>
        <div class="button" v-if="order.status === 5" @click.stop.prevent="cancelRefund"><span class="btn-red">取消退款申请</span></div>
        <div class="button" v-if="order.status === 2" @click.stop.prevent="trackExpress"><span class="btn-white">查看物流</span></div>
        <div class="button" v-if="order.status === 2" @click.stop.prevent="confirmDelivery"><span class="btn-green">确认收货</span></div>
        <div class="button" v-if="order.status === 6"><span class="btn-white">看相似</span></div>
        <div class="button" v-if="order.status === 6"><span class="btn-orange">再次购买</span></div>
      </div>
    </div>
    <transition name="move">
      <div class="order-refund-wrap" v-show="showBox">
        <refund :order="order" ref="refund" @update="hideRefund"></refund>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" @click.stop.prevent="hideRefund" v-show="showBox"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import refund from '@/components/order/refund';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';

  export default {
    data() {
      return {
        showBox: false,
        order: {
          express: {}
        },
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消', '退款申请中', '退款中', '已退款'],
        paying: false
      };
    },
    activated() {
      this.fetchData();
      this.show();
    },
    deactivated() {
      this.hide();
      this.paying = false;
    },
    computed: {
      statusDesc() {
        return this.mapStatus[this.order.status];
      },
      trackExpressState() {
        if (this.order.status === 2) {
          return `https://m.kuaidi100.com/index_all.html?type=${this.order.express.expressCompany}&postid=${this.order.express.expressNo}`;
        }
        return '';
      },
      orderTypeDesc() {
        if (this.order.type === 3) {
          return '秒杀';
        } else if (this.order.type === 4) {
          return '团购';
        } else if (this.order.type === 5) {
          return '拍卖';
        }
        return '';
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
        let id = this.$route.params.id || '';
        if (!id) {
          this.$store.dispatch('openToast', '非法访问！');
          return;
        }
        api.getOrderDetail({ orderNo: id }).then(response => {
          this.order = response;
          this._initScroll();
        }).catch(response => {
          this.$store.dispatch('openToast', '数据出错，请联系后台管理员！');
          this.$router.back();
          return;
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
      },
      cancelOrder() {
        api.cancelOrder({
          id: this.order.id
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '订单已取消！');
            this.$router.push('/order');
          } else {
            this.$store.dispatch('openToast', '订单取消失败！');
          }
        });
      },
      trackExpress() {
        this.$router.push({name: 'expresslog', params: {expressNo: this.order.express.expressNo, expressCode: this.order.express.expressCode || 'unknown'}});
      },
      goFillAddress() {
        this.$router.push({name: 'filladdress', params: {id: this.order.orderNo}});
      },
      weixinPay() {
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
          totalFee: this.order.totalFee || 0,
          openid: userInfo.openid,
          orderNo: this.order.orderNo,
          body: this.order.title || this.order.products[0].name
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
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                that.$store.dispatch('openToast', '取消支付！');
              } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                that.$store.dispatch('openToast', '支付失败！');
              }
            }
          );
          pay();
        }).catch(response => {
          this.paying = false;
        });
      },
      hideRefund() {
        this.showBox = false;
      },
      showRefund() {
        this.showBox = true;
        this.$refs.refund.show();
      },
      cancelRefund() {
        api.cancelRefund({
          orderNo: this.order.orderNo
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '退款申请已取消！');
            this.order.status = 1;
          } else {
            this.$store.dispatch('openToast', '网络太忙，请稍候再试！');
          }
        });
      },
      confirmDelivery() {
        api.confirmDelivery({
          orderNo: this.order.orderNo
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '订单已完成，期待再会！');
            this.order.status = 3;
          } else {
            this.$store.dispatch('openToast', '网络太忙，请稍候再试！');
          }
        });
      }
    },
    components: {
      fixedheader, split, refund
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
          display: inline-block
          float: left
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
  .order-refund-wrap
    position: absolute
    left: 0
    top: auto
    bottom: 0
    z-index: 42
    width: 100%
    min-height: 300px
    max-height: 395px
    background: #fff
    transform: translate3d(0, 0, 0)
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
