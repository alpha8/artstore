<template>
  <div class="poster">
    <div class="slide-wrap">
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5bdc5803e4b009b7223c520a?w=750&h=500&v=v2" alt="" />
      </div>
    </div>
    <div class="slide-wrap">
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5bdc5815e4b009b7223c520e?w=750&h=500&v=v2" alt="" />
      </div>
      <div class="slide">
        <img src="http://imgcdn.yihuyixi.com/ps/download/5bdc5817e4b009b7223c520f?w=750&h=500&v=v2" alt="" />
      </div>
    </div>
    <div class="poster-info">
      <div class="item-info">
        <h1 class="pname">[曦瓜] 正山小种(红茶.源味250g) [一虎一席.品牌榜]</h1>
        <div class="price"><span class="now">¥75</span><span class="old">¥100</span></div>
      </div>
      <div class="qrcode"><img src="http://www.yihuyixi.com/cms/qrcode/artwork?aid=5bdc5c49e4b009b7223c5238" border="0" width="120" height="120"></img></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    methods: {
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .poster
    position: absolute
    width: 100%
    top: 0
    bottom: 0
    overflow: hidden
    background: #e1e1e1
    .slide-wrap
      position: relative
      display: flex
      width: 100%
      .slide
        flex: 1
        box-sizing: border-box
        margin-right: 5px
        &:last-child
          margin-right: 0
        img
          width: 100%
          height: auto
          overflow: hidden
    .poster-info
      position: relative
      display: flex
      align-items: center
      background-color: #fff
      border-radius: 20px
      margin: 10px 8px 0
      padding: 0 20px
      box-sizing: border-box
      .item-info
        flex: 1
        font-size: 14px
        padding-left: 5px
        box-sizing: border-box
        .pname
          font-weight: 700
          color: #07111b
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
        .price
          padding-top: 5px
          .now
            margin-right: 8px
            font-weight: 700
            color: #f01414
          .old
            text-decoration: line-through
            color: #93999f
      .qrcode
        text-align: right
</style>
