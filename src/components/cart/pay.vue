<template>
  <div class="wxpay">
    <fixedheader title="确认订单" ref="header"></fixedheader>
    <div class="address-wrap" v-if="!selfservice">
      <div class="addressNull" v-show="!defaultAddress || !defaultAddress.address">
        <h3 @click.stop.prevent="showAddressList">！请填写收货地址</h3>
      </div>
      <div class="address-default address-border" v-show="defaultAddress && defaultAddress.address" @click.stop.prevent="showAddressList">
        <h3>收货地址</h3>
        <ul>
          <li>{{(defaultAddress.city || '') + defaultAddress.address}}</li>
          <li><strong>{{defaultAddress.name}}</strong><span class="mobile">{{defaultAddress.mobile}}</span></li>
        </ul>
      </div>
    </div>
    <div class="pay" ref="pay" :class="{'notop': selfservice}">
      <div class="order-wrap">
        <split v-if="!selfservice"></split>
        <div class="order-shop border-1px">一虎一席茶席艺术平台</div>
        <ul class="orderlist">
          <li class="product border-1px" v-for="product in products">
            <div class="thumbnail">
              <img :src="product.icon" alt="" class="photo">
            </div>
            <div class="sku-info">
              <p class="sku-name">{{product.name}}</p>
              <p class="sku-item"></p>
            </div>
            <div class="sku-ext">
              <p class="sku-price">{{product.price | currency}}</p>
              <p class="sku-count">x{{product.count}}</p>
            </div>
          </li>
        </ul>
        <ul class="shop-info">
          <li class="discount change" @click.stop.prevent="selectCoupon">
            <strong>折扣券：</strong>
            <span v-if="availCoupons.length">{{usedDiscount}}</span>
            <span v-else class="disabled">无可用</span>
          </li>
          <li>
            <strong>是否自提：</strong>
            <span @click.stop.prevent="delivery"><span class="icon icon-check_circle" :class="{'on': selfservice}"></span>线下自提</span>
          </li>
          <li class="shipping" v-show="!selfservice">
            <strong>配送方式：</strong>
            <span>快递</span>
          </li>
          <li class="shipping" v-show="defaultAddress && defaultAddress.address && !selfservice">
            <strong>快递费：</strong>
            <span>{{0 | currency}} (包邮)</span>
          </li>
         <!--  <li class="checkout-item change">
            <strong>发票信息</strong>
            <span>明细</span>
          </li> -->
        </ul>
        <split></split>
        <ul class="shop-info">
          <li class="checkout-item change item-border" @click.stop.prevent="openRemarkBox">
            <strong>备注/重要留言：</strong>
            <span class="nowrap-line remark">{{payRemarks}}</span>
          </li>
        </ul>
        <div class="payArea">
          <p class="price">
            <span class="label">商品总额：</span>
            <span class="totalPrice">{{totalFee | currency}}</span>
          </p>
          <p class="price">
            <span class="label">优惠券抵扣：</span>
            <span class="totalPrice">{{couponValue | currency}}</span>
          </p>
          <p class="price" v-show="discount">
            <span class="label">折扣券抵扣：</span>
            <span class="totalPrice">{{discount | currency}}</span>
          </p>
          <p class="price">
            <span class="label">应付金额：</span>
            <span class="totalPrice"><strong>{{totalFee - couponValue - discount | currency}}</strong></span>
          </p>
          <div class="payBtnList">
            <div class="btns btn-green" :class="{'btn-gray': paying}" @click.stop.prevent="weixinPay"><span>微信支付</span></div>
            <!-- <div class="btns btn-red"><span>京东支付</span></div>
            <div class="btns btn-lightblue"><span>货到付款</span></div> -->
          </div>
          <div class="countdownTips" v-if="countdownStats && countdownStats.milliseconds > 0">
            请在<span v-if="countdownStats.hours"><span class="red-text">{{countdownStats.hours}}</span>小时</span><span v-if="countdownStats.mins"><span class="red-text">{{countdownStats.mins}}</span>分</span><span v-if="countdownStats.seconds"><span class="red-text">{{countdownStats.seconds}}</span>秒</span>内完成支付，否则订单将自动取消。</div>
        </div>
      </div>
    </div>
    <transition name="move">
      <div class="address-list-wrap" v-show="showBox">
        <addressList ref="addresssList" @update="updateDefaultAddress"></addressList>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" @click.stop.prevent="hideAddressList" v-show="showBox"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import addressList from '@/components/my/addressList';
  import usecoupon from '@/components/coupon/usecoupon';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import {countdown} from '@/common/js/date';

  export default {
    data() {
      return {
        showBox: false,
        totalFee: 0,
        paying: false,
        remarks: '',
        countdownStats: {},
        timer: null,
        seckill: {},
        couponValue: 0,
        selfservice: false,
        coupons: [],
        discount: 0,
        discountTickets: []
      };
    },
    computed: {
      products() {
        return this.$store.getters.getPayGoods;
      },
      defaultAddress() {
        return this.$store.getters.getDefaultAddress;
      },
      payRemarks() {
        this.remarks = this.$store.getters.getPayRemark;
        return this.remarks;
      },
      usedDiscount() {
        let discounts = this.$store.getters.loadUsedDiscount;
        if (discounts && discounts.length) {
          this.discountTickets = discounts;
          return `已使用${discounts.length}张折扣券`;
        } else {
          this.discountTickets = [];
          return `您有${this.availCoupons.length}张可用折扣券`;
        }
      },
      availCoupons() {
        return this.coupons && this.coupons.filter(o => {
          return o.status === 0;
        });
      }
    },
    activated() {
      if (!this.$store.getters.getPayGoods.length) {
        this.$router.replace('/cart');
        return;
      }
      this.show();
      this._totalPrice();
      this.computeCouponValue();
      this._initScroll();
      this.countdown();
    },
    deactivated() {
      this.hide();
      this.paying = false;
      this.couponValue = 0;
      this.seckill = {};
      this.selfservice = false;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.discount = 0;
      this.coupons = [];
    },
    mounted() {
      this._initScroll();
    },
    methods: {
      loadCouponData() {
        let user = this.$store.getters.getUserInfo;
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('updateUserProfile', response);
            this.couponValue = response.wallet && response.wallet.totalValue || 0;
          }
        });
      },
      _initScroll() {
        // this.$nextTick(() => {
        //   if (!this.scroll) {
        //     this.scroll = new BScroll(this.$refs.pay, {
        //       click: true
        //     });
        //   } else {
        //     this.scroll.refresh();
        //   }
        // });
      },
      _totalPrice() {
        let total = 0;
        this.products.forEach((item) => {
          total += item.count * item.price;
        });
        this.totalFee = total;
      },
      delivery() {
        this.selfservice = !this.selfservice;
      },
      computeCouponValue() {
        let type = this.$route.query.orderType || 0;
        if (type >= 3) {
          return;
        }
        let user = this.$store.getters.getUserInfo;
        let items = [];
        this.products.forEach(product => {
          items.push({'id': product.id, 'count': product.count});
        });
        api.getAvailCouponAmount({
          userId: user.userId || 0,
          products: items
        }).then(response => {
          this.couponValue = response.couponFee || 0;
          if (response.oldTotalFee) {
            this.totalFee = response.oldTotalFee;
          }
          this.coupons = response.otherCoupons || [];
          this._calcDiscount();
        }).catch(response => {
          console.log(response);
        });
      },
      _calcDiscount() {
        let user = this.$store.getters.getUserInfo;
        let coupons = this.$store.getters.loadUsedDiscount;
        if (coupons && coupons.length) {
          coupons.forEach(o => {
            if (o.type === 1 && user.userId === o.userId) {
              this.discount = (this.totalFee - this.couponValue) * (1 - o.payValue);
            }
          });
        }
      },
      openRemarkBox() {
        this.$router.push('/pay/remark');
      },
      selectCoupon() {
        this.$router.push('/discount/ticket');
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      hideAddressList() {
        this.showBox = false;
      },
      showAddressList() {
        this.showBox = true;
        this.$refs.addresssList.show();
      },
      updateDefaultAddress() {
        this.showBox = false;
        this.defaultAddress = this.$store.getters.getDefaultAddress;
      },
      countdown() {
        let createTime = 0;
        this.products.forEach((item) => {
          createTime = item.createTime;
          if (createTime) {
            this.seckill = item;
          }
        });
        if (!createTime) {
          return;
        }
        let cTime = (new Date(createTime + 40 * 60000).getTime() - (+new Date())) / 1000;
        this.countdownStats = countdown(cTime);
        this.timer = setInterval(() => {
          if (this.countdownStats.milliseconds <= 0) {
            clearInterval(this.timer);
            if (!this.seckill.id) {
              return;
            }
            // 取消订单
            let userId = this.$store.getters.getUserInfo.userId;
            api.cancelSeckillOrder({
              seckillId: this.seckill.id,
              userId: userId
            }).then(response => {
              if (response.success) {
                this.$store.dispatch('openToast', '支付超时，订单已取消');
                this.$store.dispatch('removeKillProduct', this.seckill.id);
                this.$store.dispatch('cleanUsedDiscount');
                setTimeout(() => {
                  this.$router.push('/my');
                }, 1500);
                return;
              }
            });
          }
          this.countdownStats = countdown(--cTime);
        }, 1000);
      },
      back() {
        this.$router.back();
      },
      weixinPay() {
        if (!this.selfservice && !this.defaultAddress.address) {
          this.$store.dispatch('openToast', '请选择收货人信息');
          return;
        }
        let orderType = this.$route.query.orderType || 0;
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.openid) {
          this.$store.dispatch('openToast', '正在登录中...');
          setTimeout(() => {
            let redirect = 'http://' + location.host + '/weixin/pay';
            if (orderType >= 3) {
              redirect += '?orderType=' + orderType;
            }
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        this.$store.dispatch('cleanUsedDiscount');
        let params = {
          openid: userInfo.openid,
          userId: userInfo.userId,
          totalPrice: this.totalFee,
          remarks: this.remarks,
          type: orderType
        };
        if (this.selfservice) {
          params.express = {
            expressAddress: '线下自提',
            mobile: '',
            receiver: userInfo.nickName || ''
          };
        } else {
          params.express = {
            expressAddress: (this.defaultAddress.city || '') + this.defaultAddress.address,
            mobile: this.defaultAddress.mobile,
            receiver: this.defaultAddress.name
          };
        }
        let goodsId = '';
        let seckillId = 0;
        if (orderType === '8' || orderType === '9') {
          // 拼团订单和分享订单采用预订单ID作为产品ID给后台
          let items = [];
          this.products.forEach(product => {
            goodsId = product.id;
            items.push({'id': product.preOrderId || product.id, 'count': product.count});
          });
          params.products = items;
        } else {
          let items = [];
          this.products.forEach(product => {
            seckillId = product.id;
            items.push({'id': product.id, 'count': product.count});
          });
          params.products = items;
        }
        if (this.discount) {
          params.coupons = this.discountTickets;
        }
        this.paying = true;
        api.createOrder(params).then(response => {
          if (response.result !== 0) {
            if (orderType === '7') {
              // 首单订单失败，存在未付款的订单或已经参加过首单
              if (response.order && response.order.status === 0) {
                this.$store.dispatch('openToast', '你有一个未付款的首单订单!');
                this.$router.replace({name: 'orderdetail', params: {id: response.order && response.order.orderNo}});
              } else {
                this.$store.dispatch('openToast', '你已经参加过首单优惠了! 看看其他的吧!');
              }
              return;
            }
            this.$store.dispatch('openToast', '生成订单失败！');
            this.paying = false;
            return;
          }
          let order = response.order;
          let payParams = {
            totalFee: order.totalFee,
            openid: userInfo.openid,
            orderNo: order.orderNo,
            body: order.body,
            orderId: order.orderId
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
                that.$store.dispatch('clearPayGoods');
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  that.$store.dispatch('openToast', '支付成功！');
                  if (orderType === '8') {
                    that.$router.replace('mytuan');
                    return;
                  } else if (orderType === '9') {
                    that.$router.replace('myshare');
                    return;
                  } else if (orderType === '3') {
                    api.finishSeckill(seckillId, order.orderNo);
                  }
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  that.$store.dispatch('openToast', '取消支付！');
                  if (orderType === '8') {
                    // 拼团订单取消付款，删除拼团订单
                    api.deleteTuan(order.orderNo);
                    that.$router.replace({name: 'tuandetail', params: {id: goodsId}});
                    return;
                  } else if (orderType === '9') {
                    that.$router.replace({name: 'sharedetail', params: {id: goodsId}});
                    return;
                  }
                } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                  that.$store.dispatch('openToast', '支付失败！');
                }
                that.$router.replace('order');
              }
            );
            pay();
          }).catch(response => {
            this.paying = false;
          });
        }).catch(response => {
          this.paying = false;
        });
      }
    },
    components: {
      split, fixedheader, addressList, usecoupon
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .wxpay
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 2    
    >.address-wrap
      position: fixed
      width: 100%
      height: 70px
      top: 44px
      z-index: 8
      background: #fff
      .addressNull
        position: relative
        padding: 0 10px
        h3
          position: relative
          font-size: 14px
          padding: 24px 30px 24px 0
          font-weight: 400
          &:after
            content: ""
            display: block
            width: 8px
            height: 8px
            border-top: 1px solid #666
            border-left: 1px solid #666
            -webkit-transform-origin: 50%
            transform-origin: 50%
            -webkit-transform: rotate(135deg)
            transform: rotate(135deg)
            position: absolute
            top: 50%
            right: 5px
            margin-top: -5px
      .address-default
        position: relative
        background: #fff
        padding: 12px 10px 12px 58px
        line-height: 1.5
        &.address-border
          padding-bottom: 16px
          background: #fff url(../../common/images/line.png) -7px bottom repeat-x
          background-size: 60px 4px
        h3
          position: absolute
          top: 12px
          left: 10px
          width: 2em
          font-weight: 400
          font-size: 14px
          color: #999
        strong
          font-weight: 400
        ul
          position: relative
          padding-right: 30px
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
            right: 5px
            margin-top: -4px
          li
            display: -webkit-box
            text-overflow: ellipsis
            overflow: hidden
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            font-size: 14px
            height: 21px
            >.mobile
              margin-left: 10px
    >.pay
      position: absolute
      top: 114px
      left: 0
      bottom: 0
      width: 100%
      background: #fff
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      &.notop
        top: 44px
      .order-wrap
        position: relative
        width: 100%
        padding-bottom: 60px
        .order-shop
          display: block
          height: 40px
          line-height: 40px
          padding: 0 10px
          font-size: 14px
          border-1px(rgba(7, 17, 27, 0.1))
        .orderlist
          position: relative
          padding: 10px
          li
            display: flex
            padding: 5px 0
            font-size: 13px
            min-height: 75px
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              margin-bottom: 0
            .thumbnail
              display: inline-block
              float: left
              width: 35%
              img
                width: 95%
                overflow: hidden
            .sku-info
              flex: 1
              padding: 0 5px 5px 0
              .sku-name
                padding-top: 8px
                line-height: 1.3
                margin-bottom: 5px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
              .sku-item
                padding-bottom: 10px
            .sku-ext
              width: 15%
              float: right
              padding: 8px 0 0
              text-align: right
              box-sizing: border-box
              p
                padding-bottom: 8px
              .sku-price
                color: #e4393c
                font-weight: 700
        >.shop-info, .buy-checkout
          position: relative        
          padding: 10px
          font-size: 14px
          li
            position: relative
            display: flex
            padding: 10px 30px 10px 0
            strong
              flex: 1
              font-weight: 400
            .icon-check_circle
              font-size: 20px
              color: #d3d3d3
              margin-right: 2px
              text-align: center
              &.on
                color: #fb4741
            .remark
              margin-bottom: 3px
              padding-right: 15px
            span
              flex: 1
              text-align: right
              vertical-align: middle
              &.nowrap-line
                position: relative
                display: -webkit-box
                text-overflow: ellipsis
                overflow: hidden
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
            &.change:after
              content: ""
              display: block
              width: 8px
              height: 8px
              border-top: 1px solid #666
              border-left: 1px solid #666
              -webkit-transform-origin: 50%
              transform-origin: 50%
              -webkit-transform: rotate(135deg)
              transform: rotate(135deg)
              position: absolute
              right: 5px
              top: 50%
              margin-top: -5px
          .item-border
            background: #fff url(../../common/images/line.png) -7px bottom repeat-x
            background-size: 60px 4px
        >.shop-info > li
          padding-right: 0
          &.discount > span
            padding-right: 15px
            color: #e4393c
            &.disabled
              color: #999
        >.payArea
          position: relative
          text-align: left
          background: #fff
          padding: 0 10px
          .price
            padding: 6px 0
            font-size: 14px
            &.last
              padding-top: 2px
            .label
              display: inline-block
              width: 85px
            .totalPrice
              color: #e4393c
            strong
              font-weight: 700
              font-size: 20px
          .countdownTips
            font-size: 12px
            text-align: left
            color: #666
            .red-text
              color: #e4393c
              font-weight: 700
    >.address-list-wrap
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
    .coupon-list-wrap
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
