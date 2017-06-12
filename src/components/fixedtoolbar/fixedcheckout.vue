<template>
  <div class="fixed-foot">
    <div class="content">
      <div class="content-left">
        <div class="checkbox" @click.stop.prevent="toggleCheckout">
          <span class="icon icon-check_circle" :class="{'on': checked}"></span>全选
        </div>
      </div>
      <div class="content-center">
        <span class="totalPrice">总计：<span class="price">{{totalPrice | currency}}</span></span>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}<span>(0件)</span></div>
      </div>
    </div>
  </div>
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
    },
    data() {
      return {
        checked: false,
        savePrice: 0,
        totalPrice: 0
      };
    },
    computed: {
      payDesc() {
        return `去结算`;
      },
      payClass() {
        return 'activated';
      }
    },
    methods: {
      toggleCheckout() {
        this.checked = !this.checked;
      },
      pay() {
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
    z-index: 99
    background: #fafafa
    .content
      display: flex
      font-size: 0
      text-align: center
      color: #666
      .content-left
        flex: 80px 0 0
        .checkbox
          height: 100%
          font-size: 16px
          line-height: 50px  
          .icon
            display: inline-block
            vertical-align: top
            font-size: 22px
            line-height: 50px
            color: #d3d3d3
            &.on
              color: #FB4741
          .text
            display: block
            line-height: 1
            font-size: 10px
      .content-center
        flex: 1
        text-align: right
        padding: 0 10px
        line-height: 50px
        .totalPrice
          display: block
          font-size: 16px
          .price
            color: #e4393c
        .savePrice
          display: block
          line-height: 1
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 50px
          line-height: 50px
          font-size: 16px
          font-weight: 700
          background: rgb(147, 153, 159)
          span
            font-family: none
            font-size: 12px
            font-weight: 400
          &.disable
            cursor: default
            color: #fff
            background: rgb(147, 153, 159)
          &.activated
            background: #FB4741
            color: #fff
</style>
