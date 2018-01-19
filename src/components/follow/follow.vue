<template>
  <div>
    <fixedheader title="我的收藏"></fixedheader>
    <div class="follow">
      <div class="follow-wrap">
        <div class="follow-container" ref="followlist" v-show="follows.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="follow-list">
            <mu-flexbox-item basis="100%" class="follow-item border-1px" v-for="(follow, index) in follows" :key="index">
              <div class="item-img" @click.stop.prevent="showProductDetail(follow)"><img :src="getThumbnail(follow)" alt=""></div>
              <div class="item-info" @click.stop.prevent="showProductDetail(follow)">
                <h3 class="title">{{follow.name}}</h3>
                <div class="extra-wrap">
                  <div class="state-wrap">
                    <p class="line price">{{follow.price | currency}}</p>
                  </div>
                  <div class="item-ops">
                    <span class="btn" @click.stop.prevent="removeItem(follow)">移除</span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-follow" v-show="follows.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';

  export default {
    data() {
      return {
        follows: [],
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
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.followlist;
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
        let user = this.$store.getters.getUserInfo;
        api.getUserCollect({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          userId: user.userId || -1
        }).then(response => {
          if (response.result === 0) {
            if (response.collects && response.collects.length) {
              response.collects.forEach(item => {
                this.follows.push(item);
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
        this.follows = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icons = item.icons;
        if (icons && icons.length) {
          return api.CONFIG.psCtx + icons[0].id + '?w=750&h=500&v=v2';
        } else {
          return api.CONFIG.defaultImg;
        }
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
            let items = this.follows;
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === product.id) {
                items.splice(i, 1);
              }
            }
            this.follows = items;
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
  .follow
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .follow-wrap
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
        padding: 10px 0 18px
        color: #ccc
        text-align: center
        font-size: 12px
      .follow-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .follow-list
          position: relative
          width: 100%
          .follow-item
            position: relative
            display: flex
            margin-bottom: 5px
            padding: 8px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              display: inline-block
              float:left
              width: 35%
              img
                width: 95%
                overflow: hidden
            .item-info
              position: relative
              flex: 1
              box-sizing: border-box
              overflow: hidden
              >.title
                position: relative
                color: #666
                font-size: 14px
                padding-top: 8px
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
                line-height: 1.2
              .extra-wrap
                position: absolute
                display: flex
                width: 100%
                bottom: 10px
                .state-wrap
                  position: relative
                  display: block
                  flex: 1
                  .line
                    padding-bottom: 1px
                    line-height: 15px
                    font-size: 12px
                    color: #666
                    &:last-child
                      padding-bottom: 0
                    &.price
                      color: #d05148
                      font-size: 14px
                      font-weight: 400
                      padding-top: 7px
              .item-ops
                position: relative
                display: block
                float: right
                width: 80px
                .btn
                  display: inline-block
                  float: right
                  height: 25px
                  line-height: 25px
                  padding: 0 10px
                  background: #d05148
                  color: #e1e1e1
                  border-radius: 2px
                  font-size: 11px
                  &.white
                    color: #000
                    background: #fff
                    border: 1px solid rgba(7, 17, 27, 0.1)
      .no-follow
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
