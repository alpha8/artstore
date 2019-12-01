<template>
  <div>
    <fixedheader title="404" right-icon="icon-more"></fixedheader>
    <div class="content_wrap">
      <h2>404</h2>
      <div class="text">哦啊，页面掉进黑洞了！</div>
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
    box-sizing: border-box
    text-align: center; 
    h2
      display: block;
      font-size: 60px;
      margin-top: 50px;
      color: #EB6001;
    .text
      display: block;
      color: #EB6001;
      margin-top: 30px;
      display: block;
      padding: 0 20px;
      font-size: 14px;
</style>
