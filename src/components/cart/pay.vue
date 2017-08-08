<template>
  <div class="wxpay">
    <fixedheader title="确认订单" ref="header"></fixedheader>
    <div class="address-wrap">
      <div class="addressNull" v-show="!defaultAddress || !defaultAddress.address">
        <h3 @click.stop.prevent="showAddressList">！请填写收货地址</h3>
      </div>
      <div class="address-default address-border" v-show="defaultAddress && defaultAddress.address" @click.stop.prevent="showAddressList">
        <h3>收货地址</h3>
        <ul>
          <li>{{defaultAddress.address}}</li>
          <li><strong>{{defaultAddress.name}}</strong><span class="mobile">{{defaultAddress.mobile}}</span></li>
        </ul>
      </div>
    </div>
    <div class="pay" ref="pay">
      <div class="order-wrap">
        <split></split>
        <div class="order-shop border-1px">一虎一席艺术平台</div>
        <ul class="orderlist">
          <li class="product border-1px" v-for="product in products">
            <div class="thumbnail">
              <img :src="product.icon" alt="" class="photo">
            </div>
            <div class="sku-info">
              <p class="sku-name">{{product.name}}</p>
              <p class="sku-item">规格：标准</p>
            </div>
            <div class="sku-ext">
              <p class="sku-price">{{product.price | currency}}</p>
              <p class="sku-count">x{{product.count}}</p>
            </div>
          </li>
        </ul>
        <ul class="shop-info">
          <li class="shipping">
            <strong>配送方式：</strong>
            <span>快递</span>
          </li>
         <!--  <li class="checkout-item change">
            <strong>发票信息</strong>
            <span>明细</span>
          </li> -->
          <li class="checkout-item change" @click.stop.prevent="openRemarkBox">
            <strong>备注</strong>
            <span class="nowrap-line">{{payRemarks}}</span>
          </li>
        </ul>
        <split></split>
        <div class="payArea">
          <p class="price">
            总价：
            <span class="totalPrice">{{totalPrice | currency}}</span>
          </p>
          <div class="payBtnList">
            <div class="btns btn-green" @click.stop.prevent="weixinPay"><span>微信支付</span></div>
            <!-- <div class="btns btn-red"><span>京东支付</span></div>
            <div class="btns btn-lightblue"><span>货到付款</span></div> -->
          </div>
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
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';

  export default {
    data() {
      return {
        showBox: false,
        totalFee: 0,
        paying: false,
        remarks: ''
      };
    },
    computed: {
      products() {
        return this.$store.getters.getPayGoods;
      },
      defaultAddress() {
        return this.$store.getters.getDefaultAddress;
      },
      totalPrice() {
        let total = 0;
        this.products.forEach((item) => {
          total += item.count * item.price;
        });
        this.totalFee = total;
        return total;
      },
      payRemarks() {
        this.remarks = this.$store.getters.getPayRemark;
        return this.remarks;
      }
    },
    activated() {
      if (!this.$store.getters.getPayGoods.length) {
        this.$router.replace('/cart');
        return;
      }
      this.show();
      this._initScroll();
    },
    deactivated() {
      this.hide();
      this.paying = false;
    },
    mounted() {
      this._initScroll();
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.pay, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      openRemarkBox() {
        this.$router.push('/pay/remark');
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
      back() {
        this.$router.back();
      },
      weixinPay() {
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.openid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        if (!this.defaultAddress.address) {
          this.$store.dispatch('openToast', '请选择收货人信息');
          return;
        }
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        let params = {
          openid: userInfo.openid,
          userId: userInfo.userId,
          totalPrice: this.totalFee,
          express: {
            expressAddress: this.defaultAddress.address,
            mobile: this.defaultAddress.mobile,
            receiver: this.defaultAddress.name
          },
          remarks: this.remarks
        };
        let items = [];
        this.products.forEach(product => {
          items.push({'id': product.id, 'count': product.count});
        });
        params.products = items;
        this.paying = true;
        api.createOrder(params).then(response => {
          if (response.result !== 0) {
            this.$store.dispatch('openToast', '生成订单失败！');
            this.paying = false;
            return;
          }
          let order = response.order;
          let payParams = {
            totalFee: order.totalFee,
            openid: userInfo.openid,
            orderNo: order.orderNo,
            body: order.body
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
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  that.$store.dispatch('openToast', '取消支付！');
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
        }).catch(response => {
          this.paying = false;
        });
      }
    },
    components: {
      split, fixedheader, addressList
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
      .addressNull
        position: relative
        background: #fff
        padding: 0 10px
        h3
          position: relative
          font-size: 16px
          padding: 24px 30px 24px 0
          font-weight: 400
          &:after
            content: ""
            display: block
            width: 10px
            height: 10px
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
        ul
          position: relative
          padding-right: 30px
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
          li
            display: -webkit-box
            word-wrap: break-word
            word-break: break-all
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
      overflow: hidden
      .order-wrap
        position: relative
        padding-bottom: 60px
        box-sizing: border-box
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
            margin-bottom: 10px
            font-size: 12px
            min-height: 75px
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              margin-bottom: 0
            .thumbnail
              flex: 15vw 0 0
            .sku-info
              flex: 1
              padding: 10px
              .sku-name
                color: #333
                height: 40px
                line-height: 20px
                margin-bottom: 5px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
              .sku-item
                padding-bottom: 10px
            .sku-ext
              flex: 0 0 15vw
              padding: 10px
              text-align: right
              p
                padding-bottom: 10px
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
            span
              flex: 1
              text-align: right
              &.nowrap-line
                display: -webkit-box
                word-wrap: break-word
                word-break: break-all
                text-overflow: ellipsis
                overflow: hidden
                -webkit-line-clamp: 2
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
        >.payArea
          position: relative
          text-align: center
          background: #fff
          padding: 0 10px
          .price
            margin: 20px 0
            font-size: 16px
            .totalPrice
              color: #e4393c
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
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      bottom: 0
      z-index: 40
      transition: all 0.5s
      background: rgba(7, 17, 27, 0.6)
      backdrop-filter: blur(10px)
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
