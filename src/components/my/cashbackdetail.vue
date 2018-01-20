<template>
  <div>
    <fixedheader title="奖金明细"></fixedheader>
    <div class="cashback">
      <div class="cashback-wrap">
        <div class="cashback-container" ref="cashbackRef" v-show="cashbacks.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="cashback-list">
            <mu-flexbox-item basis="100%" class="cashback-item border-1px" v-for="(item, index) in cashbacks" :key="index">
              <div class="content">
                <p class="line text">推荐{{item.userName}}成功下单，您获得了{{item.value}}元奖金</p>
                <p class="time">{{item. createAt | formatDate}}</p>
              </div>
              <div class="amount">{{statusDesc(item.status)}}</div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
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
  let Base64 = require('js-base64').Base64;

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
        let user = this.$store.getters.getUserInfo;
        api.getRewards({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          rid: user.userId || 0
        }).then(response => {
          if (response.code === 0) {
            if (response.rewards && response.rewards.length) {
              response.rewards.forEach(item => {
                if (item.userName) {
                  item.userName = Base64.decode(item.userName);
                } else {
                  item.userName = item.userId;
                }
                this.cashbacks.push(item);
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
        this.cashbacks = [];
        this.pageNumber = 1;
        this.totalPages = 0;
        this.loadEnd = false;
      },
      statusDesc(status) {
        if (status === 1) {
          return '已到账';
        } else {
          return '即将发放';
        }
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
        return formatDate(date, 'yyyy-MM-dd hh:mm');
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
        margin-bottom: 10px
      .cashback-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .cashback-list
          position: relative
          width: 100%
          padding: 10px
          box-sizing: border-box
          .cashback-item
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
