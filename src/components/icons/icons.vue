<template>
  <span :class="iconType"></span>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      size: {
        type: Number
      },
      type: {
        type: Number
      }
    },
    computed: {
      iconType() {
        return 'icon-' + this.size + ' ' + this.classMap[this.type];
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";
  
  .icon-1
    display: inline-block
    vertical-align: top
    width: 12px
    height: 12px
    margin-right: 4px
    background-size: 12px
    background-repeat: no-repeat
    &.decrease
      bg-image('decrease_1')
    &.discount
      bg-image('discount_1')
    &.guarantee
      bg-image('guarantee_1')
    &.invoice
      bg-image('invoice_1')
    &.special
      bg-image('special_1')
  .icon-2
    display: inline-block
    width: 16px
    height: 16px
    vertical-align: top
    margin-right: 6px
    background-size: 16px 16px
    background-repeat: no-repeat
    &.decrease
      bg-image('decrease_2')
    &.discount
      bg-image('discount_2')
    &.guarantee
      bg-image('guarantee_2')
    &.invoice
      bg-image('invoice_2')
    &.special
      bg-image('special_2')
  .icon-3
    display: inline-block
    vertical-align: top
    width: 12px
    height: 12px
    margin-right: 2px
    background-size: 12px 12px
    background-repeat: no-repeat
    &.decrease
      bg-image('decrease_3')
    &.discount
      bg-image('discount_3')
    &.guarantee
      bg-image('guarantee_3')
    &.invoice
      bg-image('invoice_3')
    &.special
      bg-image('special_3')
  .icon-4
    display: inline-block
    vertical-align: top
    width: 16px
    height: 16px
    margin-right: 6px
    background-size: 16px 16px
    background-repeat: no-repeat
    &.decrease
      bg-image('decrease_4')
    &.discount
      bg-image('discount_4')
    &.guarantee
      bg-image('guarantee_4')
    &.invoice
      bg-image('invoice_4')
    &.special
      bg-image('special_4')
</style>
