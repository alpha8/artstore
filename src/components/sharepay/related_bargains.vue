<template>
  <div class="relates_bargain">
    <div class="title" :class="{'no-more': !hasMore}">
      <div class="line left"></div>
      <div class="text">{{title}}</div>
      <div class="line right"></div>
      <div class="more" v-show="hasMore" @click.stop.prevent="fetchMore">{{moreText}}</div>
    </div>
    <div class="channel">
      <div class="chanel-item" v-for="(item, index) in getCurrentItems()" :key="index" :class="{'p50': cols===2, 'p100': cols===1}">
        <div @click.stop.prevent="goDetail(item)" class="good-item">
          <div class="item-img">
            <img v-lazy="getThumbnail(item)" alt="">
          </div>
          <div class="item-info">
            <h3>{{fillName(item)}}</h3>
            <div class="sellpoint" v-if="item.sellPoint">{{item.sellPoint}}</div>
            <div class="price"><div class="num">{{item.buttomFee | currency}}</div><div class="salesCount" v-if="item.fieldPrice">{{item.fieldPrice | currency}}</div><em class="bargain-person">{{bargainPerson(item)}}</em></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import {reduceGoodsName, reportTrackEvent} from '@/common/js/util';
  import api from '@/api/api';
  export default {
    props: {
      items: {
        type: Array,
        default() {
          return [];
        }
      },
      cols: {
        type: Number,
        default: 2
      },
      title: {
        type: String,
        default: '推荐砍价商品'
      },
      moreText: {
        type: String,
        default: '换一批'
      },
      module: {
        type: String,
        default: 'bargain'
      },
      section: {
        type: String,
        default: 'related'
      },
      pageSize: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        eventQueue: [],
        pageNumber: 1
      };
    },
    deactivated() {
      this.eventQueue = [];
      this.pageNumber = 1;
    },
    computed: {
      hasMore() {
        return this.items.length > this.pageSize;
      }
    },
    methods: {
      selectGood(target) {
        this.$emit('select', target);
      },
      trackEvent() {
        if (!this.section) {
          return;
        }
        let found = this.eventQueue.find(item => item === this.section);
        if (!found) {
          this.eventQueue.push(this.section);
          reportTrackEvent('pageview_' + this.module, {'section': this.section});
        }
      },
      fillName(item) {
        let name = item.name || '';
        return reduceGoodsName(name);
      },
      bargainPerson(item) {
        let persons = Math.floor((item.fieldPrice - item.buttomFee) / item.forwardFee);
        if (persons > 1) {
          return `1-${persons}人`;
        }
        return '1人';
      },
      getThumbnail(item) {
        let pic = item.icon;
        if (pic) {
          return api.CONFIG.psCtx + pic + '?w=750&h=500';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      goDetail(item) {
        this.$router.push({name: 'sharedetail', params: {id: item.fieldId}});
      },
      fetchMore() {
        this.pageNumber++;
        if (this.pageNumber > Math.ceil(this.items.length / this.pageSize)) {
          this.pageNumber = 1;
        }
      },
      getCurrentItems() {
        let items = this.items || [];
        if (items.length <= this.pageSize) {
          return items;
        } else {
          let pages = Math.ceil(items.length / this.pageSize);
          let offset = (this.pageNumber - 1) * this.pageSize;
          let end = this.pageNumber * this.pageSize;
          return items.slice(offset, end);
        }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .title
    position: relative
    display: flex
    width: 100%
    padding: 14px 18px 12px 14px
    box-sizing: border-box
    background-color: #fff
    &:after
      position: absolute
      display: block
      width: 8px
      height: 8px
      content: ""
      border-top: 1px solid #666
      border-left: 1px solid #666
      -webkit-transform-origin: 50%
      transform-origin: 50%
      -webkit-transform: rotate(135deg)
      transform: rotate(135deg)
      top: 50%
      right: 13px
      margin-top: -4px
    &.no-more:after
      display: none
    .line
      flex: 1
      position: relative
      top: -8px
      border-bottom: 1px solid #fafafa
      &.left
        margin-left: 32px
      &.right
        margin-right: 32px
    .text
      padding: 0 8px
      height: 16px
      line-height: 16px
      font-size: 14px
      font-weight: 700
      letter-spacing: 1px
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 1
      -webkit-box-orient: vertical
      &.nopadding
        padding: 0
        padding-left: 5px
        border-left: 3px solid #ccc
    .more
      position: absolute
      display: block
      height: 16px
      line-height: 16px
      top: 50%
      right: 21px
      margin-top: -8px
      font-size: 14px
      color: #666
  .channel
    display: flex
    flex-wrap: wrap
    margin-left: 5px
    background-color: #fff
    .chanel-item
      position: relative
      width: 33.3%
      height: auto
      vertical-align: top
      box-sizing: border-box
      padding-bottom: 10px
      .item-img
        position: relative
        width: 100%
        min-height: 102px
        overflow: hidden
        img
          width: 31.5vw
          height: auto
      &.p50
        width: 50%
        .item-img img
          width: 48vw
          height: auto
      &.p100
        width: 100%
        .item-img img
          width: 100%
          height: auto
      .item-info
        position: relative
        width: 100%
        padding-left: 3px
        min-height: 50px
        box-sizing: border-box
        h3
          line-height: 1.5
          height: 20px
          font-size: $fontsize-medium
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
          word-wrap: break-word
          word-break: break-all
        .sellpoint
          display: block
          font-size: $fontsize-small
          color: $color-grey
          padding: 2px 0 3px
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
        .price
          position: relative
          color: $color-red
          font-size: $fontsize-medium
          font-weight: 700
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: bottom
          .num
            display: block
            float: left
            bottom: 0
          .salesCount
            display: block
            color: $color-gray
            margin-left: 6px
            font-size: 11px
            float: left
            margin-top: 3px
            text-decoration: line-through
          .bargain-person
            display: block
            float: left
            font-size: 12px
            margin-left: 5px
            padding: 0 5px
            height: 15px
            line-height: 15px
            background: #e1e1e1
            color: #666
            border-radius: 7px
        .icon
          position: absolute
          top: 50%
          margin-top: -20px
          right: 0
          width: 40px
          height: 40px
          line-height: 40px
          text-align: center
          font-size: $fontsize-icon
          box-sizing: border-box
          .icon-favorite
            color: $color-orange
</style>
