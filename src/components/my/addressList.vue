<template>
  <div>
    <fixedheader title="收货地址" ref="header" :showBack="showBack"></fixedheader>
    <div class="address" ref="address">
      <div class="address-wrap">
        <ul class="addressList">
          <li class="address-item border-1px" v-for="item in addressList" :key="item.id">
            <span class="icon-check_circle" :class="{'on': item.defaultStatus == 1}" @click="toggle(item)"></span>
            <div class="addr" @click="toggle(item)">
              <div class="addr-item">{{getFullAddress(item)}}</div>
              <div class="addr-item">
                <strong>{{item.name}}</strong>
                <span class="mobile">{{item.phoneNumber | mixPhone}}</span>
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
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import {mixPhone} from '@/common/js/util';
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
      getAddressList() {
        let uid = this.$store.getters.userId;
        if (!uid) {
          this.addressList = this.$store.getters.getAddressList;
          return;
        }
        api.getAddressList(uid || -1).then(response => {
          if (response.code == 200) {
            this.addressList = response.data;
            this.$store.dispatch('setDefaultAddress', this.addressList);
          }
        });
      },
      show() {
        this.showBack = false;
      },
      getFullAddress(item) {
        return `${item.province || ''}${item.city || ''}${item.region || ''}${item.detailAddress || ''}`;
      },
      toggle(item) {
        this.addressList.forEach((addr) => {
          if (item.id !== addr.id && addr.defaultStatus == 1) {
            addr.defaultStatus = 0;
          }
        });
        item.defaultStatus = item.defaultStatus == 1 ? 0 : 1;
        api.updateAddress(item.id, item).then(response => {
          if (response.code == 200) {
            this.$store.dispatch('setDefaultAddress', this.addressList);
            this.$emit('update');
          }
        });
      },
      addAddress() {
        this.$router.push('/address/add');
      },
      editAddress(item) {
        this.$router.push({name: 'address', params: {id: item.id}});
      },
      removeAddress(item) {
         this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          api.removeAddress(item.id).then(response => {
            if (response.code == 200) {
              this.$store.dispatch('removeAddress', item.id);
              this.getAddressList();
            }
          });
        });
      }
    },
    filters: {
      mixPhone(phone) {
        return mixPhone(phone);
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
    top: 44px
    overflow: hidden
    >.address-wrap
      position: relative
      padding: 10px 15px 80px
      height: 100vh
      -webkit-overflow-scrolling: touch
      overflow-x: hidden
      overflow-y: auto
      box-sizing: border-box
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
