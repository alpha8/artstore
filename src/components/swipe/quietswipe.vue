<template>
  <swiper :options="swiperOption">
    <swiper-slide v-for="(slide, index) in swiperSlides" key="index">
      <div class="slide" :style="getSlideUrl(slide)" @click.stop.prevent="preview(slide.src)"></div>
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
        }
      };
    },
    methods: {
      getSlideUrl(slide) {
        return `background-image: url(${slide.thumbnail})`;
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

<style lang="stylus" rel="stylesheet/stylus">
  .swiper-container
    height: 40vw
    .slide
      display: block
      width: 100%
      height: 100%
      content: ""
      background-repeat: no-repeat
      background-position: center
      background-size: cover
    .pager
      width: 100%
      .swiper-pagination-bullet
        background: #ccc
        opacity: .9
        &.swiper-pagination-bullet-active
          background: #267fd4
          width: 15px
          border-radius: 10px
</style>
