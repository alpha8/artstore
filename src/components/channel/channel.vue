<template>
  <div class="channel">
    <div class="chanel-item" v-for="(item, index) in items" key="index" :class="{'p50': cols===2, 'p100': cols===1}">
      <div @click.stop.prevent="goGoodDetail(item)" class="good-item">
        <div class="item-img">
          <img v-lazy="getThumbnail(item)" alt="">
        </div>
        <div class="item-info">
          <h3>{{fillName(item)}}</h3>
          <div class="sellpoint" v-if="item.sellPoint">{{item.sellPoint}}</div>
          <div class="price"><div class="num">{{item.price | currency}}</div><div class="salesCount">(已售:{{item.stock && item.stock.salesCount || 0}}件)</div></div>
          <div class="icon" @click.stop.prevent="mark(item)"><i :class="favorited(item)"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
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
        default: 3
      }
    },
    data() {
      return {
        screenWidth: window.innerWidth
      };
    },
    methods: {
      selectGood(target) {
        this.$emit('select', target);
      },
      fillName(item) {
        let name = item.name || '';
        return name.replace('[一虎一席]', '');
      },
      getThumbnail(item) {
        let pic = item.pictures;
        if (pic && pic.length) {
          if (pic[0] && pic[0].width < pic[0].height || pic[0].height / pic[0].width <= 1) {
            return api.CONFIG.psCtx + pic[0].id + '?w=750&h=500&v=v2';
          }
          return api.CONFIG.psCtx + pic[0].id + '?w=750&h=500';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      goGoodDetail(item) {
        this.$router.push({name: 'good', params: {id: item.id}});
      },
      favorited(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        let ids = good.collected || [];
        let flag = false;
        for (let i = 0, len = ids.length; i < len; i++) {
          if (uid === ids[i]) {
            flag = true;
          }
        }
        if (typeof good.marked === 'undefined') {
          Vue.set(good, 'marked', false);
        }
        if (flag) {
          good.marked = true;
          return 'icon-favorite';
        } else {
          good.marked = false;
          return 'icon-heart';
        }
      },
      mark(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        let params = {
          userId: uid,
          type: 1,
          artworkId: good.id,
          price: good.price,
          name: good.name,
          icons: good.pictures,
          fromCart: false
        };
        if (good.marked) {
          delete params.name;
          delete params.icons;
          delete params.price;
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              good.collected = [];
              good.marked = false;
              this.favorited(good);
            }
          });
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (good.collected) {
              good.collected.push(uid);
            } else {
              good.collected = [uid];
            }
            good.marked = true;
            this.favorited(good);
          }
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .channel
    display: flex
    flex-wrap: wrap
    margin-left: 5px
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
        padding-right: 40px
        padding-left: 3px
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
            font-size: $fontsize-small-s
            margin-left: 6px
            float: left
            margin-top: 1.5px
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
