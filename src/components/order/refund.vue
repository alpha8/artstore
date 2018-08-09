<template>
  <div>
    <fixedheader title="申请退款" ref="header" :showBack="showBack"></fixedheader>
    <div class="refund" ref="refund">
      <div class="refund-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">退款原因:</span>
              <textarea v-model="refund.reason" placeholder="申请退款的理由" rows="3" required></textarea>
              <i class="icon-close" v-show="refund.reason" @click.stop.prevent="doClear"></i>
            </p>
          </li>
        </ul>
        <div class="btns btn-green" @click.stop.prevent="doRefund"><span>提交申请</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    props: {
      order: {
        type: Object
      }
    },
    data() {
      return {
        showBack: true,
        refund: {
          reason: ''
        }
      };
    },
    activated() {
      this._initScroll();
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.refund, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      doRefund() {
        if (!this.refund.reason) {
          return;
        }
        api.refund({
          orderNo: this.order.orderNo,
          refund: {
            userStage: {
              desc: this.refund.reason
            }
          }
        }).then(response => {
          if (response.result === 0) {
            this.order.status = 5;
            this.$store.dispatch('openToast', '退款申请成功，等待审批！');
            this.$emit('update');
          } else {
            this.$store.dispatch('openToast', '网络太忙，请稍候再试！');
          }
        });
      },
      show() {
        this._initScroll();
        this.showBack = false;
      },
      doClear() {
        this.refund.reason = '';
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .refund
    position: relative
    top: 44px
    overflow: hidden
    >.refund-wrap
      position: relative
      background: #fff
      padding: 0 10px 40px
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
              line-height: 1.5
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
              right: 14px
              font-size: 18px
</style>
