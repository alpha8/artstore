<template>
  <div class="wxpay">
    <fixedheader title="确认订单" ref="header"></fixedheader>
    <div class="pay notop" ref="pay">
      <div class="order-wrap">
        <div class="order-shop border-1px">{{appName}}</div>
        <ul class="orderlist">
          <li class="product border-1px" v-show="product">
            <div class="thumbnail">
              <img :src="getThumbnail(product)" alt="" class="photo">
            </div>
            <div class="sku-info">
              <p class="sku-name">{{product.name}}</p>
              <p class="sku-item"></p>
            </div>
            <div class="sku-ext">
              <p class="sku-price">{{product.price | currency}}</p>
              <p class="sku-count">x{{product.count || 1}}</p>
            </div>
          </li>
        </ul>
        <div class="payArea">
          <p class="price">
            <span class="label">应付金额：</span>
            <span class="totalPrice"><strong>{{product.price | currency}}</strong></span>
          </p>
          <div class="payBtnList">
            <div class="btns btn-green" :class="{'btn-gray': paying}" @click.stop.prevent="weixinPay"><span>微信支付</span></div>
          </div>
          <div class="countdownTips" v-if="countdownStats && countdownStats.milliseconds > 0">
            请在<span v-if="countdownStats.mins"><span class="red-text">{{countdownStats.mins}}</span>分</span><span v-if="countdownStats.seconds"><span class="red-text">{{countdownStats.seconds}}</span>秒</span>内完成支付，否则订单将自动取消。</div>
        </div>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="tipsLayer"></layer>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
  import {countdown} from '@/common/js/date';
  import layer from '@/components/common/layer';

  export default {
    data() {
      return {
        showBox: false,
        totalFee: 0,
        paying: false,
        countdownStats: {},
        timer: null,
        product: {},
        layer: {
          title: '温馨提示',
          text: '',
          button: {
            text: '知道了!'
          }
        }
      };
    },
    computed: {
      appName() {
        return `${api.CONFIG.APPNAME || '一虎一席茶生活美学商城'}`;
      }
    },
    activated() {
      this.show();
      this.fetchData();
    },
    deactivated() {
      this.hide();
      this.paying = false;
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    methods: {
      fetchData() {
        let preid = this.$route.query.preid;
        if (!preid) {
          this.$router.replace('/home');
        }
        api.getVendingOrder(preid).then(resp => {
          if (resp.result === 0) {
            this.product = resp.data;
          }
          this.countdown();
        }).catch(err => {
          console.error(err);
        });
      },
      getThumbnail(item) {
        if (item.icon) {
          return `${api.CONFIG.psCtx}${item.icon}?w=750&h=500&v=v2`;
        }
        return api.CONFIG.defaultImg;
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      countdown() {
        let createTime = this.product.preTime;
        if (!createTime) {
          return;
        }
        let cTime = (new Date(createTime + 2 * 60000).getTime() - (+new Date())) / 1000;
        this.countdownStats = countdown(cTime);
        this.timer = setInterval(() => {
          if (this.countdownStats.milliseconds <= 0) {
            clearInterval(this.timer);
          }
          this.countdownStats = countdown(--cTime);
        }, 1000);
      },
      back() {
        this.$router.back();
      },
      weixinPay() {
        let preid = this.$route.query.preid;
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.openid) {
          this.$store.dispatch('openToast', '正在登录中...');
          setTimeout(() => {
            let redirect = `http://${location.host}/weixin/vending?preid=${preid}`;
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        if (this.paying) {
          this.$store.dispatch('openToast', '正在支付中...');
          return;
        }
        let params = {
          openid: userInfo.openid,
          userId: userInfo.userId,
          totalFee: this.product.price || 0,
          remarks: this.product.vendingId || '',
          type: 100,
          vendingPreId: this.product.id,
          title: this.product.name || '茶美售卖机',
          express: {
            expressAddress: this.product.vendingId || '',
            mobile: '',
            receiver: userInfo.nickName || ''
          },
          vendor: {
            vendorId: this.product.vendingId || ''
          },
          products: [{
            id: this.product.productId,
            name: this.product.name,
            icon: this.product.icon,
            count: 1,
            price: this.product.price || 0
          }]
        };
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
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  that.$store.dispatch('openToast', '取消支付！');
                } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                  that.$store.dispatch('openToast', '支付失败！');
                }
                that.$router.replace('/home');
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
      split, fixedheader, layer
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
                -webkit-box-orient: vertical
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
</style>
