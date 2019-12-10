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
              <img :src="getThumbnail(product.productIcon)" alt="" class="photo">
            </div>
            <div class="sku-info">
              <p class="sku-name">{{product.productName}}</p>
              <p class="sku-item" v-show="product.sp1">{{`${product.sp1 || ''} ${product.sp2 || ''}  ${product.sp3 || ''}`}}</p>
              <p class="sku-point"><span class="sku_price">{{product.productPrice | currency}}</span><del>{{product.productOriginalPrice | currency}}</del><span class="sku_count">x{{product.quantity || 1}}</span></p>
            </div>
          </li>
        </ul>
        <div class="payBtnList">
          <div class="btns btn-orange" :class="{'btn-gray': paying}" @click.stop.prevent="weixinPay"><span>兑换</span></div>
        </div>
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
  import api from '@/api/api';
  import {pay} from '@/common/js/pay';
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
        logoSrc: api.CONFIG.logo,
        products: this.$store.getters.getExchangedGoods || [],
        addressId: ''
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
      appName() {
        return `${api.CONFIG.APPNAME}`;
      }
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
      this.paying = false;
      this.product = [];
      this.addressId = '';
    },
    methods: {
      getThumbnail(pic) {
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
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
      weixinPay() {
        if (this.paying) {
          this.$store.dispatch('openToast', '正在兑换中...');
          return;
        }
        if (!this.addressId) {
          this.$store.dispatch('openToast', '请选择收货人信息');
          return;
        }
        this.paying = true;
        let pid = '';
        this.products.map(o => {
          pid = o.productId;
        });
        let cid = this.$route.params.id;
        api.exchangeGoods({
          cardId: cid,
          productId: pid,
          addressId: this.addressId || ''
        }).then(response => {
          this.paying = false;
          if (response.code == 200) {
            this.$router.replace({name: 'orderdetail', params: {id: response.data}});
          } else {
            this.$message.warning(response.message);
          }
        });
      }
    },
    components: {
      split, fixedheader, addressList, quietlogin
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
