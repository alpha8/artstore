<template>
  <div class="title_line"><h3>{{text}}</h3></div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['text']
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .title_line
    border-top: 1px solid #ddd
    text-align: center
    height: 6px
    margin: 16px 0 10px
    >h3
      display: inline-block
      font-size: 13px
      height: 13px
      line-height: 13px
      position: relative
      top: -10px
      padding: 0 20px
      background-color: #fff
</style>
