<template>
  <div>
    <fixedheader title="商品评论"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <!-- <div class="tab border-1px">
          <div class="tab-item" :class="{'active': item.val === activeItem}" v-for="item in tabItems" @click.stop.prevent="changeTab(item)">{{item.text}}</div>
        </div> -->

        <div class="rating-wrapper" ref="commentslist">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="rating-list" v-if="comments.length">
            <mu-flexbox-item basis="100%" class="rating-item" v-for="(rating, index) in comments" :key="index">
              <div class="user">
                <img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10" width="20" height="20" alt="" class="avatar">
                <span class="name">{{rating.from.userName | mix}}</span>
              </div>
              <div class="time">{{rating.createdAt | formatDate}}</div>
              <p class="text">
                <star size="24" :score="rating.score"></star>{{rating.content}}
              </p>
              <ul class="piclist" v-if="rating.pictures && rating.pictures.length">
                <li v-for="pic in rating.pictures" :class="getPicCls(rating)">
                  <img :src="getPicture(pic.pid) + '?h=90'" :data-img="getPicture(pic.pid)" height="90" v-if="rating.pictures.length === 1 || rating.pictures.length === 2 || rating.pictures.length === 4" @click.stop.prevent="previewImg(rating.pictures, pic)" />
                  <img :src="getThumbnail(pic.pid)" :data-img="getPicture(pic.pid)" width="90" height="90" v-else-if="rating.pictures.length === 3 || rating.pictures.length >= 5" @click.stop.prevent="previewImg(rating.pictures, pic)" />
                </li>
              </ul>
              <ul v-if="rating.replys && rating.replys.length" class="reply-item">
                <li class="rating-item" v-for="reply in rating.replys">
                  <div class="user">
                    <img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a11" width="20" height="20" alt="" class="avatar">
                    <span class="name">{{reply.from.userName | mix}}</span>
                  </div>
                  <div class="time">{{reply.createdAt | formatDate}}</div>
                  <p class="text">
                    {{reply.content}}
                  </p>
                </li>
              </ul>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
          <div class="no-order" v-show="comments.length === 0">啊哦，还没有相关记录哦</div>
        </div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';
  import {mixUsername, formatDate} from '@/common/js/util';
  // import {formatDate} from '@/common/js/date';
  import star from '@/components/star/star';
  import wx from 'weixin-js-sdk';

  export default {
    data() {
      return {
        tabItems: [
          { text: '全部', val: -1 },
          { text: '好评', val: 0 },
          { text: '中评', val: 1 },
          { text: '差评', val: 2 }
        ],
        comments: [],
        activeItem: -1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
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
      this.scroller = this.$refs.commentslist;
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
        let id = this.$route.params.id;
        api.getProductComments({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          productId: id || ''
        }).then(response => {
          if (response.code === 0) {
            if (response.comments && response.comments.length) {
              response.comments.forEach(item => {
                this.comments.push(item);
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
        this.comments = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      getThumbnail(id) {
        if (id) {
          return api.CONFIG.psCtx + id + '?w=90&h=90';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getPicture(id) {
        if (id) {
          return api.CONFIG.psCtx + id;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getPicCls(rating) {
        let plen = rating.pictures.length;
        if (plen === 1 || plen === 2 || plen === 4) {
          return 'p50';
        } else {
          return 'p30';
        }
      },
      previewImg(pics, pic) {
        let imgs = [];
        for (let i = 0; i < pics.length; i++) {
          imgs.push(this.getPicture(pics[i].pid));
        }
        wx.previewImage({
          current: this.getPicture(pic.pid),
          urls: imgs
        });
      },
      changeTab(item) {
        this.activeItem = item.val;
        this._reset();
        this.fetchData(true);
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
      fixedheader, gotop, star
    },
    filters: {
      formatDate(time) {
        return formatDate(time);
      },
      mix(name) {
        return mixUsername(name);
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
  .order
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .order-wrap
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
      .rating-wrapper
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        padding: 0 10px
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .rating-list
          position: relative
          width: 100%
          .rating-item
            position: relative
            padding: 16px 0
            clear: both
            .reply-item
              margin-left: 20px
            .user
              position: absolute
              left: 0
              top: 20px
              font-size: 0
              height: 25px
              line-height: 25px
              .name
                display: inline-block
                margin-left: 3px
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
                line-height: 20px
              .avatar
                border-radius: 50%
            .time
              line-height: 30px
              font-size: 10px
              color: rgb(147, 153, 159)
              text-align: right
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
            .piclist
              position: relative
              width: 100%
              min-height: 95px
              padding: 5px 0
              clear: both
              li
                display: block
                float: left
                width: 100%
                height: 90px
                margin-right: 3px
                margin-bottom: 5px
                &.p50
                  width: 45%
                &.p30
                  width: 30%
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
      .no-order
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
