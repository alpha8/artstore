<template>
  <div>
    <fixedheader title="用户访问详情"></fixedheader>
    <div class="stats">
      <div class="stats-wrapper">
        <div class="stats-container" ref="statList" v-show="pvs.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="detail_list">
            <ul class="newitem head">
              <li class="col-2">访问用户</li>
              <li class="col-1">模块</li>
              <li class="col-2">详情</li>
              <li class="col-2">访问时间</li>
              <li class="col-5">点击数</li>
            </ul>
            <mu-flexbox-item basis="100%" class="newitem border-1px" v-for="(item, idx) in pvs" :key="idx">
              <div class="col-2"><img :src="getThumbnail(item)" class="thumbnail" />{{(item.user && item.user.nickName) || '匿名'}}</div>
              <div class="col-1">{{moduleMapping[item.module] || ''}}</div>
              <div class="col-2" @click.stop.prevent="openGoodDetail(item)">{{getDetailItem(item).name || ''}}</div>
              <div class="col-2">{{item.createAt | formatDate}}</div>
              <div class="col-5">{{item.pv}}</div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-stats" v-show="pvs.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
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

  export default {
    data() {
      return {
        scrollY: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        pvs: [],
        moduleMapping: {
          'productdetail': '商品详情',
          'seckilldetail': '秒杀详情',
          'groupbuydetail': '团购详情',
          'auctiondetail': '拍卖详情',
          'articledetail': '文章详情',
          'home': '首页',
          'category': '分类',
          'usercenter': '个人中心',
          'pay': '下单'
        }
      };
    },
    activated() {
      this.pvs = [];
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
        if (this.totalPages && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        let id = this.$route.query.id || '';
        let dateStr = this.$route.query.dateStr || '';
        let userId = this.$route.query.userId || 0;
        let unlogin = this.$route.query.unlogin || '';
        api.goodsPvDetail({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          pid: id,
          dateStr: dateStr,
          userId: userId,
          unlogin: unlogin
        }).then(response => {
          if (response.result === 0) {
            if (response.userBehaviors && response.userBehaviors.length) {
              response.userBehaviors.forEach(item => {
                this.pvs.push(item);
              });
            }
            this.totalPages = response.totalPages;
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
        this.pvs = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icon = item.user && item.user.icon;
        return icon || api.CONFIG.usericon;
      },
      getDetailItem(item) {
        if (item.behavior) {
          return item.behavior;
        }
        return {};
      },
      openGoodDetail(item) {
        if (item.behavior && item.behavior.pid) {
          if (item.module === 'productdetail') {
            this.$router.push({name: 'good', params: {id: item.behavior.pid}});
          } else if (item.module === 'articledetail') {
            this.$router.push({name: 'articledetail', params: {id: item.behavior.pid}});
          } else if (item.module === 'groupbuydetail') {
            this.$router.push({name: 'groupbuyDetail', params: {id: item.behavior.pid}});
          }
        }
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
      width: 460px
    .stats-container
      position: relative
      width: 100%
      display: flex
      flex-wrap: wrap
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
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
