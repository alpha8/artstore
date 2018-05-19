<template>
  <swiper :options="swiperOption">
    <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
      <div class="slide" :style="getSlideUrl(slide)"></div>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
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
        return `background-image: url(${slide})`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .swiper-container-horizontal > .swiper-pagination-bullets
    text-align: right
    right: 10px
    width: auto
</style>

<style lang="stylus" rel="stylesheet/stylus">
  .swiper-container-horizontal > .swiper-pagination-bullets
    bottom: 7px
  .swiper-container
    height: 45vw
    .slide
      display: block
      width: 100%
      height: 100%
      content: ""
      background-repeat: no-repeat
      background-position: center
      background-size: cover
    .swiper-pagination-bullet
      background: #fff
      opacity: .6
      &.swiper-pagination-bullet-active
        background: #00a0dc
        width: 15px
        border-radius: 10px
</style>
