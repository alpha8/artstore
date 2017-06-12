<template>
  <div class="channel">
    <div class="chanel-item" v-for="(item, index) in items" key="index" :class="{'p50': cols===2, 'p100': cols===1}">
      <router-link :to="{name:'good', params: { id: item.id }}" class="good-item">
        <div class="item-img">
          <img :src="item.src" alt="">
        </div>
        <div class="item-info">
          <h3>{{item.name}}</h3>
          <div class="price">￥{{item.price}}</div>
        </div>
      </router-link>
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
      },
      cols: {
        type: Number,
        default: 3
      }
    },
    methods: {
      selectGood(target) {
        this.$emit('select', target);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .channel
    display: flex
    flex-wrap: wrap
    margin-left: 5px
    .chanel-item
      position: relative
      width: 33.3%
      height: auto
      vertical-align: top
      border-sizing: border-box
      padding-bottom: 10px
      .item-img img
        width: 31.5vw
        height: auto
      &.p50
        width: 50%
        .item-img img
          width: 48vw
          height: auto
      &.p100
        width: 100%
        .item-img img
          width: 100%
          height: auto
      .item-info
        h3
          line-height: 1.5
          min-height: 20px
          max-height: 40px
          font-size: 14px
          overflow: hidden
          text-overflow: ellipsis
        .price
          font-size: 14px
          color: #e4393c
          line-height: 1.2
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
</style>
