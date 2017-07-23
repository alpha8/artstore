<template>
  <div>
    <fixedheader title="收货地址" ref="header" :showBack="showBack"></fixedheader>
    <div class="address" ref="address">
      <div class="address-wrap">
        <ul class="addressList">
          <li class="address-item border-1px" v-for="item in addressList">
            <span class="icon-check_circle" :class="{'on': item.default}" @click.stop.prevent="toggle(item)"></span>
            <div class="addr" @click.stop.prevent="toggle(item)">
              <div class="addr-item">{{item.address}}</div>
              <div class="addr-item">
                <strong>{{item.name}}</strong>
                <span class="mobile">{{item.mobile}}</span>
              </div>
            </div>
            <span class="ops"><i class="icon-edit" @click.stop.prevent="editAddress(item)"></i></span>
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
    mounted() {
      this.getAddressList();
      this._initScroll();
    },
    activated() {
      // this.getAddressList();
      this._initScroll();
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    },
    computed: {
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.address, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      getAddressList() {
        this.addressList = this.$store.getters.getAddressList;
        if (this.addressList.length === 0 && this.$store.getters.checkLogined) {
          api.getAddressList(this.$store.getters.getUserInfo.userId).then(response => {
            this.addressList = response;
            this.$store.dispatch('setDefaultAddress', this.addressList);
          });
        }
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
        this.$router.push('/addAddress');
      },
      editAddress(item) {
        this.$router.push({name: 'address', params: {id: item.id}});
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
        .address-item
          position: relative
          display: flex
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon-check_circle
            flex: 10vw 0 0
            color: #d3d3d3
            text-align: center
            font-size: 18px
            line-height: 50px
            &.on
              color: #fb4741
          .addr
            flex: 1
            padding-top: 5px
            line-height: 1.5
            .addr-item
              display: -webkit-box
              word-wrap: break-word
              word-break: break-all
              text-overflow: ellipsis
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
              overflow: hidden
          .ops
            flex: 0 0 10vw
            line-height: 50px
            text-align: right
            i
              padding-left: 12px
              font-size: 14px
              &:first-child
                padding-left: 0
      .addAddress
        position: relative
        padding: 15px 0
        font-size: 12px
        .item
          position: relative
          i
            position: absolute
            right: 0
            top: 0
            font-size: 18px
            color: #6e6767
</style>
