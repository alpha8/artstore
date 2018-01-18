<template>
  <div>
    <div class="toast">
      <p class="toast_content">{{text}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['text']
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toast
    position: fixed
    z-index: 10000
    width: 210px
    top: 50%
    left: 50%
    margin-left: -105px
    margin-top: -60px
    background: rgba(18, 18, 18, 0.48)
    text-align: center
    border-radius: 5px
    color: #fff
    overflow: hidden
    .toast_content
      font-size: 14px
      line-height: 1.5
      padding: 20px 10px
      display: -webkit-box
      vertical-align: middle
      word-wrap: break-word
      word-break: break-all
      text-overflow: ellipsis
      overflow: hidden
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
</style>
