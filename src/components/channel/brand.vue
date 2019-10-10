<template>
  <div class="channel-wrap">
    <div class="title">
      <div class="text">品牌闪购</div>
      <div class="more" @click.stop.prevent="fetchMore">更多</div>
    </div>
    <div class="channel">
      <div class="chanel-item" v-for="(item, index) in items" :key="item.id">
        <div @click.stop.prevent="goGoodDetail(item)" class="good-item">
          <div class="item-img">
            <img v-lazy="getThumbnail(item)" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import api from '@/api/api';
  export default {
    name: 'brandList',
    props: {
      items: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      getThumbnail(item) {
        let pic = item.logo;
        if (pic) {
          return `${pic}?imageView2/2/w/150/h/150`;
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
  .channel-wrap
    display: block
    width: 100%
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
        right: 13px
        margin-top: -4px
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
        .seckill-name
          font-size: 12px
          color: #232326
          font-weight: 700
          display: inline-block
          margin-left: .3rem
      .more
        position: absolute
        display: block
        height: 16px
        line-height: 16px
        top: 50%
        right: 21px
        margin-top: -8px
        font-size: 12px
        color: #666
  .channel
    display: flex
    flex-wrap: wrap
    margin: 0 8px
    background-color: #fff
    min-height: 85px
    max-height: 175px
    overflow: hidden
    .good-item
      background-color: #fff
    .chanel-item
      position: relative
      width: 33.3%
      height: auto
      vertical-align: top
      padding: 0 .25rem
      box-sizing: border-box
      .item-img
        position: relative
        width: 100%
        overflow: hidden
        text-align: center
        img
          width: 80px
          height: 80px
          padding: 8px
          border-radius: 15px
          box-sizing: border-box
      .item-info
        position: relative
        width: 100%
        padding-bottom: 4px
        box-sizing: border-box
        h3
          line-height: 16px
          height: 31px
          font-size: $fontsize-medium-s
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
          word-wrap: break-word
          word-break: break-all
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
          height: 16px
          line-height: 16px
          text-align: center
        .market_price
          color: #999
          font-size: 12px
          line-height: 12px
          margin: 4px 0 11px
          text-align: center
          padding: 0 2px
          position: relative
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
</style>
