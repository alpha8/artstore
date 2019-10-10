<template>
  <div>
    <div class="slider-bg"></div>
    <swiper :options="swiperOption">
      <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
        <img :src="getSlideUrl(slide)" class="slide"  v-if="slide && slide.pic" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      swiperSlides: {
        type: Array
      }
    },
    data() {
      return {
        swiperOption: {
          autoplay: 3500,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: false,
          observeParents: true,
          loop: true,
          speed: 800,
          autoplayDisableOnInteraction: false
        }
      };
    },
    methods: {
      getSlideUrl(slide) {
        return `${slide.pic}?imageView2/0/w/750/h/500`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .swiper-container-horizontal > .swiper-pagination-bullets
    text-align: center
    right: 0
    width: auto
</style>

<style lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .swiper-container-horizontal > .swiper-pagination-bullets
    bottom: 3px
  .slider-bg
    background-image: -webkit-gradient(linear,left bottom,left top,from($color-main),color-stop(50%,$color-main));
    background-image: -webkit-linear-gradient(bottom,$color-main,$color-main 50%);
    background-image: linear-gradient(0deg,$color-main,$color-main 50%);
    position: absolute;
    top: 0;
    left: -25%;
    height: 7.25rem;
    width: 150%;
    border-bottom-left-radius: 100%;
    border-bottom-right-radius: 100%;
    overflow: hidden;
  .swiper-container
    width: 100%
    height: 9.35rem
    overflow: hidden
    .slide
      display: block;
      overflow: hidden;
      width: calc(100% - 1.25rem);
      height: 7rem;
      margin: 0 auto;
      top: 2.25rem;
      position: relative;
      border-radius: .35rem;
      img
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        border: 0;
        vertical-align: top;
    .swiper-pagination-bullet
      box-sizing: border-box;
      border-radius: 7px;
      height: 4px;
      width: 8px;
      background: hsla(0,0%,92.9%,.4);
      margin: 0 2px;
      display: inline-block;
      opacity: 1;
      &.swiper-pagination-bullet-active
        background: #ededed
        width: 12px
        margin: 0
</style>
