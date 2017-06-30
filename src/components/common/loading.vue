<template>
  <div class="loadingToast" v-show="show">
    <div class="toast">
      <i class="loading icon_toast"></i>
      <p class="toast_content">{{text}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['show', 'text']
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toast
    position: fixed
    z-index: 100
    width: 120px
    min-height: 120px
    top: 50%
    left: 50%
    margin-left: -60px
    margin-top: -60px
    background: hsla(0, 0%, 7%, .7)
    text-align: center
    border-radius: 5px
    color: #fff
    .loading
      display: inline-block
      width: 20px
      height: 20px
      vertical-align: middle
      -webkit-animation: e 1s steps(12) infinite
      animation: e 1s steps(12) infinite
      background: transparent url(../../common/images/loading.svg) no-repeat
      background-size: 100%
      @keyframes e{
        0% {
          -webkit-transform: rotate(0deg)
          transform: rotate(0deg)
        }
        100% {
          -webkit-transform: rotate(1turn)
          transform: rotate(1turn)
        }
      }
      &.icon_toast
        margin: 30px 0 0
        width: 38px
        height: 38px
        vertical-align: baseline
    .toast_content
      margin: 0 0 15px
      line-height: 1.6
      font-size: 14px
</style>
