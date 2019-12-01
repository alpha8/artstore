<template>
  <div>
    <fixedheader title="积分明细"></fixedheader>
    <div class="cashback">
      <div class="cashback-wrap">
        <div class="cashback-container" ref="cashbackRef" v-show="cashbacks.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="cash-list">
            <mu-flexbox-item basis="100%" class="cash-item border-1px" v-for="(item, index) in cashbacks" :key="index">
              <div class="content">
                <p class="line text">{{item.operateNote}}</p>
                <p class="time">{{item.createTimes | formatDate}}</p>
              </div>
              <div class="amount" :class="{'plus': item.changeType == 0}"><span v-if="item.changeType == 0">+</span><span v-else>-</span>{{item.changeCount}}</div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-cashback" v-show="cashbacks.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有交易记录哦&nbsp;&nbsp;———</div>
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
        cashbacks: [],
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
      this.loadEnd = false;
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.cashbackRef;
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
        api.getIntegrationLog({
          currentPage: this.pageNumber,
          pageSize: this.pageSize
        }).then(response => {
          if (response.code == 200) {
            if (response.data && response.data.list) {
              response.data.list.forEach(item => {
                this.cashbacks.push(item);
              });
            }
            this.totalPages = response.data.totalPage;
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
        this.cashbacks = [];
        this.pageNumber = 1;
        this.totalPages = 0;
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
  .cashback
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .cashback-wrap
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
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .cashback-container
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
            background: #fff
            position: relative
            display: flex
            margin-bottom: 15px
            padding: 10px
            border-top: 6px solid #999
            border-bottom: 10px solid #fff
            border-radius: 6px
            box-sizing: border-box
            .content
              flex: 1
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
              &.plus
                color: #e45050
            &:last-child
              margin-bottom: 0
      .no-cashback
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
</style>
