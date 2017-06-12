<template>
  <div class="title">
    <div class="line"></div>
    <div class="text">{{title}}</div>
    <div class="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .title
    display: flex
    width: 80%
    margin: 22px auto 20px auto
    .line
      flex: 1
      position: relative
      top: -6px
      border-bottom: 1px solid #fafafa
    .text
      padding: 0 12px
      font-size: 14px
      font-weight: 700
</style>
