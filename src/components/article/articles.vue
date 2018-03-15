<template>
  <div>
    <fixedheader title="博览集萃" right-icon="icon-more"></fixedheader>
    <div class="article-wrap" ref="articleList" v-show="articles.length">
      <ul class="article-list">
        <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="article-list">
          <mu-flexbox-item basis="100%" class="article-item border-1px" v-for="(item, index) in articles" :key="index">
            <div class="item-box" @click.stop.prevent="showDetail(item)"><img :src="getPoster(item.icons)" alt="" class="poster"></div>
            <div class="item-info" @click.stop.prevent="showDetail(item)">
              <div class="title">{{item.title}}</div>
              <div class="extra">
                <span class="time">{{item.postTime | formatDate}}</span>
                <span>•</span>
                <span class="catname">{{item.categoryName}}</span>
              </div>
            </div>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
      </ul>
      <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
    </div>
    <div class="no-order" v-if="!articles.length && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import articlelist from '@/components/article/articlelist';
  import {formatDate} from '@/common/js/util';
  export default {
    data() {
      return {
        articles: [],
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
      this.scroller = this.$refs.articleList;
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
        api.getArticles({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          type: 1,
          status: 1,
          categoryId: this.$route.query.cid || ''
        }).then(response => {
          if (response.result === 0) {
            let list = response.articles;
            if (list && list.length) {
              list.forEach(item => {
                this.articles.push(item);
              });
            }
            this.totalPages = response.totalPages;
          }
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
      showDetail(article) {
        this.$router.push({name: 'articledetail', params: {id: article.id}});
      },
      getPoster(icons) {
        if (icons && icons.length) {
          return `${api.CONFIG.psCtx}${icons[0].id}?w=750&h=500&v=v2`;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      _reset() {
        this.articles = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
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
    filters: {
      formatDate(time) {
        if (time) {
          return formatDate(time);
        }
        return '';
      }
    },
    components: {
      articlelist, fixedheader, gotop
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .no-more
    width: 100%
    padding: 10px 0
    color: #ccc
    text-align: center
    font-size: 12px
    margin-bottom: 10px
  .no-order
    width: 100%
    padding: 40px 0
    text-align: center
    font-size: 14px
    color: #ccc
  .article-wrap
    position: relative
    width: 100%
    display: flex
    flex-wrap: wrap
    overflow: auto
    box-sizing: border-box
    -webkit-overflow-scrolling: touch
  .article-list
    position: relative
    display: block
    .article-item
      display: flex
      width: 100%
      padding: 10px 8px
      border-1px(rgba(7, 17, 27, 0.1))
      box-sizing: border-box
      .item-box
        position: relative
        float: left
        width: 35%
        overflow: hidden
        .poster
          width: 95%
          height: auto
          min-height: 80px
      .item-info
        position: relative
        flex: 1
        .title
          position: relative
          padding-top: 3px
          font-size: 14px
          height: 48px
          line-height: 16px
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
        .extra
          position: absolute
          width: 100%
          height: 26px
          line-height: 26px
          bottom: 0
          color: #999
          font-size: 0
          span
            display: inline-block
            vertical-align: middle
            font-size: 12px
            padding-right: 3px
            &:last-child
              padding-right: 0
            &.fixright
              position: absolute
              right: 10px
              bottom: 0
</style>
