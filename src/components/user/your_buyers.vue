<template>
  <div>
    <fixedheader title="购买过的买家"></fixedheader>
    <div class="buyers">
      <div class="buyers-wrap">
        <div class="buyers-container" ref="buyersRef" v-show="buyers.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="buyers-list">
            <table>
              <tr>
                <th class="col-1">朋友</th>
                <th class="col-3">订单总额</th>
                <th class="col-5">订单数</th>
                <th class="col-5">最近购买</th>
                <th class="col-5">首次购买</th>
              </tr>
              <tr v-for="(item, index) in buyers" :key="index" @click.stop.prevent="showOrders(item)">
                <td class="col-1"><img :src="getUserIcon(item.icon)" class="thumbnail" />{{item.nickName}}</td>
                <td class="col-3">{{item.totalFee | currency}}</td>
                <td class="col-5">{{item.count}}</td>
                <td class="col-5"><span v-if="item.latestTime">{{item.latestTime | formatDate}}</span></td>
                <td class="col-5"><span v-if="item.firstTime">{{item.firstTime | formatDate}}</span></td>
              </tr>
            </table>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-buyers" v-show="buyers.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
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
        buyers: [],
        pageNumber: 1,
        pageSize: 20,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
      };
    },
    activated() {
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.buyersRef;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        let user = this.$store.getters.getUserInfo;
        api.getYourBuyers({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          rid: user.userId || 0
        }).then(response => {
          if (response.code === 0) {
            if (response.data && response.data.length) {
              response.data.forEach(item => {
                if (item.nickName) {
                  item.nickName = Base64.decode(item.nickName);
                } else {
                  item.nickName = '匿名';
                }
                this.buyers.push(item);
              });
            }
            this.totalPages = response.totalPages || 1;
            this.pageNumber++;
            this.lastExec = +new Date();
            this.loading = false;
            this.loadEnd = this.pageNumber > this.totalPages;
          }
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      _reset() {
        this.buyers = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
        this.lastExec = 0;
      },
      getUserIcon(icon) {
        if (!icon) {
          return 'http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10';
        }
        return icon;
      },
      showOrders(item) {
        this.$router.push({name: 'yourorders', params: {uid: item.userId}});
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      back() {
        this.$router.back();
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
        return formatDate(date, 'yyyy-MM-dd');
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
  .buyers
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .buyers-wrap
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
      .buyers-container
        position: relative
        width: 100%
        padding-right: 5px
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .buyers-list
          position: relative
          width: 100%
        table
          position: relative
          width: 100%
          font-size: 12px
          background-color: #fff
          color: #666
          text-align: left
          tr
            display: flex
            height: 40px
            line-height: 40px
          th
            background-color: #fafafa
            font-size: 13px
          .col-1, .col-4
            flex: 1
            padding-left: 10px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            word-wrap: break-word
            word-break: break-all
            box-sizing: border-box
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
          .col-3, .col-4, .col-5
            width: 18%
            padding-left: 8px
            word-break: break-all
            overflow: hidden
            box-sizing: border-box
          .col-5
            width: 19%
          .highlight
            font-weight: 700
            color: #ff463c
          .thumbnail
            width: 32px
            height: 32px
            border-radius: 50%
            margin-right: 3px
            vertical-align: middle
            overflow: hidden
            box-sizing: border-box
      .no-buyers
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
</style>
