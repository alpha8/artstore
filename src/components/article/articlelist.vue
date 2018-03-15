<template>
  <ul class="article-list">
    <li class="article-item border-1px" v-for="item in articles" @click.stop.prevent="showDetail(item)">
      <div class="item-box">
        <img :src="getPoster(item.icons)" alt="" class="poster">
      </div>
      <div class="item-info">
        <div class="title">{{item.title}}</div>
        <div class="extra">
          <span class="time">{{item.postTime | formatDate}}</span>
          <span>•</span>
          <span class="catname">{{item.categoryName}}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  import {formatDate} from '@/common/js/util';
  export default {
    props: {
      articles: {
        type: Array,
        default: []
      }
    },
    methods: {
      showDetail(article) {
        this.$router.push({name: 'articledetail', params: {id: article.id}});
      },
      getPoster(icons) {
        if (icons && icons.length) {
          return `${api.CONFIG.psCtx}${icons[0].id}?w=750&h=500&v=v2`;
        } else {
          return api.CONFIG.defaultImg;
        }
      }
    },
    filters: {
      formatDate(time) {
        return formatDate(time);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'; 
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
