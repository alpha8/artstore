<template>
  <ul class="timeflow">
    <li class="flowitem" v-for="(item, index) in items">
      <i class="number-item" :class="{'gray': item.inActive}">{{index+1}}</i>
      <div class="text" v-html="item.text"></div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      items: {
        type: Array,
        default() {
          return [];
        }
      }
    }
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
        width: 22px
        height: 22px
        line-height: 22px
        font-size: 16px
        border-radius: 50%
        text-align: center
        background: rgba(250,180,90,0.93)
        color: #fff
        &.gray
          background: #aeadad
      .text
        padding-top: 29px
        padding-bottom: 3px
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
