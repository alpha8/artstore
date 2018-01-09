<template>
  <swiper :options="swiperOption" class="swiperHook" :style="getStyle">
    <swiper-slide v-for="(slide, index) in swiperSlides" key="index">
      <div class="slide2" :style="getSlideUrl(slide)" @click.stop.prevent="preview(slide.src)"></div>
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
          height: screen.width ? screen.width * 2 / 3 : 250
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
        return {
          'background-image': `url(${slide.thumbnail})`,
          width: this.screen.width + 'px',
          height: this.screen.height + 'px'
        };
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
    position: relative
    .slide2
      display: block
      width: 100%
      height: 100%
      min-height: 213px
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
          background: #00a0dc
          width: 15px
          border-radius: 10px
</style>
