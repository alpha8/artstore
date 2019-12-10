<template>
  <swiper :options="swiperOption" class="swiperHook" :style="getStyle">
    <swiper-slide v-for="(slide, index) in swiperSlides" :key="index" v-if="slide.thumbnail">
      <img :src="slide.thumbnail" class="slide2" @click.stop.prevent="search" />
    </swiper-slide>
    <div class="swiper-pagination pager" slot="pagination"></div>
  </swiper>
</template>

<script type="text/ecmascript-6">
  import wx from 'weixin-js-sdk';
  export default {
    props: {
      swiperSlides: {
        type: Array
      },
      goods: {
        type: Object,
        default() {
          return {};
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
          observeParents: true
        },
        screen: {
          width: (document.documentElement.clientWidth * 0.68),
          height: (document.documentElement.clientWidth * 0.68) * 0.33 || 175
        }
      };
    },
    computed: {
      getStyle() {
        return {
          width: this.screen.width + 'px',
          height: this.screen.height + 'px'
        };
      }
    },
    methods: {
      getSlideUrl(slide) {
        return `${slide.thumbnail}`;
      },
      search() {
        this.$router.push({name: 'search', query: { pid: this.goods.id, key: this.goods.name }});
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .swiper-container-horizontal > .swiper-pagination-bullets
    bottom: 1px
  .swiper-container
    position: relative
    .slide2
      display: block
      width: 100%
      height: 100%
      min-height: 80px
    .pager
      width: 100%      
      .swiper-pagination-bullet
        background: #ccc
        opacity: .9
        &.swiper-pagination-bullet-active
          background: #00a0dc
          width: 15px
          border-radius: 10px
</style>
