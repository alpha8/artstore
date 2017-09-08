<template>
  <div>
    <fixedheader title="收货地址" ref="header"></fixedheader>
    <div class="addAddress" ref="addAddress">
      <div class="add-address-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">收货人</span>
              <input type="text" v-model="user.name" placeholder="姓名" autofocus required>
            </p>
          </li>
          <li class="border-1px">
            <p>
              <span class="title">联系方式</span>
              <input type="text" v-model="user.mobile" placeholder="手机号码" maxlength="11" required>
            </p>
          </li>
          <li class="border-1px">
            <p>
              <span class="title">详细地址</span>
              <textarea v-model="user.address" placeholder="详细地址" rows="2" required></textarea>
              <i class="icon-close" v-show="clearAddress" @click.stop.prevent="doClearAddr"></i>
            </p>
          </li>
          <input type="hidden" v-model="user.default" value="false">
        </ul>
        <div class="btns btn-blue" @click.stop.prevent="addAddress"><span>确认</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  const RESPONSE_OK = 0;

  export default {
    data() {
      return {
        user: {
          name: '',
          mobile: '',
          address: '',
          default: false
        }
      };
    },
    computed: {
      clearAddress() {
        if (this.user.address.length) {
          return true;
        }
        return false;
      }
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
      addAddress() {
        if (!this.user.mobile || !this.user.address) {
          return;
        }
        this.user.userId = this.$store.getters.getUserInfo.userId;
        api.addAddress(this.user).then(response => {
          if (response.code === RESPONSE_OK) {
            this.$store.dispatch('addAddress', this.user);
            this.user = {
              name: '',
              mobile: '',
              address: '',
              default: false
            };
            this.$router.back();
          }
        });
      },
      doClearAddr() {
        this.user.address = '';
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .add-address-wrap
    position: relative
    background: #fff
    padding-bottom: 40px
    ul
      position: relative
      li
        padding: 12px 10px 12px 75px
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        p
          display: block
          .title
            position: absolute
            width: 65px
            top: 15px
            left: 0
            right: 0
            margin: auto 0
            padding-right: 20px
            text-align: right
            font-size: 14px
            line-height: 1
          input
            height: 20px
            line-height: normal
            border: 0 none
            font-size: 14px
            width: 100%
            vertical-align: top
          textarea
            width: 100%
            border:none
            resize: none
            font-size: 14px
            line-height: 1.5
          .icon-close
            position: absolute
            top: 18px
            right: 10px
            font-size: 18px
</style>
