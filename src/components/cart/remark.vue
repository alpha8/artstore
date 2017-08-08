<template>
  <div>
    <fixedheader title="收货备注" ref="header"></fixedheader>
    <div class="update-remark">
      <div class="add-address-wrap">
        <ul>
          <li class="border-1px">
            <p>
              <span class="title">收货备注</span>
              <textarea v-model="remarks" placeholder="收货备注" rows="2" required></textarea>
              <i class="icon-close" v-show="remarks.length" @click.stop.prevent="doClear"></i>
            </p>
          </li>
        </ul>
        <div class="btns">
          <span class="btn-blue" @click.stop.prevent="saveRemarks">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';

  export default {
    data() {
      return {
        remarks: ''
      };
    },
    methods: {
      saveRemarks() {
        this.$store.commit('PAY_REMARK', this.remarks);
        this.$store.dispatch('openToast', '保存收货备注成功！');
        this.$router.replace('/pay');
      },
      doClear() {
        this.remarks = '';
      }
    },
    components: {
      fixedheader
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .update-remark
    position: absolute
    top: 44px
    width: 100%
    height: 100%
    background: #fff
    overflow: hidden
    z-index: 10
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
              border: none
              resize: none
              font-size: 14px
              line-height: 1.5
            .icon-close
              position: absolute
              top: 18px
              right: 10px
              font-size: 18px
</style>
