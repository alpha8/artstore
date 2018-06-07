<template>
  <div>
    <fixedheader title="商品拍卖"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="auctionList" v-show="auctions.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in auctions" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{reduceName(item.name)}}</h3>
                  <div class="extra-wrap">
                    <div class="price-wrap">
                      <div class="countdowntips" v-if="item.leftStartTimes" v-html="countdownTips(item.countdownStats, true)"></div>
                      <div class="countdowntips" v-else-if="item.leftEndTimes" v-html="countdownTips(item.countdownStats)"></div>
                      <div class="countdowntips" v-else>&nbsp;</div>
                      <div class="price">
                        <span>&nbsp;</span>
                      </div>
                    </div>
                    <div class="more-ops">
                      <span class="btn-buy disabled" v-if="item.leftEndTimes <= 0 || item.auction_product_state_id === 3 || item.auction_product_state_id === 4" @click.stop.prevent="showDetail(item)">{{stateDesc(item.auction_product_state_id)}}</span>
                      <span class="btn-buy darkred" v-else @click.stop.prevent="showDetail(item)">{{stateDesc(item.auction_product_state_id)}}</span>
                      <span class="btn-buy blue" v-if="item.auction_product_state_id === 0" @click.stop.prevent="killNotify(item)">拍卖提醒</span>
                      <span class="items-reserve">
                        <span class="pricing" v-if="item.auction_product_state_id === 3 || item.auction_product_state_id === 4">{{item.countAppr}}次出价</span>
                        <span class="pricing" v-else-if="item.auction_product_state_id !== 0"><i>{{item.countAppr}}</i>次出价</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-order" v-if="!auctions.length && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate, countdown} from '@/common/js/date';
  import {reduceGoodsName} from '@/common/js/util';
  import api from '@/api/api';

  export default {
    data() {
      return {
        auctions: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        timer: null,
        states: {
          0: '预展',
          1: '拍卖中',
          2: '拍卖暂停',
          3: '拍卖结束',
          4: '流拍'
        }
      };
    },
    activated() {
      this.fetchData(true);
      this.timerLoop();
      this.show();
    },
    deactivated() {
      this.stopTimer();
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.auctionList;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        api.getAuctions({
          paging: this.pageNumber,
          pageSize: this.pageSize,
          state: 1
        }).then(response => {
          if (response.result === 0) {
            if (response.info.apList && response.info.apList.length) {
              response.info.apList.forEach(item => {
                this.auctions.push(item);
              });
              this.totalPages = response.info.total <= this.pageSize ? 1 : Math.ceil(response.info.total / this.pageSize);
            }
          }
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
      _reset() {
        this.auctions = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=750&h=500&v=v2';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      showDetail(item) {
        this.$router.push({name: 'auctiondetail', params: {id: item.id}});
      },
      stateDesc(state) {
        return this.states[state];
      },
      killNotify(item) {
        let openid = this.$store.getters.getUserInfo.openid;
        api.reservedNotify({
          pid: item.id,
          pname: item.name,
          type: 1,
          openid: openid,
          strDate: formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm')
        }).then(response => {
          this.$store.dispatch('openToast', '设置成功, 请留意微信通知！');
        }).catch(response => {
          this.$store.dispatch('openToast', '网络太忙了，请稍候再来吧！');
        });
      },
      timerLoop() {
        for (let i = 0; i < this.auctions.length; i++) {
          let auction = this.auctions[i];
          if (auction.leftStartTimes) {
            auction.leftStartTimes--;
          }
          if (auction.leftEndTimes) {
            auction.leftEndTimes--;
          }
          if (auction.leftStartTimes) {
            auction.countdownStats = countdown(auction.leftStartTimes);
          } else {
            auction.countdownStats = countdown(auction.leftEndTimes);
          }
        }
        this.timer = setTimeout(this.timerLoop, 1000);
      },
      stopTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      countdownTips(stats, start) {
        if (!stats) {
          return '&nbsp;';
        }
        let count = 0;
        let maxcount = 2;
        let text = '';
        if (stats.days) {
          text += stats.days + '天';
          count++;
        }
        if (count < maxcount && stats.hours && stats.hours !== '00') {
          text += stats.hours + '小时';
          count++;
        }
        if (count < maxcount && stats.mins) {
          text += stats.mins + '分';
          count++;
        }
        if (count < maxcount && stats.seconds) {
          text += stats.seconds + '秒';
          count++;
        }
        if (text) {
          return start ? `距开抢：${text}` : `距结束：${text}`;
        }
        return '&nbsp;';
      },
      reduceName(name) {
        return reduceGoodsName(name);
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
  .order
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .order-wrap
      position: relative
      width: 100%
      .btn-red
        background: #d05148
        color: #fff
      .btn-blue
        background: #00a0dc
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
      .order-container
        position: relative
        width: 100%
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .order-list
          position: relative
          width: 100%
          .order-item
            padding: 0 8px
            border-1px(rgba(7, 17, 27, 0.1))
            .item-content
              position: relative
              display: flex
              padding: 8px 0
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
                flex: 1
                position: relative
                color: #333
                font-size: 14px
                >.title
                  position: relative
                  padding-top: 5px
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                .extra-wrap
                  position: absolute
                  display: flex
                  width: 100%
                  bottom: 2px
                .price-wrap
                  position: relative
                  display: block
                  float: left
                  width: auto
                  line-height: 1.3
                  .countdowntips
                    margin-top: 5px
                    font-size: 12px
                    color: #999
                  span
                    display: inline-block
                    padding-top: 3px
                    color: #e4393c
                    font-size: 14px
                    font-weight: 700
                  del
                    display: inline-block
                    color: #999
                    font-size: 12px
                .more-ops
                  position: relative
                  display: block
                  flex: 1
                  text-align: right
                  .btn-buy
                    position: relative
                    display: inline-block
                    padding: 0 6px
                    height: 25px
                    line-height: 25px
                    text-align: center
                    font-size: 11px
                    background: #e4393c
                    color: #fff
                    border-radius: 2px
                    min-width: 56px
                    box-sizing: border-box
                    &.disabled
                      background: #999
                    &.orange
                      background: rgba(250,180,90,0.93)
                      color: #fff
                    &.blue
                      background: #00a0dc
                      color: #fff
                    &.green
                      background: #44b549
                      color: #fff
                    &.darkred
                      background: #d05148
                      color: #fff
                  .items-reserve
                    display: block
                    position: relative
                    padding-top: 3px
                    text-align: right
                    font-size: 12px
                    color: #999
                    strong
                      font-weight: 400
                      font-size: 11px
                    .progress-bar
                      position: relative
                      display: inline-block
                      margin-top: -2px
                      margin-left: 1px
                      width: 56px
                      height: 6px
                      vertical-align: middle
                      background-size: 2px 2px
                      border-radius: 12px
                      overflow: hidden
                      &::after
                        position: absolute
                        content: ''
                        z-index: 1
                        background-color: #b9b8b8
                        background: none
                        border: 1px solid #999
                        top: 0
                        left: 0
                        right: -100%
                        bottom: -100%
                        border-radius: 12px
                        border-color: #999
                        -webkit-transform: scale(.5)
                        -webkit-transform-origin: 0 0
                        pointer-events: none
                      em
                        display: block
                        height: 6px
                        background-color: #b9b8b8
                  .pricing
                    position: relative
                    display: inline-block
                    width: auto
                    text-align: right
                    font-size: 11px
                    color: #a9a9a9
                    i
                      color: #f15353
      .no-order
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
