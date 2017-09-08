<template>
  <div>
    <fixedheader title="物流查询"></fixedheader>
    <div class="expressLog" ref="expressLog">
      <div class="expressLog-wrap">
        <div class="expressLog-container" v-show="expressLogs.length">
          <div class="expressLog-list">
            <div class="expressLog-item" v-for="(expressLog, index) in expressLogs" :key="index">
              <i></i>
              <div class="msg-box">{{expressLog.status}}</div>
              <small>{{expressLog.time}}</small>
            </div>
          </div>
        </div>
        <div class="no-expressLog" v-show="expressLogs.length === 0">{{errorTips}}</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import api from '@/api/api';

  export default {
    data() {
      return {
        expressLogs: [],
        pageNumber: 1,
        pageSize: 200,
        totalPages: 0,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        errorTips: '啊哦，还没有相关记录哦'
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
      this._initScroll();
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
        let code = this.$route.params.expressCode;
        let expressNo = this.$route.params.expressNo;
        api.trackingGoods(expressNo, code).then(response => {
          if (response.status === '0') {
            this.expressLogs = response.result.list;
          } else {
            this.errorTips = response.msg;
          }
          this.totalPages = 0;
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
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.expressLog, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      _reset() {
        this.expressLogs = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
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
  .expressLog
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    overflow: hidden
    .expressLog-wrap
      position: relative
      width: 100%
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
      .expressLog-container
        position: relative
        width: 100%
        padding: 5px 15px 0 38px
        font-size: 12px
        line-height: 1.5
        box-sizing: border-box
        .expressLog-list
          position: relative
          .expressLog-item
            position: relative
            padding: 10px 0
            color: #999
            &:after
              content: "\20"
              display: block
              width: 1px
              height: 100%
              background: #999
              position: absolute
              left: -20px
              top: 20px
            &:first-child
              color: #333
              i
                border-color: #fb8a00
                &:after
                  background-color: #fb8a00
            &:last-child:after
              background: none
            i
              position: absolute
              left: -24px
              top: 13px
              display: block
              width: 8px
              height: 8px
              background: #fff
              border-radius: 8px
              border: 1px solid #999
              z-index: 1
              &:after
                position: absolute
                top: 50%
                left: 50%
                margin: -3px 0 0 -3px
                content: "\20"
                display: block
                width: 6px
                height: 6px
                background: #999
                border-radius: 6px
            .msg-box
              position: relative
            small
              font-size: 10px
              color: #999
      .no-expressLog
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
