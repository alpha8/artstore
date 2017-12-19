<template>
  <div>
    <fixedheader title="商品拍卖"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="auctionList" v-if="auctions.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in auctions" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{item.name}}</h3>
                  <div class="price-wrap" @click.stop.prevent="showDetail(item)">
                    <span>{{stateDesc(item.auction_product_state_id)}}</span>
                  </div>
                  <div class="more-ops">
                    <span class="pricing" v-if="item.auction_product_state_id === 1"><i>{{item.countAppr}}</i>次出价</span>
                    <span class="btn-buy green" v-else-if="item.auction_product_state_id === 0" @click.stop.prevent="killNotify(item)">拍卖提醒</span>
                    <span class="btn-buy disabled" v-else>已结束</span>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">————&nbsp;&nbsp;没有更多了&nbsp;&nbsp;————</div>
        </div>
        <div class="no-order" v-if="!auctions.length">啊哦，还没有相关记录哦</div>
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
      this.show();
    },
    deactivated() {
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
          return api.CONFIG.psCtx + icon + '?w=750&h=500';
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
                  height: 25px
                  font-family: arial
                  span
                    color: #f15353
                    font-size: 12px
                    font-weight: 700
                .more-ops
                  position: absolute
                  right: 10px
                  bottom: 10px
                  .btn-buy
                    position: absolute
                    right: 0
                    bottom: 15px
                    width: 80px
                    height: 30px
                    line-height: 30px
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
                    &.green
                      background: #44b549
                      color: #fff
                  .pricing
                    position: absolute
                    right: 0
                    bottom: 15px
                    width: 80px
                    height: 25px
                    line-height: 25px
                    text-align: right
                    font-size: 12px
                    color: #a9a9a9
                    i
                      color: #f15353                      
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
