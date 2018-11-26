<template>
  <div>
    <fixedheader :title="getCoinTitle"></fixedheader>
    <div class="visit">
      <div class="visit-wrap">
        <div class="visit-container" ref="visitlist" v-show="visiters.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="visit-list">
            <table class="tablist">
              <tr class="head">
                <td class="col-2" nowrap>朋友</td>
                <td class="col-4">访问时间</td>
                <td class="col-3">{{getCoinName}}</td>
                <td class="col-3">来源</td>
              </tr>
              <tr v-for="(user, index) in visiters" :key="index">
                <td class="col-2" nowrap><img :src="getUserIcon(user.icon)" class="thumbnail" />{{user.nickName || '匿名'}}</td>
                <td class="col-4">{{user.createAt | formatDate}}</td>
                <td class="col-3">{{user.value || 0}}枚</td>
                <td class="col-3">{{getModule(user.type)}}</td>
              </tr>
            </table>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-visit" v-show="visiters.length === 0">啊哦，还没有相关记录哦</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';
  let Base64 = require('js-base64').Base64;

  export default {
    data() {
      return {
        visiters: [],
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0
      };
    },
    activated() {
      this.totalPages = 0;
      this.pageNumber = 1;
      this.loadEnd = false;
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.visitlist;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    computed: {
      getCoinName() {
        let config = this.$store.getters.getCoinConfig;
        return config.name || '金币';
      },
      getCoinTitle() {
        return `我的朋友 / 我的${this.getCoinName}`;
      }
    },
    methods: {
      fetchData(force) {
        if (this.totalPages && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        let user = this.$store.getters.getUserInfo;
        api.getCoinList({
          userId: user.userId || -1,
          currentPage: this.pageNumber,
          pageSize: this.pageSize
        }).then(response => {
          if (response.data && response.data.length) {
            response.data.forEach(item => {
              item.nickName = item.nickName ? Base64.decode(item.nickName) : '';
              this.visiters.push(item);
            });
          }
          this.totalPages = response.totalPages;
          this.pageNumber++;
          this.lastExec = +new Date();
          this.loading = false;
          this.loadEnd = this.pageNumber > this.totalPages;
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      _reset() {
        this.visiters = [];
        this.pageNumber = 1;
        this.totalPages = 0;
      },
      getUserIcon(icon) {
        if (!icon) {
          return api.CONFIG.usericon;
        }
        return icon;
      },
      getModule(type) {
        if (type) {
          return api.CONFIG.CoinSourceMapping[type] || '';
        }
        return '';
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      loadMore() {
        this.fetchData();
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      fixedheader, gotop
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    top: 0
    width: 100%
    height: 44px
    overflow: hidden
    z-index: 2
  .visit
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .visit-wrap
      position: relative
      width: 100%
      .btn-red
        background: #d05148
        color: #fff
      .btn-blue
        background: #3a77e7
        color: #fff
      .btn-green
        background: #44b549
        color: #fff
      .btn-orange
        background: #f19325
        color: #fff
      .btn-white
        background: #fff
        color: #333
        border: 1px solid #ddd
      .tab
        position: relative
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
          flex: 1
          font-size: 14px
          padding: 15px 0
          text-align: center
          border-bottom: 2px solid transparent
          &.active
            color: #f15353
            border-bottom: 2px solid #f15353
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .visit-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        background-color: #fff
        .tablist
          position: relative
          width: 100%
          font-size: 13px
          background-color: #fff
          color: #666
          text-align: left
          tr
            height: 40px
            line-height: 40px
          >.head
            background-color: #fafafa
            font-size: 14px
          .col-1
            width: 15%
            padding-left: 10px
            box-sizing: border-box
            span
              display: inline-block
              height: 15px
              width: 30px
              line-height: 15px
              vertical-align: middle
              text-align: center
              color: #f1f1f1
              background-color: #747474
              border-radius: 1px
              &.highlight
                background-color: #00a0dc
          .col-2
            flex: 1
            width: 135px
            padding-left: 8px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            word-wrap: break-word
            word-break: break-all
            box-sizing: border-box
          .col-3
            width: 25%
            padding-left: 10px
            word-break: break-all
            overflow: hidden
            box-sizing: border-box
          .col-4
            flex: 1
            padding-left: 8px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            box-sizing: border-box
          .text-center
            text-align: center
          .thumbnail
            width: 32px
            height: 32px
            border-radius: 50%
            margin-right: 3px
            vertical-align: middle
            overflow: hidden
            box-sizing: border-box
        .visit-list
          position: relative
          width: 100%
      .no-visit
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
