<template>
  <ul class="timeflow">
    <li class="flowitem">
      <i class="number-item">1</i>
      <div class="text">发起砍价</div>
    </li>
    <li class="flowitem">
      <i class="number-item">2</i>
      <div class="text">分享到<br/>朋友圈或朋友</div>
    </li>
    <li class="flowitem">
      <i class="number-item gray">3</i>
      <div class="text">朋友进入<br/>即自动砍价一次</div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {

  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .timeflow
    position: relative
    display: flex
    background: #fff
    margin-left: -3px
    box-sizing: border-box
    .flowitem
      position: relative
      flex: 1
      text-align: center
      i
        position: absolute
        display: inline-block
        margin-left: -12px
        width: 23px
        height: 23px
        line-height: 23px
        font-size: 16px
        font-weight: 400
        border-radius: 50%
        text-align: center
        background: rgba(250,180,90,0.93)
        color: #fff
        &.gray
          background: #999
      .text
        padding-top: 29px
        padding-bottom: 1px
        font-size: 14px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        word-wrap: break-word
        word-break: break-all
        color: #666
</style>
