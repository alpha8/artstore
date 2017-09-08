<template>
  <div>
    <fixedheader title="商品秒杀"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="seckList" v-if="seckills.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in seckills" :key="index" v-if="item.number > 0">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{item.name}}</h3>
                  <div class="price-wrap">
                    <span>{{item.killPrice | currency}}</span>
                    <del>{{item.price | currency}}</del>
                  </div>
                  <div class="more-ops">
                    <span class="btn-buy" v-show="item.leftStartTimes <= 0 && item.leftEndTimes > 0" @click.stop.prevent="showDetail(item)">立即抢购</span>
                    <span class="btn-buy orange" v-show="item.leftStartTimes > 0" @click.stop.prevent="killNotify(item)">秒杀提醒</span>
                    <span class="btn-buy disabled" v-show="item.leftEndTimes <= 0">已结束</span>
                    <span class="items-reserve">
                      <strong>已售{{calcLeftPercent(item)}}%</strong>
                      <span class="progress-bar"><em :style="transDeltaPercent(item)"></em></span>
                    </span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-order" v-if="!seckills.length">啊哦，还没有相关记录哦</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
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
        seckills: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        timer: null
      };
    },
    activated() {
      this.timerLoop();
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this.stopTimer();
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.seckList;
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
        api.getSeckills({
          pageIndex: this.pageNumber,
          pageSize: this.pageSize,
          endLongTime: +new Date()
        }).then(response => {
          if (response.list && response.list.length) {
            response.list.forEach(item => {
              this.seckills.push(item);
            });
          }
          this.totalPages = response.pages;
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
      timerLoop() {
        for (let i = 0; i < this.seckills.length; i++) {
          let seckill = this.seckills[i];
          if (seckill.leftStartTimes) {
            seckill.leftStartTimes--;
          }
          if (seckill.leftEndTimes) {
            seckill.leftEndTimes--;
          }
        }
        this.timer = setTimeout(this.timerLoop, 1000);
      },
      stopTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      calcLeftPercent(item) {
        return Math.round((1 - item.number / item.stock) * 100);
      },
      transDeltaPercent(item) {
        let delta = Math.round((1 - item.number / item.stock) * 100);
        return `width: ${delta}%`;
      },
      _reset() {
        this.seckills = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      getThumbnail(item) {
        let icon = item.icon;
        if (icon) {
          return api.CONFIG.psCtx + icon + '?w=228&h=228';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      showDetail(item) {
        this.$router.push({name: 'seckillDetail', params: {id: item.seckillId}});
      },
      killNotify(item) {
        let openid = this.$store.getters.getUserInfo.openid;
        api.reservedNotify({
          pid: item.seckillId,
          pname: item.name,
          type: 0,
          openid: openid,
          strDate: formatDate(new Date(item.startTime), 'yyyy-MM-dd hh:mm')
        }).then(response => {
          this.$store.dispatch('openToast', '设置成功, 请留意微信通知！');
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
                flex: 30vw 0 0
                img
                  width: 30vw
                  height: 22.5vw
                  margin-right: 10px
                  overflow: hidden
              .item-info
                flex: 1
                position: relative
                font-size: 14px
                color: #333
                margin-top: 2px
                >.title
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                .price-wrap
                  position: absolute
                  left: 0
                  bottom: 15px
                  margin: 8px 0
                  line-height: 16px
                  height: 16px
                  font-family: arial
                  span
                    color: #e4393c
                    font-size: 18px
                  del
                    display: block
                    color: #999
                    font-size: 12px
                .more-ops
                  position: absolute
                  right: 10px
                  bottom: 10px
                  .btn-buy
                    position: absolute
                    right: 0
                    bottom: 15px
                    width: 80px
                    height: 25px
                    line-height: 25px
                    text-align: center
                    font-size: 14px
                    background: #e4393c
                    color: #fff
                    border-radius: 2px
                    &.disabled
                      background: #999
                    &.orange
                      background: rgba(250,180,90,0.93)
                      color: #fff
                  .items-reserve
                    display: block
                    position: absolute
                    right: 0
                    bottom: 0
                    width: 150px
                    text-align: right
                    margin-left: 5px
                    font-size: 12px
                    color: #999
                    .progress-bar
                      position: relative
                      display: inline-block
                      margin-top: -2px
                      margin-left: 5px
                      width: 80px
                      height: 6px
                      vertical-align: middle
                      backgrouns-size: 2px 2px
                      border-radius: 12px
                      overflow: hidden
                      &::after
                        position: absolute
                        content: ''
                        z-index: 1
                        background-color: #ec7476
                        background: none
                        border: 1px solid #ddd
                        top: 0
                        left: 0
                        right: -100%
                        bottom: -100%
                        border-radius: 12px
                        border-color: #ec7476
                        -webkit-transform: scale(.5)
                        -webkit-transform-origin: 0 0
                        pointer-events: none
                      em
                        display: block
                        height: 6px
                        background-color: #ec7376
      .no-order
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
