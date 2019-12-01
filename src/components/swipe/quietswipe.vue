<template>
  <swiper :options="swiperOption" class="swiperHook" :style="getStyle">
    <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
      <img v-lazy="getSlideUrl(slide)" class="slide2"  v-if="slide && slide.src" @click.stop.prevent="preview(slide.src)" />
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
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientWidth
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
      preview(img) {
        let pics = [];
        this.swiperSlides.forEach(item => {
          pics.push(item.src);
        });
        wx.previewImage({
          current: img,
          urls: pics
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .swiper-container-horizontal > .swiper-pagination-bullets
    bottom: 9px
  .swiper-container
    position: relative
    .slide2
      display: block
      width: 100%
      height: 100%
      min-height: 213px
      >img
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        border: 0;
        vertical-align: top;
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
