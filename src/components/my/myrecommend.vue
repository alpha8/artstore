<template>
  <div>
    <fixedheader title="专属优惠活动，推荐好友拿奖金"></fixedheader>
    <div class="myrecommend">
      <div class="myrecommend-wrap">
        <div class="myrecommend-container" ref="myrecommendlist" v-show="myrecommends.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="myrecommend-list">
            <mu-flexbox-item basis="100%" class="myrecommend-item border-1px" v-for="(myrecommend, index) in myrecommends" :key="index">
              <div class="item-info" @click.stop.prevent="showDetail(myrecommend)">
                <h3 class="title">活动{{index + 1}}: {{myrecommend.provideTitle}}</h3>
                <div class="content">{{myrecommend.desc}}</div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-myrecommend" v-show="myrecommends.length === 0">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
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
        myrecommends: [],
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
      this.scroller = this.$refs.myrecommendlist;
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
        let userProfile = this.$store.getters.getUserProfile;
        let user = this.$store.getters.getUserInfo;
        let model = userProfile && userProfile.user && userProfile.user.model || 0;
        let params = {
          currentPage: this.pageNumber,
          pageSize: this.pageSize
        };
        // 代理商用户
        if (model === 2) {
          params.provideId = user.userId || -1;
        } else {
          params.publishId = user.userId || -1;
        }
        api.getCouponList(params).then(response => {
          if (response.result === 0) {
            if (response.qrCodes && response.qrCodes.length) {
              response.qrCodes.forEach(item => {
                this.myrecommends.push(item);
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
        this.myrecommends = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icons = item.icons;
        if (icons && icons.length) {
          return api.CONFIG.psCtx + icons[0].id + '?w=750&h=500';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      showDetail(item) {
        this.$router.push({name: 'recommend', params: {id: item.id}});
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
  .myrecommend
    position: absolute
    top: 44px
    bottom: 40px
    width: 100%
    .myrecommend-wrap
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
      .myrecommend-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .myrecommend-list
          position: relative
          width: 100%
          .myrecommend-item
            display: flex
            margin-bottom: 5px
            padding: 8px
            border-1px(rgba(7, 17, 27, 0.1))
            box-sizing: border-box
            font-size: 12px
            .item-img
              display: inline-block
              width: 20%
              float: left
              img
                width: 95%
                overflow: hidden
            .item-info
              flex: 1
              padding: 0 10px
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
                right: 10px
                margin-top: -4px
              >.title
                overflow: hidden
                text-overflow: ellipsis
                display: -webkit-box
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
                font-weight: 700
                padding: 10px 0 8px
                font-size: 14px
              .content
                font-size: 13px
      .no-myrecommend
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
