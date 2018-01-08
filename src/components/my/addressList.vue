<template>
  <div>
    <fixedheader title="收货地址" ref="header" :showBack="showBack"></fixedheader>
    <div class="address" ref="address">
      <div class="address-wrap">
        <ul class="addressList">
          <li class="address-item border-1px" v-for="item in addressList">
            <span class="icon-check_circle" :class="{'on': item.default}" @click.stop.prevent="toggle(item)"></span>
            <div class="addr" @click.stop.prevent="toggle(item)">
              <div class="addr-item">{{item.city ? item.city + item.address : item.address}}</div>
              <div class="addr-item">
                <strong>{{item.name}}</strong>
                <span class="mobile">{{item.mobile}}</span>
              </div>
            </div>
            <span class="ops"><i class="icon-edit" @click.stop.prevent="editAddress(item)"></i><i class="icon-recycle" @click.stop.prevent="removeAddress(item)"></i></span>
          </li>
        </ul>
        <div class="addAddress">
          <div class="item" @click.stop.prevent="addAddress">新增收货地址<i class="icon-add_circle"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    data() {
      return {
        addressList: [],
        showBack: true
      };
    },
    activated() {
      this.getAddressList();
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.address, {
              click: true,
              bounce: false
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      getAddressList() {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.addressList = this.$store.getters.getAddressList;
          this._initScroll();
          return;
        }
        api.getAddressList(uid || -1).then(response => {
          this.addressList = response;
          this.$store.dispatch('setDefaultAddress', this.addressList);
          this._initScroll();
        });
      },
      show() {
        this._initScroll();
        this.showBack = false;
      },
      toggle(item) {
        this.addressList.forEach((addr) => {
          if (item.id !== addr.id && addr.default) {
            addr.default = false;
          }
        });
        item.default = !item.default;
        this.$store.dispatch('setDefaultAddress', this.addressList);
        this.$emit('update');
      },
      addAddress() {
        this.$router.push('/address/add');
      },
      editAddress(item) {
        this.$router.push({name: 'address', params: {id: item.id}});
      },
      removeAddress(item) {
        api.removeAddress({id: item.id}).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '收货地址删除成功！');
            let addressList = this.addressList;
            for (let i = 0; i < addressList.length; i++) {
              let addr = addressList[i];
              if (item.id === addr.id) {
                addressList.splice(i, 1);
              }
            };
            this.$store.dispatch('setDefaultAddress', this.addressList);
          } else {
            this.$store.dispatch('openToast', '网络太忙，删除失败！');
          }
        });
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .address
    position: relative
    overflow: hidden
    >.address-wrap
      position: relative
      padding: 10px 15px 65px
      .addressList
        position: relative
        width: 100%
        strong
          font-weight: 400
        .address-item
          position: relative
          display: flex
          font-size: 14px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon-check_circle
            width: 35px
            color: #d3d3d3
            font-size: 22px
            line-height: 50px
            &.on
              color: #fb4741
          .addr
            flex: 1
            padding-top: 5px
            padding-right: 8px
            line-height: 1.5
            box-sizing: border-box
            .addr-item
              display: -webkit-box
              word-wrap: break-word
              word-break: break-all
              text-overflow: ellipsis
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
              overflow: hidden
          .ops
            width: auto
            line-height: 50px
            text-align: right
            i
              padding-left: 15px
              font-size: 16px
              &:first-child
                padding-left: 0
      .addAddress
        position: relative
        padding: 15px 0
        font-size: 14px
        .item
          position: relative
          i
            position: absolute
            right: 0
            top: 0
            font-size: 22px
            color: #6e6767
</style>
