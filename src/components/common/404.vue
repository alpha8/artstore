<template>
  <div>
    <fixedheader title="商品已下架" right-icon="icon-more"></fixedheader>
    <div class="content_wrap">
      <div class="icon">
        <img src="../../common/images/404.png" alt="商品已下架" />
        <h1>Oops, 商品下架了！</h1>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  export default {
    activated() {
      this.$store.commit('HIDE_FOOTER');
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
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
    display: flex
    padding-top: 40px
    box-sizing: border-box
    .icon
      margin: 0 auto
      width: 200px
      height: auto
      overflow: hidden
      img
        width: 100%
        height: auto
    h1
      position: relative
      padding-top: 15px
      flex: 1
      text-align: center
      font-size: 14px
      color: #999
</style>
