<template>
  <div>
    <fixedheader title="客户服务" ref="header"></fixedheader>
    <div class="content_wrap">
      <div class="icon">
        <img :src="serviceImg" alt="" />
      </div>
      <div class="service_list">
        <p class="service_times">人工服务时间：9:00-18:00 (周末不发货)</p>
        <p class="tel">客服热线：{{phoneNo}}</p>
      </div>
      <div class="btns"><a :href="getPhone" class="btn-orange">立即咨询</a></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';

  export default {
    data() {
      return {
        serviceImg: 'http://imgcdn.win-berry.com/1572773971541.png?imageView2/2/w/500/h/500',
        phoneNo: '400-930-8090'
      };
    },
    computed: {
      getPhone() {
        return `tel:${this.phoneNo}`;
      }
    },
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
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
  .content_wrap
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    padding-top: 34px
    box-sizing: border-box
    background: #fff
    .icon
      width: 100%
      display: block
      text-align: center
      img
        width: 300px
        height: auto
        overflow: hidden 
    .service_list
      position: relative
      width: 100%
      text-align: center
      color: #666
      margin-top: 10px
      p
        font-size: 16px
        padding-bottom: 10px
        strong
          font-weight: 700
    >.btns
      width: 58%
      text-align: center
      margin: 40px auto 20px
      box-sizing: border-box
      >a
        flex: 1
        color: #fff
        &.btn-orange
          letter-spacing: 1px
          height: 45px
          line-height: 45px
          border-radius: 45px
</style>
