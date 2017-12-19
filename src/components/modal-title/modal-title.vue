<template>
  <div class="title" :class="{'no-more': !moreText}" @click.stop.prevent="fetchMore">
    <div class="line left"></div>
    <div class="text">{{title}}</div>
    <div class="line right"></div>
    <div class="more">{{moreText}}</div>
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
      catName: {
        type: String
      },
      catKey: {
        type: String
      }
    },
    methods: {
      fetchMore() {
        this.$router.push({path: '/search', query: {parentCat: this.catKey, key: this.catName}});
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .title
    position: relative
    display: flex
    width: 80%
    margin: 14px auto 12px auto
    &:after
      position: absolute
      display: block
      width: 8px
      height: 8px
      content: ""
      border-top: 1px solid #666
      border-left: 1px solid #666
      -webkit-transform-origin: 50%
      transform-origin: 50%
      -webkit-transform: rotate(135deg)
      transform: rotate(135deg)
      top: 50%
      right: -20px
      margin-top: -4px
    &.no-more:after
      display: none
    .line
      flex: 1
      position: relative
      top: -6px
      border-bottom: 1px solid #fafafa
      &.left
        margin-left: 30px
      &.right
        margin-right: 30px
    .text
      padding: 0 12px
      font-size: 14px
      font-weight: 700
      letter-spacing: 1px
    .more
      position: absolute
      display: block
      height: 14px
      top: 50%
      right: -10px
      margin-top: -6px
      font-size: 14px
      color: #666
</style>
