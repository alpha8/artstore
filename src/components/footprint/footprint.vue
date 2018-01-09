<template>
  <div>
    <fixedheader title="我的足迹"></fixedheader>
    <div class="footprint">
      <div class="footprint-wrap">
        <div class="footprint-container" ref="footprintlist" v-show="footprints.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="footprint-list">
            <mu-flexbox-item basis="100%" class="footprint-item border-1px" v-for="(footprint, index) in footprints" :key="index">
              <div class="item-img" @click.stop.prevent="showProductDetail(footprint)"><img :src="getThumbnail(footprint)" alt=""></div>
              <div class="item-info" @click.stop.prevent="showProductDetail(footprint)">
                <h3 class="title">{{footprint.name}}</h3>
                <div class="extra-wrap">
                  <div class="state-wrap">
                      <p class="line price">{{footprint.price | currency}}</p>
                    </div>
                  <div class="item-ops">
                    <span class="btn" @click.stop.prevent="removeItem(footprint)">移除</span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-footprint" v-show="footprints.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
    <div class="footer" v-show="footprints.length">
      <div class="btns"><span class="btn-red" @click.stop.prevent="clearAll()">清空所有足迹</span></div>
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
        footprints: [],
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
      this.scroller = this.$refs.footprintlist;
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
        api.getFootprint({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          userId: user.userId || -1
        }).then(response => {
          if (response.result === 0) {
            if (response.histories && response.histories.length) {
              response.histories.forEach(item => {
                this.footprints.push(item);
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
        this.footprints = [];
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
        this.$router.push({name: 'good', params: {id: product.pid}});
      },
      removeItem(footprint) {
        api.removeFootprint(footprint.id).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '此记录已删除！');
            let items = this.footprints;
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === footprint.id) {
                items.splice(i, 1);
              }
            }
            this.footprints = items;
          }
        });
      },
      clearAll() {
        let user = this.$store.getters.getUserInfo;
        api.clearFootprint(user.userId).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '用户所有足迹已清空！');
            this.footprints = [];
          }
        });
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
  .footer
    position: fixed
    bottom: 0
    width: 100%
    height: 50px
    overflow: hidden
    z-index: 2
    .btns
      margin: 0 auto
      height: 50px
      line-height: 50px
  .footprint
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    .footprint-wrap
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
      .footprint-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .footprint-list
          position: relative
          width: 100%
          .footprint-item
            display: flex
            padding: 8px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              display: inline-block
              width: 35%
              float: left
              img
                width: 95%
                margin-right: 10px
                overflow: hidden
            .item-info
              position: relative
              flex: 1
              box-sizing: border-box
              overflow: hidden
              >.title
                position: relative
                font-size: 14px
                padding-top: 5px
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
                      font-weight: 700
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
                  color: #fff
                  border-radius: 2px
                  &.white
                    color: #000
                    background: #fff
                    border: 1px solid rgba(7, 17, 27, 0.1)
      .no-footprint
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
