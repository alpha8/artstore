<template>
  <div class="fixed-foot" v-show="toggle">
    <div class="foot-wrapper">
      <router-link :to="item.link" class="foot-item" v-for="(item,index) in items" key="index">
        <span class="icon"><i :class="item.icon"></i></span>
        <span class="text">{{item.text}}</span>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      items: {
        type: Array,
        default: []
      }
    },
    computed: {
      toggle() {
        return this.$store.state.showFooter;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fixed-foot
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 50px
    z-index: 8
    background: #fafafa
    .foot-wrapper
      display: flex
      padding-top: 1px
      .foot-item
        flex: 1
        height: 50px
        font-size: 12px
        text-align: center
        color: #666
        &.active
          color: #00bb9c
        .icon
          display: block
          padding-top: 3px
          line-height: 1
          i
            display: inline-block
            width: 25px
            height: 25px
            font-size: 22px
        .text
          display: block
          line-height: 1
</style>
