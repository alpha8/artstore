<template>
  <div>
    <fixedheader title="我的拍卖"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="auctions" v-if="auctions.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in auctions" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{item.name}}<span class="resultFlag" v-if="item.auction_product_state_id > 2">({{resultDesc(item)}})</span></h3>
                  <div class="extra-wrap">
                    <div class="price-wrap">
                      <span class="state disabled" v-if="item.auction_product_state_id === 3 || item.auction_product_state_id === 4">{{stateDesc(item.auction_product_state_id)}}</span>
                      <span class="state" v-else>{{stateDesc(item.auction_product_state_id)}}</span>
                      <span class="state white" v-if="isOwner(item)" @click.stop.prevent="showOrders()">我的订单</span>
                    </div>
                    <div class="more-ops">
                      <!-- <span class="btn-buy blue" v-if="item.status === 0" @click.stop.prevent="pay(item)">去付款</span> -->
                      <span class="pricing" v-if="item.auction_product_state_id === 3 || item.auction_product_state_id === 4">{{item.countAppr}}次出价</span>
                      <span class="pricing" v-else><i>{{item.countAppr}}</i>次出价</span>
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
      this.scroller = this.$refs.auctions;
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
        let uid = this.$store.getters.getUserInfo.userId || -1;
        api.getAuctionsByUID({
          paging: this.pageNumber,
          pageSize: this.pageSize,
          userNameId: uid
        }).then(response => {
          if (response.info.apList && response.info.apList.length) {
            response.info.apList.forEach(item => {
              this.auctions.push(item);
            });
          }
          this.totalPages = response.info.total <= this.pageSize ? 1 : Math.ceil(response.info.total / this.pageSize);
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
      stateDesc(state) {
        return this.states[state];
      },
      resultDesc(item) {
        let uid = this.$store.getters.getUserInfo.userId;
        if (item.apUserNameId === uid) {
          return '中标';
        } else {
          return '未中标';
        }
      },
      isOwner(item) {
        let uid = this.$store.getters.getUserInfo.userId;
        return item.apUserNameId === uid;
      },
      showDetail(item) {
        this.$router.push({name: 'auctiondetail', params: {id: item.id}});
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
      },
      pay(item) {
        let good = {
          id: item.id,
          name: item.name,
          price: item.maxPrice,
          oldPrice: item.maxPrice,
          count: 1,
          icon: (item.icon) ? api.CONFIG.psCtx + item.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
          checked: false
        };
        this.$store.dispatch('addPayGoods', [good]);
        window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=5';
      },
      showOrders() {
        window.location.href = 'http://' + location.host + location.pathname + '#/order?type=0';
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
                position: relative
                flex: 1
                box-sizing: border-box
                overflow: hidden
                >.title
                  position: relative
                  padding-top: 5px
                  font-size: 14px
                  height: 32px
                  line-height: 16px
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                  .resultFlag
                    margin-left: 5px
                    font-size: 12px
                    color: #999
                .extra-wrap
                  position: absolute
                  display: flex
                  width: 100%
                  bottom: 10px
                .price-wrap
                  position: relative
                  flex: 1
                  height: 25px
                  .line
                    height: 25px
                    line-height: 25px
                    padding: 1px 0
                  .state
                    display: inline-block
                    height: 25px
                    width: auto
                    line-height: 25px
                    vertical-align: middle
                    text-align: center
                    color: #fff
                    border-radius: 4px
                    font-size: 11px
                    padding: 0 8px
                    letter-spacing: 0.5px
                    box-sizing: border-box
                    background-color: #f15353
                    &.orange
                      background: rgba(250,180,90,0.93)
                    &.disabled
                      background: #999
                    &.white
                      color: #000
                      background: #fff
                      border: 1px solid rgba(7,17,27,0.1)
                      margin-left: 2px
                .more-ops
                  position: relative
                  display: block
                  float: right
                  width: auto
                  text-align: right
                  .btn-buy
                    position: relative
                    display: inline-block
                    padding: 0 10px
                    height: 25px
                    line-height: 25px
                    text-align: center
                    font-size: 11px
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
                    &.blue
                      background: #00a0dc
                      color: #fff
                    &.darkred
                      background: #d05148
                      color: #fff
                    &.white
                      color: #000
                      background: #fff
                      border: 1px solid rgba(7,17,27,0.1)
                  .pricing
                    position: relative
                    display: inline-block
                    width: auto
                    height: 25px
                    line-height: 25px
                    text-align: right
                    font-size: 12px
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
