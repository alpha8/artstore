<template>
  <div>
    <fixedheader title="出价列表"></fixedheader>
    <div class="bid">
      <div class="bid-wrap">
        <div class="bid-container" ref="bidlist" v-show="bids.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="bid-list">
            <table class="auction-pricelist">
              <tr class="head">
                <td class="col-2" nowrap>出价用户</td>
                <td class="col-3">金额</td>
                <td class="col-1">状态</td>
                <td class="col-4">出价时间</td>
              </tr>
              <tr v-for="(bid, index) in bids" :key="index">
                <td class="col-2" nowrap><img :src="getUserIcon(bid.icon)" class="thumbnail" />{{bid.userName || bid.userNameId}}</td>
                <td class="col-3">{{bid.price | currency}}</td>
                <td class="col-1"><span :class="{'highlight': bid.state !== '淘汰'}">{{bid.state}}</span></td>
                <td class="col-4">{{bid.time | formatDate}}</td>
              </tr>
            </table>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-bid" v-show="bids.length === 0">啊哦，还没有相关记录哦</div>
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
        bids: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0
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
      this.scroller = this.$refs.bidlist;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
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
        let aid = this.$route.params.id || 0;
        if (!aid) {
          return;
        }
        this.loading = true;
        api.getBidPrices({
          paging: this.pageNumber,
          pageSize: this.pageSize,
          auctionProductId: aid
        }).then(response => {
          if (response.result === 0) {
            if (response.info.apprList && response.info.apprList.length) {
              response.info.apprList.forEach(item => {
                item.userName = Base64.decode(item.userName);
                this.bids.push(item);
              });
              this.totalPages = response.info.total <= this.pageSize ? 1 : Math.ceil(response.info.total / this.pageSize);
            }
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
        this.bids = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icons = item.icons;
        if (icons && icons.length) {
          return api.CONFIG.psCtx + icons[0].id + '?w=228&h=228';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getUserIcon(icon) {
        if (!icon) {
          return 'http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10';
        }
        return icon;
      },
      showProductDetail(product) {
        this.$router.push({name: 'good', params: {id: product.artworkId}});
      },
      removeItem(product) {
        let user = this.$store.getters.getUserInfo;
        api.removeCollect({
          userId: user.userId || 0,
          type: 1,
          artworkId: product.artworkId
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '已取消收藏！');
            let items = this.bids;
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === product.id) {
                items.splice(i, 1);
              }
            }
            this.bids = items;
          }
        });
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
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
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
  .bid
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .bid-wrap
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
      .bid-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .auction-pricelist
          position: relative
          width: 100%
          font-size: 12px
          background-color: #fff
          color: #666
          text-align: left
          tr
            height: 40px
            line-height: 40px
          >.head
            background-color: #fafafa
            font-size: 13px
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
            padding-left: 10px
            overflow: hidden
            box-sizing: border-box
          .col-3
            width: 15%
            padding-left: 10px
            word-break: break-all
            overflow: hidden
            box-sizing: border-box
          .col-4
            flex: 1
            padding-left: 10px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            box-sizing: border-box
          .thumbnail
            width: 32px
            height: 32px
            border-radius: 50%
            margin-right: 3px
            vertical-align: middle
            overflow: hidden
            box-sizing: border-box
        .bid-list
          position: relative
          width: 100%
      .no-bid
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
