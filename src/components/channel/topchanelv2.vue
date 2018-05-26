<template>  
  <swiper :options="swiperOption">
    <swiper-slide v-for="page in pages" :key="page">
      <div class="top_wrapper" ref="topchannel">
        <div class="top_list" ref="topList">
          <div class="top_item" v-for="channel in currentPageItems(page)" :class="channel.css">
            <div v-if="!channel.url" class="top_url" @click.stop.prevent="doAction(channel)">
              <i :class="channel.icon" class="top_icon"></i>
              <h3 class="top_name">{{channel.name}}</h3>
            </div>
            <router-link v-else :to="channel.url" class="top_url">
              <i :class="channel.icon" class="top_icon"></i>
              <h3 class="top_name">{{channel.name}}</h3>
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
  .swiper-container-horizontal > .swiper-pager
    left: 0
    bottom: 0
    width: 100%
    font-size:0
    height: 16px
    border-top: 1px solid rgba(7, 17, 27, 0.1)
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    background: #f3f5f7
    .swiper-pagination-bullet
      width: 30px
      height: 3px
      background: #ccc
      opacity: .6
      border-radius: 20px
      margin: 7.5px 3px 7.5px 0
      &.swiper-pagination-bullet-active
        background: #00a0dc
        width: 30px
        border-radius: 20px
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  @require '../../common/stylus/variables'
  .swiper-container
    height: 147px
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
    height: auto
    white-space: nowrap
    overflow: hidden
    .top_list
      position: relative
      display: flex
      flex-wrap: wrap
      height: 129px
      box-sizing: border-box
      overflow: hidden
      &.more
        height: auto
      .top_item
        display: block
        width: 25%
        padding: 7px 0
        height: 65px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        box-sizing: border-box
        &:nth-child(4n)
          border-right: none
        &.nobottom
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .top_url
          display: block
          .top_icon
            display: block
            width: 35px
            height: 35px
            margin: 0 auto
            font-size: $fontsize-homeicon
            color: $color-molv
            &.big
              font-size: $fontsize-homebigicon
            &.icon-teapot_kitchen
              font-size: 34px
          .top_name
            font-size: $fontsize-small
            color: $color-darkgray
            text-align: center
            line-height: 1.2
            margin-top: 1px
            font-weight: 400
</style>
