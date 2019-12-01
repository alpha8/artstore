<template>
  <div>
    <fixedheader title="订单详情页"></fixedheader>
    <div class="orderdetail" ref="orderdetail" :class="{'nofooter': !canShowFooter}">
      <div class="detail-wrap">
        <div class="order_state">
          <div class="icon-time_of_appointment"></div>
          <div class="state_content">
            <div class="state_text">
              <span class="desc">{{statusDesc}}</span>
              <span class="timeLeft" v-if="order.status == 0">{{getLeftTime()}}</span>
            </div>
            <div class="status_price">应付金额：{{order.payAmount | currency}}</div>
            <div class="state_tip"></div>
          </div>
          <div class="dot_bg"></div>
        </div>
        <div class="order_express" v-if="order.receiverName">
          <div class="express_content">
            <span class="icon-address"></span>
            <div class="content_text">
              <div class="express_text">{{order.receiverName}} {{order.receiverPhone | mixPhone}}</div>
              <span class="express_tip">{{getFullAddress(order)}}</span>
            </div>
          </div>
        </div>
        <split></split>
        <div class="title">商品列表</div>
        <ul class="goods-info">
          <li class="good-item" v-for="product in order.orderItemList" @click.stop.prevent="showProductDetail(product)">
            <div class="item-img"><img :src="getThumbnail(product.productPic)" alt=""></div>
            <div class="item-info">
              <h3 class="title">{{product.productName}}</h3>
              <div class="sku_line" v-show="product.sp1">
                <div class="sku">{{`${product.sp1 || ''} ${product.sp2 || ''}  ${product.sp3 || ''}`}}</div>
              </div>
            </div>
            <div class="item-pay">
              <p class="price">{{product.productPrice | currency}}</p>
              <p class="nums">x{{product.productQuantity}}</p>
            </div>
          </li>
        </ul>        
        <split></split>
        <div class="order-info">
          <div class="order-state">
            <p v-if="order.type"><label>订单类型：</label><span>{{orderTypeDesc}}</span></p>
            <p><label>下单时间：</label><span>{{order.createTimes | formatDate}}</span></p>
            <p v-if="order.paymentTime"><label>付款时间：</label><span>{{order.paymentTimes | formatDate}}</span></p>
            <p v-if="order.deliveryTime"><label>发货时间：</label><span>{{order.deliveryTimes | formatDate}}</span></p>
            <p v-if="order.receiveTime"><label>完成时间：</label><span>{{order.receiveTimes | formatDate}}</span></p>
            <!-- <div v-if="order.refund">
              <p v-if="order.refund.userStage"><label>发起退款：</label><span>{{order.refund.userStage.createTime | formatDate}}</span></p>
              <p v-if="order.refund.userStage"><label>退款原因：</label><span>{{order.refund.userStage.desc}}</span></p>
              <p v-if="order.refund.auditStage && order.refund.auditStage.createTime"><label>审批退款：</label><span>{{order.refund.auditStage.createTime | formatDate}}</span></p>
              <p v-if="order.refund.auditStage"><label>审批备注：</label><span>{{order.refund.auditStage.desc}}</span></p>
              <p v-if="order.refund.finishStage"><label>退款成功：</label><span>{{order.refund.finishStage.createTime | formatDate}}</span></p>
            </div> -->
            <p v-if="order.note"><label>订单备注：</label><span>{{order.note}}</span></p>
            <p v-if="order.deliverySn"><label>配送方式：</label><span>{{order.deliveryCompany}} {{order.deliverySn}}</span>
              <!-- &nbsp;&nbsp;<el-button class="ml10" type="text" size="medium"
              v-clipboard="order.deliverySn"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">点击复制</el-button> -->
            </p>
            <p><label>支付方式：</label><span>在线支付</span></p>
          </div>
        </div>
        <div class="price-summary">
          <ul>
            <li>商品总额<span class="text-red">{{order.totalAmount | currency}}</span></li>
            <li>运费<span class="text-red">+ {{order.freightAmount || 0 | currency}}</span></li>
            <li>优惠券<span class="text-red">- {{order.couponAmount || 0 | currency}}</span></li>
            <li>折扣金额<span class="text-red">- {{order.discountAmount || 0 | currency}}</span></li>
            <li>积分抵扣<span class="text-red">- {{order.integrationAmount || 0 | currency}}</span></li>
          </ul>
          <p class="total">
            {{getPaymentText()}}：<strong class="text-red">{{order.payAmount | currency}}</strong>
          </p>
        </div>
      </div>
    </div>
    <div class="footer border-top-1px" v-if="canShowFooter">
      <div class="btn-group">
        <div class="button" v-if="order.status == 0" @click.stop.prevent="weixinPay"><span class="btn-red">支付</span></div>
        <div class="button" v-if="order.status == 0" @click.stop.prevent="cancelOrder"><span class="btn-white">取消订单</span></div>
        <!-- <div class="button" v-if="(order.status === 1 || order.status === 8) && !rejectCancelOrder" @click.stop.prevent="showRefund"><span class="btn-red">申请退款</span></div>
        <div class="button" v-if="order.status === 5" @click.stop.prevent="cancelRefund"><span class="btn-red">取消退款申请</span></div> -->
        <div class="button" @click="viewSameType()"><span class="btn-white">看相似</span></div>
        <div class="button" v-if="order.status == 2" @click.stop.prevent="trackExpress"><span class="btn-white">查看物流</span></div>
        <div class="button" v-if="order.status == 2" @click.stop.prevent="confirmDelivery"><span class="btn-green">确认收货</span></div>
        <!-- <div class="button" v-if="order.status === 60"><span class="btn-orange">再次购买</span></div> -->
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
    <quietlogin />
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import refund from '@/components/order/refund';
  import {formatDate, countdown} from '@/common/js/date';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import {mixPhone} from '@/common/js/util';
  import quietlogin from '@/components/common/quietlogin';

  export default {
    data() {
      return {
        showBox: false,
        order: {
          express: {}
        },
        mapStatus: ['待支付', '待发货', '待收货', '已完成', '已取消', '退款申请中', '退款中', '已退款', '退款失败'],
        paying: false,
        loginUser: this.$store.getters.userInfo
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
      orderTypeDesc() {
        if (this.order.orderStatus == 1) {
          return '秒杀订单';
        }
        return '普通订单';
      },
      canShowFooter() {
        let status = this.order.status;
        let canShowStatus = [0, 1, 2, 5];
        let isOwner = this.loginUser && this.loginUser.userId === this.order.userId;
        let ignoreOrderType = (this.order.type === 8 || this.order.type === 6) && this.order.status === 1;
        return canShowStatus.filter(o => o === status).length && isOwner && !ignoreOrderType;
      },
      isMime() {
        var fromNotice = this.$route.query.from || '';
        if (fromNotice && fromNotice === 'notice') {
          return true;
        }
        return this.loginUser.userId === this.order.memberId;
      },
      todoDelivery() {
        return this.order.status > 0;
      },
      totalPrice() {
        if (this.order && this.order.type === 6) {
          return this.order.totalFee;
        }
        let products = (this.order && this.order.products) || [];
        let total = 0;
        products.forEach(o => {
          total += (o.price * o.count);
        });
        return total;
      },
      discountFee() {
        let coupons = this.order && this.order.coupons || [];
        let total = 0;
        coupons.forEach(o => {
          total += (o.percentFee || 0);
        });
        return total;
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      mixPhone(phone) {
        return mixPhone(phone);
      }
    },
    methods: {
      onCopy({ value, event }) {
        console.log(value);
        this.$message.success('已复制到粘贴板');
      },
      onError() {
        console.log('复制失败！');
      },
      viewSameType() {
        let cid = this.order.orderItemList.length && this.order.orderItemList[0].productCategoryId || '';
        this.$router.push({name: 'search', query: {cid: cid}});
      },
      getPaymentText() {
        if (this.order.status == 0) {
          return '应付金额';
        }
        return '实付金额';
      },
      getFullAddress(item) {
        return `${item.receiverProvince || ''}${item.receiverCity || ''}${item.receiverRegion || ''}${item.receiverDetailAddress || ''}`;
      },
      getLeftTime() {
        let result = countdown(this.order.leftPayTimes / 1000);
        var text = `支付剩余`;
        if (result.hours) {
          text += result.hours + '时';
        }
        if (result.mins) {
          text += result.mins + '分';
        }
        return text;
      },
      fetchData() {
        let id = this.$route.params.id || '';
        if (!id) {
          this.$store.dispatch('openToast', '非法访问！');
          return;
        }
        api.getOrderDetail(id).then(response => {
          if (response.code == 200) {
            this.order = response.data;
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络太忙，请稍候再试！');
          this.$router.back();
          return;
        });
      },
      _getDeliveryLog() {
        api.getDeliveryLog({
          orderNo: this.order.orderNo
        }).then(response => {
          if (response.result === 0) {
            this.deliveryLog = response.data;
          }
        }).catch((response) => {
          console.error(response);
        });
      },
      showProductDetail(product) {
        if (this.order.orderType == 1) { // 秒杀
          this.$router.push({name: 'seckillDetail', params: {id: product.productId}});
        } else {
          this.$router.push({name: 'good', params: {id: product.productId}});
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
      getThumbnail(pic) {
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      trackExpress() {
        var no = this.order.deliverySn;
        if (!no) {
          this.$message('哟哦，快递单号没填，请联系客服处理！');
          return;
        }
        if (this.order.deliveryCompany == '顺丰速运') {
          let phone = this.order.receiverPhone;
          if (phone && phone.length > 4) {
            no += ':' + phone.substring(phone.length - 4);
          }
        }
        this.$router.push({name: 'expresslog', params: {no: no}, query: {company: this.order.deliveryCompany}});
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
              this.fetchData();
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              that.$store.dispatch('openToast', '取消支付！');
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              that.$store.dispatch('openToast', '支付失败！');
            } else {
              this.fetchData();
            }
          }
        );
        pay(params);
      },
      weixinPay() {
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
        if (!this.order.prepayId) {
          api.unifiedOrder({
            openId: openId,
            orderSn: this.order.orderSn
          }).then(response => {
            if (response.code != 200) {
              this.paying = false;
              this.$store.dispatch('openToast', response.message);
            } else {
              this.paying = false;
              if (response.data.finish) {
                this.fetchData();
                return;
              }
              if (!response.data.apiSign) {
                this.$store.dispatch('openToast', '微信支付配置失败，请联系管理后重试!');
                return;
              }
              this.wxpay(response.data.apiSign, this.order);
            }
          });
        } else {
          api.wxpaySign(this.order.prepayId).then(response => {
            this.paying = false;
            if (response.code == 200) {
              this.wxpay(response.data, this.order);
            } else {
              this.$store.dispatch('openToast', '微信支付配置失败，请联系管理后重试!');
            }
          }).catch(error => {
            this.paying = false;
            console.log(error);
            this.$message('网络开了小差，请稍候再试');
          });
        }
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
          orderSn: this.order.orderSn
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
        api.confirmDelivery(this.order.id).then(response => {
          if (response.code == 200) {
            this.$store.dispatch('openToast', '订单已完成，期待再会！');
            this.order.status = 3;
          } else {
            this.$store.dispatch('openToast', '网络太忙，请稍候再试！');
          }
        });
      },
      cancelOrder() {
        this.$confirm('您确定要取消此订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          api.cancelOrder(this.order.id).then(response => {
            this.fetchData();
          });
        });
      }
    },
    components: {
      fixedheader, split, refund, quietlogin
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .btn-red
    background: #f15353
    color: #f1f1f1
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
    color: #666
    border: 1px solid #ccc
  .orderdetail
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    overflow: auto
    -webkit-overflow-scrolling: touch
    &.nofooter
      bottom: 0
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
        background-color: #fff
      .order_state
        background-image: -webkit-gradient(linear,left top,right top,color-stop(0,#f66d70),to(#e93b3d));
        background-image: -webkit-linear-gradient(left,#f66d70,#e93b3d);
        background-image: linear-gradient(90deg,#f66d70,#e93b3d);
        color: #fff;
        padding: 12px 10px;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        font-size: 12px;
        line-height: 18px;
        position: relative;
        display: flex;
        &:before
          content: "";
          position: absolute;
          width: 50px;
          height: 20px;
          left: 0;
          bottom: 0;
          border-radius: 0 100% 0 0;
          background-image: -webkit-linear-gradient(60deg,#e93c3e 32%,#f66c6c 69%);
          background-image: linear-gradient(30deg,#e93c3e 32%,#f66c6c 69%);
        &:after
          width: 25px;
          height: 48px;
          right: 0;
          bottom: 0;
          border-radius: 100% 0 0 100%/50%;
          content: "";
          position: absolute;
          background-image: -webkit-linear-gradient(53deg,#e93c3e 8%,#f66d70 78%);
          background-image: linear-gradient(37deg,#e93c3e 8%,#f66d70 78%);
        .dot_bg
          content: "";
          position: absolute;
          background-image: -webkit-linear-gradient(53deg,#e93c3e 8%,#f66d70 78%);
          background-image: linear-gradient(37deg,#e93c3e 8%,#f66d70 78%);
          width: 33px;
          height: 20px;
          right: 100px;
          top: 0;
          border-radius: 0 0 50% 50%/50%;
        .icon-time_of_appointment
          font-size: 18px
        .state_content
          flex: 1;
          z-index: 5;
          padding-left: 10px
          .state_text
            line-height: 24px;
            position: relative;
          .desc
            flex: 1
            font-size: 16px;
            font-weight: 400;
            white-space: nowrap
            overflow: hidden;
            text-overflow: ellipsis;
          .timeLeft
            position: absolute;
            display: inline-block;
            right: 0;
            top: 0;
            z-index: 5;
      .order_express
        background-color: #fff;
        .express_content
          padding: 11px 10px 12px;
          align-items: center;
          position: relative;
          display: flex;
          .icon-address
            margin-right: 10px;
            font-size: 18px;
          .content_text
            flex: 1;
            .express_text
              font-size: 14px;
              line-height: 21px;
              color: #333;
            .express_tip
              font-size: 12px;
              line-height: 18px;
              color: #999;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient:vertical
              /*! autoprefixer: on */
              overflow: hidden;
              text-overflow: ellipsis;
      .expressLog-list
        position: relative
        width: 100%
        padding: 0 15px 0 38px
        font-size: 12px
        line-height: 1.5
        box-sizing: border-box
        .expressLog-item
          position: relative
          padding: 10px 0
          color: #999
          &:after
            content: "\20"
            display: block
            width: 1px
            height: 100%
            background: #999
            position: absolute
            left: -20px
            top: 20px
          &:first-child
            color: #333
            i
              border-color: #fb8a00
              &:after
                background-color: #fb8a00
          &:last-child:after
            background: none
          i
            position: absolute
            left: -24px
            top: 13px
            display: block
            width: 8px
            height: 8px
            background: #fff
            border-radius: 8px
            border: 1px solid #999
            z-index: 1
            &:after
              position: absolute
              top: 50%
              left: 50%
              margin: -3px 0 0 -3px
              content: "\20"
              display: block
              width: 6px
              height: 6px
              background: #999
              border-radius: 6px
          .msg-box
            position: relative
          small
            font-size: 10px
            color: #999
      .order-info, .delivery-info, .goods-info, .price-summary
        padding: 10px 8px
        background-color: #fff
        p
          line-height: 1.6
          font-size: 14px
          label
            display: inline-block
            min-width: 70px
            color: #999
          .text-blue
            color: #00a0dc
          .text-red
            color: #e4393c
      .delivery-info, .goods-info
        padding-top: 0
      .goods-info p
        line-height: 1
      .price-summary
        font-size: 14px
        padding-bottom: 20px
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
          padding: 8px 3px 0 2px
          box-sizing: border-box
          >.title
            position: relative
            font-size: 14px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            /*! autoprefixer: off */
            -webkit-box-orient:vertical
            /*! autoprefixer: on */
            line-height: 1.2
            color: #666
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
          div
            padding-top: 10px
        .item-pay
          position: relative
          width: 50px
          float: right
          text-align: right
          padding-top: 8px
          .price
            padding-bottom: 8px
            color: #e4393c
            font-weight: 400
          .nums
            text-align: right
            color: #666
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
      padding-top: 7.5px
      display: block
      width: 100%
      height: 100%
      box-sizing: border-box
      .button
        text-align: center
        float: right
        padding-right: 8px
        min-width: 74px
        box-sizing: border-box
        span
          box-sizing: border-box
          display: inline-block
          width: 100%
          height: 35px
          line-height: 35px
          padding: 0 8px
          border-radius: 3px
</style>
