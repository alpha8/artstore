<template>
  <div>
    <fixedheader title="收货地址" ref="header"></fixedheader>
    <div class="addAddress" ref="addAddress">
      <div class="add-address-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">收货人:</span>
              <input type="text" v-model="user.name" placeholder="姓名" autofocus required>
            </p>
          </li>
          <li class="border-1px">
            <p>
              <span class="title">联系方式:</span>
              <input type="text" v-model="user.mobile" placeholder="手机号码" maxlength="11" required>
            </p>
          </li>
          <li class="border-1px">
            <p class="more">
              <span class="title">所在地区:</span>
              <div class="text-control" v-if="city" @click.stop.prevent="openCityChoose">{{city}}</div>
              <div class="text-control tips" v-else @click.stop.prevent="openCityChoose">选择所在地区</div>
            </p>
          </li>
          <li>
            <p class="pr">
              <span class="title special">详细地址:</span>
              <textarea v-model="user.address" placeholder="详细地址需填写楼栋楼层或房间号" rows="3" required></textarea>
              <i class="icon-close" v-show="clearAddress" @click.stop.prevent="doClearAddr"></i>
            </p>
          </li>
          <input type="hidden" v-model="user.default" value="false">
        </ul>
        <div class="btns btn-green" @click.stop.prevent="addAddress"><span>确认</span></div>
      </div>
    </div>
    <citychoose ref="city" @selectCity="cityChosed"></citychoose>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import citychoose from '@/components/my/citychoose';
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
        },
        city: ''
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
        this.user.city = this.city;
        if (!this.user.userId) {
          this.$store.dispatch('addAddress', this.user);
          this._reset();
          this.$router.back();
          return;
        }
        api.addAddress(this.user).then(response => {
          if (response.result === RESPONSE_OK) {
            this.$store.dispatch('addAddress', this.user);
            this._reset();
            this.$router.back();
          }
        });
      },
      openCityChoose() {
        this.$refs.city.choseAdd();
      },
      cityChosed(city) {
        if (city && city.city) {
          this.city = city.province + city.city + (city.district || '');
        }
      },
      _reset() {
        this.user = {
          name: '',
          mobile: '',
          address: '',
          default: false
        };
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
      fixedheader, citychoose
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .add-address-wrap
    position: relative
    background: #fff
    padding: 0 10px 40px
    ul
      position: relative
      li
        position: relative
        padding: 12px 0 0 75px
        box-sizing: border-box
        &.border-1px
          padding: 12px 0 12px 75px
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
            display: block
            width: 65px
            top: 15px
            left: 0
            right: 0
            margin: auto 0
            padding-right: 20px
            text-align: right
            font-size: 14px
            line-height: 1
            &.special
              top: 20px
          input
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
            top: 18px
            right: 4px
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
