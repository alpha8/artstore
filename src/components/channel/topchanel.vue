<template>
  <div class="top_wrapper" ref="topchannel">
    <div class="top_list" ref="topList">
      <div class="top_item" v-for="channel in channels">
        <router-link :to="channel.url" class="top_url">
          <i :class="channel.icon" class="top_icon"></i>
          <h3 class="top_name">{{channel.name}}</h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    props: {
      channels: {
        type: Array
      }
    },
    mounted() {
      this._initScroll();
    },
    methods: {
      _initScroll() {
        let len = this.channels.length;
        if (len) {
          let topList = this.$refs.topList;
          let itemWidth = topList.getElementsByClassName('top_item')[0].offsetWidth;
          topList.style.width = itemWidth * len + 20 + 'px';
        }
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.topchannel, {
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .top_wrapper
    position: relative
    width: 100%
    height: 90px
    white-space: nowrap
    overflow: hidden
    .top_list
      position: relative
      height: 100%
      .top_item
        display: inline-block
        width: 22.2vw
        float: left
        padding: 15px 0
        text-align: center
        box-sizing: border-box
        &:last-child
          .top_url
            border-right: none
        .top_url
          display: block
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          .top_icon
            display: block
            width: 40px
            height: 40px
            margin: 0 auto
            font-size: 36px
            color: #00BB9C
          .top_name
            font-size: 12px
            color: #666
            text-align: center
            line-height: 1.2
            margin-top: 6px
            font-weight: 400
</style>
