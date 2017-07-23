<template>
  <div class="channel">
    <div class="chanel-item" v-for="(item, index) in items" key="index" :class="{'p50': cols===2, 'p100': cols===1}">
      <router-link :to="{name:'good', params: { id: item.id }}" class="good-item">
        <div class="item-img">
          <img :src="getThumbnail(item)" alt="">
        </div>
        <div class="item-info">
          <h3>{{item.name}}</h3>
          <div class="price">¥<span class="num">{{item.price}}</span></div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
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
      },
      getThumbnail(item) {
        let pic = item.pictures;
        if (pic && pic.length) {
          return api.CONFIG.psCtx + pic[0].id + '?w=228&h=128';
        } else {
          return api.CONFIG.defaultImg;
        }
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
      box-sizing: border-box
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
          height: 20px
          font-size: 14px
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
        .price
          margin-top: 3px
          color: #ff463c
          font-size: 14px
          font-weight: 700
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
</style>
