<template>  
  <swiper :options="swiperOption">
    <swiper-slide v-for="page in pages" :key="page">
      <div class="top_wrapper" ref="topchannel">
        <div class="top_list" ref="topList">
          <div class="top_item" v-for="channel in currentPageItems(page)" :class="channel.css">
            <div v-if="!channel.url" class="top_url" @click.stop.prevent="doAction(channel)">
              <img :src="channel.icon" class="top_icon" />
              <span class="top_name">{{channel.name}}</span>
            </div>
            <router-link v-else :to="channel.url" class="top_url">
              <img :src="channel.icon" class="top_icon" />
              <span class="top_name">{{channel.name}}</span>
            </router-link>
          </div>
        </div>
      </div>
    </swiper-slide>
    <div class="swiper-pagination swiper-pager" slot="pagination"></div>
  </swiper>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      channels: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      pages() {
        let items = this.channels || [];
        if (items.length <= this.pageSize) {
          return 1;
        } else {
          return Math.ceil(items.length / this.pageSize);
        }
      }
    },
    data() {
      return {
        swiperOption: {
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: false,
          loop: false
        },
        pageSize: 8
      };
    },
    methods: {
      showMoreItems(channel) {
        this.showMore = !this.showMore;
        let replace = channel.replace;
        if (replace) {
          channel.replace = channel.name;
          channel.name = replace;
        }
        let replaceIcon = channel.replaceIcon;
        if (replaceIcon) {
          channel.replaceIcon = channel.icon;
          channel.icon = replaceIcon;
        }
      },
      doAction(channel) {
        if (channel && channel.tag === 'more') {
          this.showMoreItems(channel);
        }
      },
      currentPageItems(page) {
        let offset = (page - 1) * this.pageSize;
        let end = page * this.pageSize;
        return this.channels.slice(offset, end);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .swiper-container-horizontal > .swiper-pager
    left: 0
    bottom: 0
    width: 100%
    font-size:0
    height: 16px
    line-height: 16px
    .swiper-pagination-bullet
      width: 5px;
      height: 5px;
      opacity: 1;
      background-color: rgba(0,0,0,.2);
      box-sizing: border-box;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      margin: 0 3px;
      &.swiper-pagination-bullet-active
        background-color: $color-main;
        width: 10px;
        height: 5px;
        border-radius: 3px;
        opacity: .7;
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  @require '../../common/stylus/variables'
  .swiper-container
    height: 9rem
    background-color: #fff
    .slide
      display: block
      width: 100%
      height: 100%
      content: ""
      background-repeat: no-repeat
      background-position: center
      background-size: cover
  .top_wrapper
    position: relative
    width: 100%
    white-space: nowrap
    overflow: hidden
    background-color: #fff
    .top_list
      position: relative
      display: flex
      flex-wrap: wrap
      height: 8.1rem
      box-sizing: border-box
      overflow: hidden
      &.more
        height: auto
      .top_item
        display: block
        width: 25%
        text-align: center
        box-sizing: border-box
        &:nth-child(4n)
          border-right: none
        .top_url
          display: block
          .top_icon
            width: 2rem;
            margin-top: .5rem;
            vertical-align: top;
          .top_name
            display: block;
            margin-top: .3rem;
            font-size: .6rem;
            color: #666;
</style>
