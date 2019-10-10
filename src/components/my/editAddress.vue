<template>
  <div>
    <fixedheader title="收货地址" ref="header"></fixedheader>
    <div class="addAddress" ref="addAddress">
      <div class="add-address-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">收货人：</span>
              <input type="text" v-model="address.name" placeholder="姓名" autofocus required>
            </p>
          </li>
          <li class="border-1px">
            <p>
              <span class="title">联系方式：</span>
              <input type="text" v-model="address.phoneNumber" placeholder="手机号码" maxlength="11" required>
            </p>
          </li>
          <li class="border-1px">
            <p class="more">
              <span class="title">所在地区：</span>
              <div class="text-control" v-if="fullAddress" @click.stop.prevent="openCityChoose">{{fullAddress}}</div>
              <div class="text-control tips" v-else @click.stop.prevent="openCityChoose">选择所在地区</div>
            </p>
          </li>
          <li>
            <p class="pr">
              <span class="title special">详细地址：</span>
              <textarea v-model="address.detailAddress" placeholder="详细地址" rows="3" required></textarea>
              <i class="icon-close" v-show="clearAddress" @click.stop.prevent="doClearAddr"></i>
            </p>
          </li>
          <input type="hidden" v-model="address.defaultStatus">
          <input type="hidden" v-model="address.id">
        </ul>
        <div class="btns btn-green" @click="updateAddress"><span>保存</span></div>
      </div>
    </div>
    <citychoose ref="city" @selectCity="cityChosed"></citychoose>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import citychoose from '@/components/my/citychoose';
  import api from '@/api/api';
  const RESPONSE_OK = 200;

  const defaultAddress = {
    name: '',
    phoneNumber: '',
    detailAddress: '',
    defaultStatus: 0
  };
  export default {
    data() {
      return {
        address: Object.assign({}, defaultAddress),
        fullAddress: ''
      };
    },
    activated() {
      this.show();
      let id = this.$route.params.id;
      if (!id) {
        return;
      }
      this.address = this.$store.getters.getAddressList.find(addr => addr.id == id);
      if (this.address) {
        this.fullAddress = this.getFullAddress(this.address);
      }
    },
    deactivated() {
      this.hide();
    },
    computed: {
      clearAddress() {
        if (this.address.detailAddress && this.address.detailAddress.length) {
          return true;
        }
        return false;
      }
    },
    methods: {
      getFullAddress(item) {
        return `${item.province || ''}${item.city || ''}${item.region || ''}`;
      },
      updateAddress() {
        if (!this.address.phoneNumber || !this.address.detailAddress) {
          return;
        }
        api.updateAddress(this.address.id, this.address).then(response => {
          if (response.code === RESPONSE_OK) {
            this.$store.dispatch('updateAddress', this.address);
            this.$router.back();
          }
        });
      },
      openCityChoose() {
        this.$refs.city.choseAdd();
      },
      cityChosed(city) {
        if (city && city.city) {
          this.address.province = city.province;
          this.address.city = city.city;
          this.address.region = city.district || '';
        }
      },
      doClearAddr() {
        this.address.detailAddress = '';
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader, citychoose
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .addAddress
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
  .add-address-wrap
    position: relative
    background: #fff
    padding: 0 10px 40px
    ul
      position: relative
      li
        position: relative
        padding: 8px 0 0 72px
        box-sizing: border-box
        &.border-1px
          padding: 8px 0 8px 72px
          border-1px(rgba(7, 17, 27, 0.1))
        .text-control
          height: 20px
          line-height: normal
          border: 0 none
          font-size: 14px
          width: 100%
          vertical-align: top
          &.tips
            color: #BBBBBB
        p
          display: block
          box-sizing: border-box
          &.pr
            padding-right: 2px
          .title
            position: absolute
            width: 70px
            top: 11px
            left: 0
            right: 0
            margin: auto 0
            padding-right: 20px
            text-align: right
            font-size: 14px
            line-height: 1
            &.special
              top: 16px
          input, select
            height: 20px
            line-height: normal
            border: 0 none
            font-size: 14px
            width: 100%
            vertical-align: top
          textarea
            width: 100%
            border: 1px dashed #ccc
            resize: none
            font-size: 14px
            line-height: 1.5
            padding-right: 20px
            box-sizing: border-box
          .icon-close
            position: absolute
            top: 13px
            right: 7px
            font-size: 18px
          &.more:after
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
</style>
