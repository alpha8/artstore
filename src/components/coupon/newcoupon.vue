<template>
  <div>
    <fixedheader title="创建优惠券" right-icon=""></fixedheader>
    <div class="addcoupon" ref="addcoupon">
      <div class="coupon-wrap">
        <ul>
          <li class="border-1px">
            <div>
              <span class="title">优惠券名称：</span>
              <input type="text" v-model="coupon.provideTitle" placeholder="优惠券名称" required>
            </div>
          </li>
          <li class="border-1px">
            <div>
              <span class="title">优惠券类型：</span>
              <select name="type" v-model="coupon.type" required>
                <option value="0">现金券</option>
                <option value="1">折扣券</option>
              </select>
            </div>
          </li>
          <li class="border-1px" v-if="coupon.type === '0'">
            <div>
              <span class="title">面额：</span>
              <input type="text" v-model="coupon.payValue" placeholder="面额" required>
            </div>
          </li>
          <li class="border-1px" v-if="coupon.type === '1'">
            <div>
              <span class="title">折扣额度：</span>
              <input type="number" v-model="coupon.payValue" placeholder="八折录入0.8" required>
            </div>
          </li>
          <li class="border-1px">
            <div>
              <span class="title">发行份额：</span>
              <input type="number" v-model="coupon.provideTotal" placeholder="发行张数" required>
            </div>
          </li>
          <li class="border-1px">
            <div>
              <span class="title">是否公开</span>
              <div class="radio-group">
                <input type="radio" v-model="coupon.public" name="isPublic" value="true">&nbsp;公开&nbsp;&nbsp;
                <input type="radio" v-model="coupon.public" name="isPublic" value="false">&nbsp;私有
              </div>
            </div>
          </li>
        </ul>
        <div class="btns btn-gray" v-show="!isValid"><span>确认提交</span></div>
        <div class="btns btn-green" v-show="isValid" @click.stop.prevent="createCoupon"><span>确认提交</span></div>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="layerWin"></layer>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import api from '@/api/api';
  import layer from '@/components/common/layer';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';

  export default {
    data() {
      return {
        coupon: {
          provideTitle: '',
          type: '1',
          public: true,
          payValue: '',
          provideTotal: ''
        },
        layer: {
          title: '系统提示',
          text: '',
          button: {
            text: '知道了!'
          }
        }
      };
    },
    activated() {
      this._initScroll();
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      isValid() {
        if (!this.coupon.provideTitle.length) {
          return false;
        } else if (!this.coupon.payValue.length) {
          return false;
        } else if (!this.coupon.provideTotal.length) {
          return false;
        }
        return true;
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.addcoupon, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      createCoupon() {
        let user = this.$store.getters.getUserInfo;
        this.coupon.userId = user && user.userId || 0;
        api.createCoupon(this.coupon).then(response => {
          if (response.result === 0) {
            this.layer.text = '恭喜, 优惠券创建成功!';
            this.$refs.layerWin.show();
            this._reset();
          } else {
            this.$store.dispatch('openToast', '网络故障，请稍候再试！');
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络故障，请稍候再试！');
        });
      },
      _reset() {
        this.coupon = {
          provideTitle: '',
          type: '1',
          public: true,
          payValue: '',
          provideTotal: ''
        };
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader, layer
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .addcoupon
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
  .coupon-wrap
    position: relative
    background: #fff
    padding: 0 10px 40px 12px
    ul
      position: relative
      li
        position: relative
        display: block
        width: 100%
        padding: 7px 0
        font-size: 14px
        box-sizing: border-box
        &.border-1px
          border-1px(rgba(7, 17, 27, 0.1))
        div
          display: flex
          box-sizing: border-box
          .title
            display: block
            width: 86px
            height: 30px
            line-height: 30px
            float: left
          input[type="text"], input[type="number"], select, textarea
            flex: 1
            height: 30px
          .radio-group
            flex: 1
            height: 30px
            line-height: 30px
            input
              height: 30px
              line-height: 30px
          select
            border: 1px solid #ccc
          input
            border: 0 none
            vertical-align: top
          textarea
            border: 1px dashed #ccc
            resize: none
            font-size: 14px
            box-sizing: border-box
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
    .coupon-tips
      font-size: 12px
      line-height: 1.83em
      strong
        font-weight: 700
</style>

