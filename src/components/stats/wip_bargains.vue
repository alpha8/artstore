<template>
  <div>
    <fixedheader title="正在砍价的订单"></fixedheader>
    <div class="stats">
      <div class="stats-wrapper">
        <div class="stats-container" ref="statList" v-show="orders.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="detail_list">
            <ul class="newitem head">
              <li class="col-2">发起人</li>
              <li class="col-2">砍价商品</li>
              <li class="col-5">当前价</li>
              <li class="col-5">底价</li>
              <li class="col-5">状态</li>
              <li class="col-2">创建时间</li>
            </ul>
            <mu-flexbox-item basis="100%" class="newitem border-1px" v-for="(item, idx) in orders" :key="idx">
              <div class="col-2" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" class="thumbnail" />{{getFriendlyUsername(item.userName)}}</div>
              <div class="col-2" @click.stop.prevent="showDetail(item)">{{item.name}}</div>
              <div class="col-5">{{(item.dealFee || 0) | currency}}</div>
              <div class="col-5">{{(item.buttomFee || 0) | currency}}</div>
              <div class="col-5">{{states[item.status]}}</div>
              <div class="col-2">{{item.createAt | formatDate}}</div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-stats" v-show="orders.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from '@/common/js/date';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import modalTitle from '@/components/modal-title/modal-title';
  import split from '@/components/split/split';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';
  let Base64 = require('js-base64').Base64;

  export default {
    data() {
      return {
        scrollY: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: 0,
        orders: [],
        states: {
          0: '正在砍价',
          1: '到达底价',
          2: '等待付款',
          3: '砍价成功',
          4: '',
          5: '砍价成功'
        }
      };
    },
    activated() {
      this.loadEnd = false;
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.statList;
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
        api.getWIPBargains({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          statuses: '0,1,2'
        }).then(response => {
          if (response.list && response.list.length) {
            response.list.forEach(item => {
              this.orders.push(item);
            });
          }
          this.totalPages = response.pages;
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
        this.orders = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
        this.lastExec = 0;
      },
      getThumbnail(item) {
        return item.userIcon || api.CONFIG.usericon;
      },
      getFriendlyUsername(userName) {
        if (userName) {
          return Base64.decode(userName);
        }
        return '匿名';
      },
      showDetail(item) {
        this.$router.push({name: 'sharedetail', params: {id: item.fieldId}, query: {shareId: item.id}});
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
      fixedheader, split, modalTitle, gotop
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yy/MM/dd hh:mm:ss');
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
  .stats
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .no-more
      width: 100%
      padding: 10px 0 18px
      color: #ccc
      text-align: center
      font-size: 12px
      margin-bottom: 10px
    .stats-wrapper
      position: relative
      width: 580px
      @media screen and (min-width: 768px)
        width: 100%
    .stats-container
      position: relative
      width: 100%
      display: flex
      flex-wrap: wrap
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      background-color: #fff
      .detail_list
        position: relative
        width: 100%
        .newitem
          position: relative
          display: flex
          width: 100%
          height: 40px
          line-height: 40px
          border-1px(rgba(7, 17, 27, 0.1))
          box-sizing: border-box
          font-size: 12px
          &:nth-child(odd)
            background: #fafafa
          &.head
            font-size: 13px
            background-color: #fafafa
          .col, .col-1, .col-2, .col-3
            padding-left: 10px
            box-sizing: border-box
          .col
            width: 25px
          .col-1
            width: 18%
          .col-5
            width: 12%
            text-align: center
          .col-2
            flex: 1
            word-break: break-all
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            overflow: hidden
          .col-3
            width: 25%
            text-align: center
            word-break: break-all
            overflow: hidden
          .thumbnail
            width: 32px
            height: 32px
            margin-right: 5px
            border-radius: 50%
            vertical-align: middle
            box-sizing: border-box
            overflow: hidden
    .no-stats
      width: 100%
      padding: 40px 0
      text-align: center
      font-size: 14px
      color: #ccc
</style>
