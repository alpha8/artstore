<template>
  <div class="title" :class="{'no-more': !moreText}">
    <div class="line left"></div>
    <div class="text">{{title}}</div>
    <div class="line right"></div>
    <div class="more" @click.stop.prevent="fetchMore">{{moreText}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String
      },
      moreText: {
        type: String
      },
      pid: {
        type: Number, 
        default() {
          return 0;
        }
      }
    },
    methods: {
      fetchMore() {
        this.$router.push({path: '/search', query: {pid: this.pid || '', key: this.title}});
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .title
    position: relative
    display: flex
    padding: 14px 18px 12px 14px
    box-sizing: border-box
    background-color: #fff
    margin: 0 8px
    box-sizing: border-box
    &:after
      position: absolute
      display: block
      width: 7px
      height: 7px
      content: ""
      border-top: 1px solid #666
      border-left: 1px solid #666
      -webkit-transform-origin: 50%
      transform-origin: 50%
      -webkit-transform: rotate(135deg)
      transform: rotate(135deg)
      top: 50%
      right: 13px
      margin-top: -4px
    &.no-more:after
      display: none
    .line
      flex: 1
      position: relative
      top: -8px
      border-bottom: 1px solid #fafafa
      &.left
        margin-left: 32px
      &.right
        margin-right: 32px
    .text
      padding: 0 8px
      height: 16px
      line-height: 16px
      font-size: 14px
      font-weight: 700
      letter-spacing: 1px
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 1
      -webkit-box-orient: vertical
      &.nopadding
        padding: 0
        padding-left: 5px
        border-left: 3px solid #ccc
    .more
      position: absolute
      display: block
      height: 16px
      line-height: 16px
      top: 50%
      right: 21px
      margin-top: -7px
      font-size: 12px
      color: #666
</style>
