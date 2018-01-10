<template>
  <div class="filladdress">
    <fixedheader title="填写收货地址" ref="header"></fixedheader>
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
    <div class="pay" ref="addressRef">
      <div class="order-wrap">
        <ul class="shop-info">
          <li class="shipping">
            <strong>配送方式：</strong>
            <span>快递</span>
          </li>
          <li class="checkout-item change item-border" @click.stop.prevent="openRemarkBox">
            <strong>备注/重要留言：</strong>
            <span class="nowrap-line remark">{{payRemarks}}</span>
          </li>
        </ul>
        <div class="payArea">
          <div class="payBtnList">
            <div class="btns btn-green" @click.stop.prevent="saveAddress"><span>保存</span></div>
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

  export default {
    data() {
      return {
        showBox: false,
        remarks: ''
      };
    },
    computed: {
      defaultAddress() {
        return this.$store.getters.getDefaultAddress;
      },
      payRemarks() {
        this.remarks = this.$store.getters.getPayRemark;
        return this.remarks;
      }
    },
    activated() {
      this.show();
      this._initScroll();
    },
    deactivated() {
      this.hide();
    },
    mounted() {
      this._initScroll();
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.addressRef, {
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
      saveAddress() {
        let orderNo = this.$route.params.id;
        if (!orderNo) {
          this.$store.dispatch('openToast', '非法访问！');
          return;
        }
        let addr = this.defaultAddress.address;
        if (!addr) {
          this.$store.dispatch('openToast', '请选择收货人信息');
          return;
        }
        api.updateOrderAddress({
          orderNo: orderNo,
          express: {
            expressAddress: addr,
            mobile: this.defaultAddress.mobile,
            receiver: this.defaultAddress.name
          }
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '保存收货地址成功！');
            this.$router.replace({name: 'orderdetail', params: {id: orderNo}});
          } else {
            this.$store.dispatch('openToast', '收货信息不完整，请确认！');
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络太忙，请稍候再试');
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
  .filladdress
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
          strong
            font-weight: 400
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
              display: inline-block
              float: left
              width: 35%
              img
                width: 95%
                overflow: hidden
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
              width: 15%
              float: right
              padding: 10px 0
              text-align: right
              box-sizing: border-box
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
            padding: 10px 0 10px 0
            strong
              flex: 1
              font-weight: 400
            span
              flex: 1
              text-align: right
              &.nowrap-line
                position: relative
                display: -webkit-box
                text-overflow: ellipsis
                overflow: hidden
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
                &.remark
                  margin-bottom: 3px
                  padding-right: 15px
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
