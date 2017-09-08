<template>
  <div class="search-wrapper" v-show="showDialog">
    <div class="smartbox">
      <div class="history-search">
        <div class="title">
          <div class="text">最近搜索</div>
          <div class="cleanup" @click.stop.prevent="cleanup">清除</div>
        </div>
        <ul class="tags">
          <li class="tag" v-for="item in historySearch">
            <router-link :to="{path: '/search', query: {keyword: item.text}}">{{item.text}}</router-link>
          </li>
        </ul>
      </div>
      <div class="hot-search">
        <div class="title">
          <div class="text">热门搜索</div>
          <div class="nextPage"></div>
        </div>
        <ul class="tags">
          <li class="tag" v-for="item in hotSearch">
            <router-link :to="{path: '/search', query: {keyword: item.text}}">{{item.text}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showBox: false,
        hotSearch: [
          {text: '绿茶', pv: 500},
          {text: '铁观音', pv: 2000},
          {text: '乔木生普', pv: 2000},
          {text: '茶仓', pv: 2000},
          {text: '红泥小火炉', pv: 2000},
          {text: '鸣雀杯', pv: 2000},
          {text: '品茗杯', pv: 2000},
          {text: '闲云野鹤杯', pv: 2000},
          {text: '马蹄杯', pv: 2000},
          {text: '瓷雕', pv: 2000}
        ],
        historySearch: [
          {text: '茶杯', pv: 2000},
          {text: '绿茶', pv: 2000}
        ],
        keyword: ''
      };
    },
    computed: {
      showDialog() {
        return this.$store.state.searchDialog;
      }
    },
    methods: {
      cleanup() {
        this.historySearch.splice(0, this.historySearch.length);
      },
      hideDialog() {
        this.$store.commit('HIDE_SEARCH');
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search-wrapper
    position: fixed
    top: 39px
    left: 0
    right: 0
    bottom: 0
    background: #fafafa
    z-index: 10
    .search-bar
      position: relative
      display: flex
      width: 100%
      padding: 9px 10px
      box-sizing: border-box
      .icon-search
        position: absolute
        left: 15px
        top: 50%
        width: 18px
        height: 18px
        margin-top: -9px
        color: #d5d4d4
        font-size: 18px
      .search-input
        flex: 1
        width: 100%
        .search-txt
          display: inline-block
          width: 100%
          line-height: 16px
          height: 16px
          margin-top: 9px
          text-indent: 30px
          vertical-align: middle
          font-size: 12px
          color: rgb(7, 17, 27)
          text-overflow: ellipsis
          white-space: nowrap
          background: transparent
      .search-btn
        flex: 0 0 60px
        padding: 10px 0
        background: rgba(0, 187, 156, 0.87)
        color: #fff
        text-align: center
        border-radius: 3px
        font-size: 14px
        &.discard
          background: rgba(7, 17, 27, 0.1)
    .smartbox
      width: 100%
      padding: 10px
      box-sizing: border-box
      .title
        position: relative
        height: 40px
        line-height: 40px
        font-size: 14px
        .cleanup, .nextPage
          position: absolute
          right: 0
          bottom: 0
          height: 40px
          line-height: 40px
          color: #3985ff
      .tags
        position: relative
        width: 100%
        height: auto
        .tag
          float: left
          height: 30px
          line-height: 30px
          color: #666
          background: #efefef
          margin: 0 10px 10px 0
          padding: 0 5px
          border: 1px solid #ddd
          border-radius: 3px
          font-size: 12px
        &:after
          clear: both
          display: block
          content: ''
      .hot-search
        margin-top: 10px
</style>

