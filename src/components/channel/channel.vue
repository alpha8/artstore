<template>
  <div class="channel">
    <div class="chanel-item" v-for="(item, index) in items" :key="index" :class="{'p50': cols===2, 'p100': cols===1}">
      <div @click.stop.prevent="goGoodDetail(item)" class="good-item">
        <div class="item-img">
          <img v-lazy="getThumbnail(item)" alt="">
        </div>
        <div class="item-info">
          <h3>{{item.name || ''}}</h3>
          <div class="price"><div class="num">{{item.price | currency}}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
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
        let pic = item.pic;
        if (pic) {
          return `${pic}?imageView2/2/w/372/h/372`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      goGoodDetail(item) {
        this.$router.push({name: 'good', params: {id: item.id}});
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .channel
    display: flex
    flex-wrap: wrap
    margin: 0 8px
    background-color: $color-bg
    border-top: 2px #f0f2f5 solid
    .good-item
      background-color: #fff
    .chanel-item
      position: relative
      width: 33.3%
      height: auto
      vertical-align: top
      box-sizing: border-box
      padding-bottom: 4px
      &:nth-child(2n)
        padding-left: 2px
      &:nth-child(odd)
        padding-right: 2px
      .item-img
        position: relative
        width: 100%
        min-height: 102px
        overflow: hidden
        text-align: center
        img
          width: 31.5vw
          height: auto
      &.p50
        width: 50%
        .item-img img
          width: 194px
          height: 194px
      &.p100
        width: 100%
        .item-img img
          width: 100%
          height: auto
      .item-info
        position: relative
        width: 100%
        padding-left: 3px
        padding-bottom: 4px
        box-sizing: border-box
        h3
          line-height: 16px
          height: 31px
          font-size: $fontsize-medium-s
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          /*! autoprefixer: off */
          -webkit-box-orient:vertical
          /*! autoprefixer: on */
          word-break: break-word
          padding: 0 4px
          margin-bottom: 3px
        .price
          position: relative
          color: $color-red
          font-size: $fontsize-large
          font-weight: 700
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: bottom
          height: 25px
          line-height: 25px
          padding: 0 4px
          .num
            display: block
            float: left
            bottom: 0
          .salesCount
            display: block
            color: $color-gray
            font-size: $fontsize-small-s
            margin-left: 6px
            float: left
            margin-top: 1.5px
</style>
