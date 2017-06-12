<template>
  <div class="toolbar">
    <div class="toolbar-wrapper">
      <div class="search-form">
        <div class="search-form-box">
          <i class="icon-search"></i>
          <div class="search-form-input">
            <input type="text" name="txtSearch" class="txtSearch" placeholder="优雅茶道，由你传承！" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="ext-tools">
        <span>登录</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {

  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toolbar
    position: fixed
    margin: 0 auto
    top: 0
    left: 0
    right: 0
    z-index: 10
    height: 39px
    padding: 0 10px
    &.fixed
      background: #b80d10
      animation: searchTop .5s ease-in-out
    @-webkit-keyframes searchTop
      from { top: -50px; }
      to { top: 0;}
    @keyframes searchTop
      from { top: -50px; }
      to { top: 0;}
    .toolbar-wrapper
      position: relative
      height: 100%
      padding-right: 36px
      .search-form
        display: inline-block
        width: 100%
        .search-form-box
          position: relative
          height: 29px
          overflow: hidden
          background: white
          -moz-border-radius: 15px
          -webkit-border-radius: 15px
          border-radius: 15px
          margin-top: 5px
          .icon-search
            position: relative
            display: inline-block
            width: 12px
            height: 12px
            top: 6px
            left: 6px
            float: left
            color: #d5d4d4
          .search-form-input
            display: inline-block
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            .txtSearch
              display: inline-block
              background: 0
              border: 0
              width: 100%
              line-height: 16px
              height: 16px
              margin-top: 6px
              vertical-align: middle
              font-size: 12px
              color: #666
              text-indent: 28px
              text-overflow: ellipsis
              white-space: nowrap
      .ext-tools
        position: absolute
        display: inline-block
        right: 0
        top: 0
        line-height: 39px
        span
          font-size: 13px
          color: #fff
</style>
