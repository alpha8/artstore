<template>
  <div class="wxpay">
    <fixedheader title="确认订单" ref="header"></fixedheader>
    <div class="address-wrap">      
      <div class="address-default address-border" v-if="hasDefaultAddress" @click.stop.prevent="showAddressList">
        <ul>
          <li><strong>{{defaultAddress.name}} {{defaultAddress.phoneNumber | mixPhone}}</strong></li>
          <li><span class="tag tag_red">默认</span>{{getFullAddress}}</li>
        </ul>
      </div>
      <div class="addressNull" v-else>
        <h3 @click.stop.prevent="showAddressList">！请填写收货地址</h3>
      </div>
    </div>
    <div class="pay" ref="pay">
      <div class="order-wrap">
        <split></split>
        <div class="order-shop border-1px">{{appName}}</div>
        <ul class="orderlist">
          <li class="product border-1px" v-for="product in products">
            <div class="thumbnail">
              <img :src="getThumbnail(product.productPic)" alt="" class="photo">
            </div>
            <div class="sku-info">
              <p class="sku-name">{{product.productName}}</p>
              <p class="sku-item" v-show="product.sp1">{{`${product.sp1 || ''} ${product.sp2 || ''}  ${product.sp3 || ''}`}}</p>
              <p class="sku-point"><span class="sku_price">{{product.price | currency}}</span><i class="icon-database" />{{product.price * plusPointRate()}}</span><span class="sku_count">x{{product.quantity}}</span></p>
            </div>
          </li>
        </ul>
        <ul class="shop-info">
          <li class="discount change" @click.stop.prevent="selectCoupon">
            <strong>优惠券：</strong>
            <span v-if="coupons.length">{{usedDiscount}}</span>
            <span v-else class="disabled">无可用</span>
          </li>
          <li class="coin">
            <strong>积分：<i class="coin-tips">{{coinTips}}</i></strong>
            <em @click.stop.prevent="toggleUseCoin">
              <i class="icon icon-check_circle" :class="{'on': useCoin}"></i>使用积分</i>
            </em>
          </li>         
        </ul>
        <split></split>
        <ul class="shop-info">
          <li class="checkout-item change item-border" @click.stop.prevent="openRemarkBox">
            <strong>备注/重要留言：</strong>
            <span class="nowrap-line remark">{{payRemarks}}</span>
          </li>
        </ul>
        <split></split>
        <ul class="buy_chart">
          <li class="buy_item">
            <p class="buy_item_text">商品金额：</p>
            <p class="buy_item_price">{{totalFee | currency}}</p>
          </li>
          <li class="buy_item">
            <p class="buy_item_text">运费：</p>
            <p class="buy_item_price">+ {{freightFee | currency}}</p>
          </li>
          <li class="buy_item">
            <p class="buy_item_text">优惠券抵扣：</p>
            <p class="buy_item_price">- {{couponValue | currency}}</p>
          </li>
          <li class="buy_item">
            <p class="buy_item_text">积分抵扣：</p>
            <p class="buy_item_price">- {{coinValue | currency}}</p>
          </li>
        </ul>
        <div class="pay_area">
          <p class="price">实付金额：  <strong>{{shouldPay - coinValue | currency}}</strong></p>
        </div>
        <div class="payBtnList">
          <div class="btns btn-green" :class="{'btn-gray': paying}" @click.stop.prevent="weixinPay"><span>微信支付</span></div>
          <!-- <div class="btns btn-red"><span>京东支付</span></div>
          <div class="btns btn-lightblue"><span>货到付款</span></div> -->
        </div>
        <div class="countdownTips" v-if="countdownStats && countdownStats.milliseconds > 0">
          请在<span v-if="countdownStats.hours"><span class="red-text">{{countdownStats.hours}}</span>小时</span><span v-if="countdownStats.mins"><span class="red-text">{{countdownStats.mins}}</span>分</span><span v-if="countdownStats.seconds"><span class="red-text">{{countdownStats.seconds}}</span>秒</span>内完成支付，否则订单将自动取消。</div>
      </div>
      <div class="footer">
        <div class="logo"><img :src="logoSrc" /></div>
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
    <quietlogin/>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import addressList from '@/components/my/addressList';
  import usecoupon from '@/components/coupon/usecoupon';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import {countdown} from '@/common/js/date';
  import {mixPhone} from '@/common/js/util';
  import quietlogin from '@/components/common/quietlogin';

  export default {
    data() {
      return {
        showBox: false,
        totalFee: 0,
        paying: false,
        remarks: '',
        countdownStats: {},
        coupons: [],
        discount: 0,
        useCoin: false,
        freightFee: 0,
        logoSrc: api.CONFIG.logo,
        products: [],
        totalCoin: 0,
        addressId: '',
        couponId: '',
        useIntegration: '',
        apiSign: ''
      };
    },
    computed: {
      defaultAddress() {
        let addr = this.$store.getters.getDefaultAddress;
        if (addr && addr.id) {
          this.addressId = addr.id;
        }
        return addr;
      },
      getFullAddress() {
        var item = this.defaultAddress;
        return `${item.province || ''}${item.city || ''}${item.region || ''}${item.detailAddress || ''}`;
      },
      hasDefaultAddress() {
        return this.defaultAddress && this.defaultAddress.detailAddress;
      },
      payRemarks() {
        this.remarks = this.$store.getters.getPayRemark;
        return this.remarks;
      },
      usedDiscount() {
        let selectedCoupon = this.$store.getters.loadUsedDiscount;
        if (selectedCoupon && selectedCoupon.length) {
          let coupon = selectedCoupon[0];
          let name = coupon.coupon && coupon.coupon.name || '';
          this.couponId = coupon.coupon.id;
          return `已选择${selectedCoupon.length}张（${name}）`;
        }
        return `您有${this.coupons.length}张可用优惠券`;
      },
      coinTips() {
        let profile = this.$store.getters.userProfile;
        let rate = profile.memberLevel && profile.memberLevel.pointRate || 100;
        if (this.useCoin) {
          this.useIntegration = Math.floor(this.coinValue * rate);
          return `共${this.totalCoin}个, 本单消费${this.useIntegration}个`;
        }
        return `共${this.totalCoin}个, ${rate}积分抵扣1元`;
      },
      appName() {
        return `${api.CONFIG.APPNAME}`;
      },
      couponValue() {
        let selectedCoupon = this.$store.getters.loadUsedDiscount;
        if (selectedCoupon && selectedCoupon.length) {
          return selectedCoupon[0].coupon && selectedCoupon[0].coupon.amount || 0;
        }
        return 0;
      },
      shouldPay() {
        return this.totalFee - this.couponValue + this.freightFee;
      },
      coinValue() {
        if (!this.useCoin) {
          return 0;
        }
        let profile = this.$store.getters.userProfile;
        let rate = profile.memberLevel && profile.memberLevel.pointRate || 100;
        let amount = Math.floor(this.totalCoin / rate);
        if (amount > this.shouldPay) {
          return this.shouldPay;
        }
        return amount;
      }
    },
    activated() {
      this.show();
      this.fetchData();
    },
    deactivated() {
      this.hide();
      this.paying = false;
      this.product = [];
      this.discount = 0;
      this.coupons = [];
      this.useCoin = true;
      this.addressId = '';
      this.couponId = '';
      this.useIntegration = '';
      this.apiSign = '';
    },
    methods: {
      fetchData() {
        var userId = this.$store.getters.userId;
        if (!userId) {
          var redirect = window.location.href.replace('?from=singlemessage&isappinstalled=0', '').replace('&from=singlemessage&isappinstalled=0', '');
          if (api.CONFIG.profiles != 'dev') {
            redirect = 'http://' + location.host + '/wx/pay';
          }
          this.$router.push({name: 'login', query: {redirect: encodeURI(redirect)}});
          // 未登录
          return;
        }
        this.$store.dispatch('openLoading');
        api.generateConfirmOrder().then(response => {
          if (response.code == 200) {
            let data = response.data;
            this.products = data.cartPromotionItemList || [];
            if (!this.products.length) {
              this.$router.replace({name: 'home'});
              return;
            }
            this.totalFee = data.calcAmount.totalAmount || 0;
            this.freightFee = data.calcAmount.freightAmount || 0;
            this.totalCoin = data.memberIntegration || 0;
            this.coupons = data.couponHistoryDetailList || [];
          }
          this.$store.dispatch('closeLoading');
        }).catch(error => {
          console.log(error);
          this.$store.dispatch('closeLoading');
        });
      },
      getThumbnail(pic) {
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      toggleUseCoin() {
        this.useCoin = !this.useCoin;
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
        this.fetchData();
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
          }
          this.countdownStats = countdown(--cTime);
        }, 1000);
      },
      weixinPay() {
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        let openId = this.$store.getters.getOpenId || this.$store.getters.userInfo.openId;
        if (!openId) {
          this.$store.dispatch('openToast', '正在登录中...');
          window.location.href = `${api.CONFIG.ctx}/weixin/base?url=` + encodeURI(location.href);
          return;
        }
        if (!this.addressId) {
          this.$store.dispatch('openToast', '请选择收货人信息');
          return;
        }
        this.paying = true;
        if (this.apiSign) {
          this.wxpay();
          return;
        }
        api.generateOrder({
          memberReceiveAddressId: this.addressId,
          couponId: this.couponId || '',
          useIntegration: this.useIntegration || '',
          payType: 1,
          openId: openId,
          note: this.remarks || ''
        }).then(response => {
          if (response.code != 200) {
            this.paying = false;
            this.$store.dispatch('openToast', response.message);
          } else {
            this.$store.dispatch('cleanUsedDiscount');
            let order = response.data && response.data.order;
            if (response.data.finish) {
              this.$router.replace({name: 'orderdetail', params: {id: order.orderSn}});
              return;
            }
            this.apiSign = response.data && response.data.apiSign;
            if (!this.apiSign) {
              this.$store.dispatch('openToast', '微信支付配置失败，请联系管理后重试!');
              return;
            }
            this.wxpay(order);
          }
        }).catch(error => {
          this.paying = false;
          console.log(error);
          this.$store.dispatch('openToast', '网络开了小差，请稍候再试!');
        });
      },
      wxpay(order) {
        let that = this;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': that.apiSign.appId,
            'timeStamp': that.apiSign.timeStamp,
            'nonceStr': that.apiSign.nonceStr,
            'package': that.apiSign.package,
            'signType': that.apiSign.signType,
            'paySign': that.apiSign.paySign
          }, function(res) {
            that.paying = false;
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.$store.dispatch('openToast', '支付成功！');
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              that.$store.dispatch('openToast', '取消支付！');
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              that.$store.dispatch('openToast', '支付失败！');
            }
            that.$router.replace({name: 'orderdetail', params: {id: order.orderSn}});
          }
        );
        pay(this.apiSign);
      },
      plusPointRate() {
        let profile = this.$store.getters.userProfile;
        return profile.memberLevel && profile.memberLevel.pointRate || 100;
      }
    },
    components: {
      split, fixedheader, addressList, usecoupon, quietlogin
    },
    filters: {
      mixPhone(phone) {
        return mixPhone(phone);
      }
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
        padding: 12px 10px
        &.address-border
          padding-bottom: 16px
          background: #fff url(../../common/images/line.png) -7px bottom repeat-x
          background-size: 60px 4px
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
          >li
            word-wrap: break-word
            word-break: break-all
            font-size: 14px
            > strong
              font-weight: 700
              font-size: 16px
            >.tag
              display: inline-block
              position: relative
              overflow: hidden
              padding: 0 5px
              vertical-align: middle
              margin: -2px 5px 0 0
              max-width: 8em
              height: 15px
              line-height: 15px
              font-size: 10px
              color: #4b9bfb
              &.tag_red
                color: #e93b3d
              &::after
                content: ""
                position: absolute
                z-index: 1
                pointer-events: none
                background-color: #e93b3d
                border: 1px solid #ddd
                top: 0
                bottom: 0
                left: 0
                right: 0
                background: none
                border-color: #e93b3d
                right: -100%
                bottom: -100%
                -webkit-transform: scale(.5)
                -webkit-transform-origin: 0 0
                border-radius: 4px
    >.pay
      position: absolute
      top: 114px
      left: 0
      bottom: 0
      width: 100%
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      &.notop
        top: 44px
      .order-wrap
        position: relative
        width: 100%
        .order-shop
          display: block
          height: 40px
          line-height: 40px
          padding: 0 10px
          font-size: 14px
          border-1px(rgba(7, 17, 27, 0.1))
          background: #fff
        .orderlist
          position: relative
          padding: 10px
          background: #fff
          li
            display: flex
            padding: 5px 0
            font-size: 13px
            min-height: 75px
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              margin-bottom: 0
            .thumbnail
              vertical-align: top
              display: inline-block
              float: left
              padding: 5px 10px 0 0
              box-sizing: border-box
              img
                width: 100px
                height: 100px
                overflow: hidden
            .sku-info
              flex: 1
              .sku-name
                padding-top: 8px
                line-height: 1.3
                margin-bottom: 5px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                /*! autoprefixer: off */
                -webkit-box-orient:vertical
                /*! autoprefixer: on */
              .sku-item
                position: relative
                background: #f7f7f7
                height: 20px
                line-height: 20px
                color: #666
                display: block
                border-radius: 2px
                font-size: 12px
              .sku-point
                position: relative
                margin-top: 5px
                height: 20px
                line-height: 20px
                padding-right: 60px
                color: #666
                display: block
                font-size: 12px
                .sku_price
                  color: #ff6325
                  font-size: 13px
                  padding-right: 8px
                .icon-database
                  padding-right: 2px
                .sku_count
                  position: absolute
                  top: 0
                  right: 0
                  font-size: 14px
            .sku-ext
              width: 15%
              float: right
              padding: 8px 0 0
              text-align: right
              box-sizing: border-box
              p
                padding-bottom: 8px
              .sku-price
                color: #ff6325
                font-weight: 700
        >.shop-info, .buy-checkout
          position: relative        
          padding: 10px
          font-size: 14px
          background: #fff
          >li
            position: relative
            display: flex
            height: 35px
            line-height: 35px
            align-items: center              
            strong
              flex: 1
              font-weight: 400
            .icon-check_circle
              font-size: 20px
              color: #d3d3d3
              margin-right: 2px
              text-align: center              
              height: 35px
              line-height: 35px
              display: inline-block
              vertical-align: middle
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
                text-overflow: ellipsis
                overflow: hidden
                -webkit-line-clamp: 1
                /*! autoprefixer: off */
                -webkit-box-orient:vertical
                /*! autoprefixer: on */
                white-space: nowrap
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
        >.shop-info > li
          padding-right: 0
          &.discount > span
            font-size: 12px
            padding-right: 15px
            color: #e4393c
            text-overflow: ellipsis
            overflow: hidden
            -webkit-line-clamp: 1
            /*! autoprefixer: off */
            -webkit-box-orient:vertical
            /*! autoprefixer: on */
            white-space: nowrap
            &.disabled
              color: #999
          .coin-tips
            font-size: 12px
            color: #999
          &.coin > span
            position: relative
            padding-right: 25px            
            .coinNum
              width: 100%
              height: 100%
              text-align: left
              font-size: 12px
              border: 1px dashed #ccc
        >.buy_chart
          padding: 0 10px
          position: relative
          background-color: #fff
          padding: 10px
          font-size: 14px
          .buy_item
            display: flex
            padding: 2px 0
            .buy_item_text
              flex: 1
              color: #333
            .buy_item_price
              color: #e93b3d
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
        >.pay_area
          overflow: hidden
          text-align: center
          padding: 0 10px
          background: #fff
          position: relative
          .price
            font-size: 16px
            font-weight: 700
            margin-bottom: 20px
            text-align: right
            strong
              color: #e93b3d
              font-weight: 400
        .payBtnList
          display: block
          padding: 10px
          background: #fff
          .btns
            margin: 0
    .footer
      margin: 15px 0 40px
      .logo
        display: block
        width: 100px
        margin: 0 auto
        img
          width: 100px
          height: auto
          border: 0
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
