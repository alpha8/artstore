<template>
  <div class="sku-main">
    <div class="main">
      <div class="header">
        <img src="" alt="" class="avt">
        <p class="price">¥<em>98</em></p>
        <p class="prop"><span>已选</span> 黑色,1个</p>
        <i class="close"></i>
      </div>
      <div class="body">
        <div class="sku-area">
          <div class="sku-item">颜色</div>
          <div class="sku-choose">
            <span class="item">黑色</span>
            <span class="item">红色</span>
            <span class="item">桔色</span>
            <span class="item">绿色</span>
          </div>
          <div class="sku-item">尺码</div>
          <div class="sku-choose">
            <span class="item">XL</span>
            <span class="item">L</span>
            <span class="item">M</span>
            <span class="item">S</span>
            <span class="item">XS</span>
          </div>
          <div class="count-choose">
            <div class="num-wrap">
              <span class="minus"><i></i></span>
              <div class="text-wrap"><input type="text" class="text" id="buyNum"></div>
              <span class="plus"><i></i></span>
            </div>
          </div>
        </div>
      </div>
      <div class="btns"><span class="btn">确认</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {

  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .sku-main
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 110
    background-color: rgba(0,0,0,.7)
    .main
      position: absolute
      width: 100%
      height: 400px
      bottom: 0
      background: #fff
      transform: translate3d(0,0,0)
      transition: transform .2s cubic-bezier(0,0,.25,1),-webkit-transform .2s cubic-bezier(0,0,.25,1)
      .header
         
</style>
