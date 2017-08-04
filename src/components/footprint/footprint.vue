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
                <div class="price">{{footprint.price | currency}}</div>
              </div>
              <div class="item-ops">
                <span class="btn" @click.stop.prevent="removeItem(footprint)">移除</span>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-footprint" v-show="footprints.length === 0">啊哦，还没有相关记录哦</div>
        <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
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
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
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
          return api.CONFIG.psCtx + icons[0].id + '?w=228&h=228';
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
    height: 40px
    overflow: hidden
    z-index: 2
    .btns
      margin: 0 auto
  .footprint
    position: absolute
    top: 44px
    bottom: 40px
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
            margin-bottom: 15px
            padding: 0 8px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              flex: 15vw 0 0
              img
                width: 70px
                height: 70px
                overflow: hidden
            .item-info
              flex: 1
              padding: 20px 50px 0 10px
              >.title
                overflow: hidden
                text-overflow: ellipsis
                word-wrap: break-word
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
                line-height: 1.45
              div
                padding-top: 10px
              .price
                color: #e4393c
                font-weight: 700
            .item-ops
              position: absolute
              right: 0
              top: 0
              width: 50px
              bottom: 0
              .btn
                display: inline-block
                height: 25px
                line-height: 25px
                padding: 0 10px
                border: 1px solid rgba(7, 17, 27,0.1)
                margin-top: 20px
                letter-spacing: 1px
      .no-footprint
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
