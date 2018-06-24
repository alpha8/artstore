<template>
  <div>
    <fixedheader title="交易记录"></fixedheader>
    <div class="cash">
      <div class="cash-wrap">
        <div class="cash-container" ref="cashlist" v-show="cashs.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="cash-list">
            <mu-flexbox-item basis="100%" class="cash-item border-1px" v-for="(cash, index) in cashs" :key="index">
              <div class="content">
                <p class="line text">余额充值成功</p>
                <p class="time">{{cash.createAt | formatDate}}</p>
              </div>
              <div class="amount">{{cash.totalFee | currency}}</div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-cash" v-show="cashs.length === 0">———&nbsp;&nbsp;啊哦，还没有交易记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';

  export default {
    data() {
      return {
        cashs: [],
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
      this.scroller = this.$refs.cashlist;
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
        this.loading = true;
        let user = this.$store.getters.getUserInfo;
        api.getOrders({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          userId: user.userId || 0,
          type: 6,
          status: 3
        }).then(response => {
          if (response.code === 0) {
            if (response.orders && response.orders.length) {
              response.orders.forEach(item => {
                this.cashs.push(item);
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
        this.cashs = [];
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
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
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
  .cash
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .cash-wrap
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
      .cash-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .cash-list
          position: relative
          width: 100%
          padding: 10px
          box-sizing: border-box
          .cash-item
            position: relative
            display: flex
            margin-bottom: 15px
            border-1px(rgba(7, 17, 27, 0.1))
            .content
              flex: 1
              background: #fff
              height: 60px
              box-sizing: border-box
              overflow: hidden
              .line
                position: relative
                font-size: 14px
                line-height: 1.8
                text-overflow: ellipsis
                white-space: nowrap
                overflow: hidden
                strong
                  font-weight: 700
                &.text
                  padding-bottom: 10px
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                  font-weight: 400
                  font-size: 14px
                  line-height: 1.0625rem
              .time
                color: #666
                font-size: 12px
            .amount
              width: 80px
              height: 60px
              color: #44b549
              font-size: 14px
              font-weight: 700
              text-align: right
      .no-cash
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
