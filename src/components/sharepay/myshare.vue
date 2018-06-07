<template>
  <div>
    <fixedheader title="我的砍价"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="orders" v-if="orders.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in orders" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""><i class="tag" :class="{'expired': item.status === 5}"><span class="text">{{stateDesc(item.status)}}</span></i></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{reduceName(item.name)}}<span v-if="resultDesc(item)" class="resultFlag">({{resultDesc(item)}})</span></h3>
                  <div class="extra-wrap">
                    <div class="price-wrap">
                      <span class="price">{{item.dealFee | currency}}</span>
                      <del class="oldprice" v-if="item.originalFee !== item.dealFee">{{item.originalFee | currency}}</del>
                    </div>
                    <div class="more-ops">
                      <span class="btn-buy red" v-if="item.status === 0" @click.stop.prevent="pay(item)">去付款</span>
                      <span class="pricing" v-else-if="item.status === 5"></span>
                      <span class="btn-buy blue" v-else @click.stop.prevent="showOrders()">我的订单</span>
                      <!-- <span class="pricing"></span> -->
                    </div>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-order" v-if="!orders.length && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate} from '@/common/js/date';
  import {reduceGoodsName} from '@/common/js/util';
  import api from '@/api/api';

  export default {
    data() {
      return {
        orders: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        states: {
          0: '正在砍价',
          1: '砍价成功',
          2: '正在砍价',
          3: '正在砍价',
          4: '正在砍价',
          5: '砍价失败'
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
      this.scroller = this.$refs.orders;
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
        api.getMyShareOrder({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          userId: uid
        }).then(response => {
          if (response.list && response.list.length) {
            response.list.forEach(item => {
              this.orders.push(item);
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
      _reset() {
        this.orders = [];
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
      reduceName(name) {
        return reduceGoodsName(name);
      },
      stateDesc(state) {
        return this.states[state];
      },
      resultDesc(item) {
        if (item.status === 1) {
          return '砍价成功';
        } else if (item.status === 5) {
          return '砍价失败';
        } else {
          return '';
        }
      },
      isOwner(item) {
        let uid = this.$store.getters.getUserInfo.userId;
        return item.apUserNameId === uid;
      },
      showDetail(item) {
        this.$router.push({name: 'sharedetail', params: {id: item.fieldId}, query: {shareId: item.id || ''}});
      },
      pay(item) {
        let good = {
          id: item.fieldId,
          name: item.name,
          pictures: [(item.icon) ? api.CONFIG.psCtx + item.icon + '?w=750&h=500' : api.CONFIG.defaultImg],
          src: (item.icon) ? api.CONFIG.psCtx + item.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
          content: '',
          price: item.dealFee,
          oldPrice: item.originalFee,
          count: 1,
          icon: (item.icon) ? api.CONFIG.psCtx + item.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
          checked: false,
          preOrderId: item.id
        };
        this.$store.dispatch('addPayGoods', [good]);
        window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=9';
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
                position: relative
                display: inline-block
                width: 35%
                float: left
                img
                  width: 95%
                  margin-right: 10px
                  overflow: hidden
                .tag
                  position: absolute
                  top: 0
                  left: 0
                  width: 60px
                  height: 60px
                  overflow: hidden
                  z-index: 1
                  box-sizing: border-box
                  .text
                    position: absolute
                    top: 9px
                    left: -15px
                    width: 65px
                    display: block
                    height: 16px
                    line-height: 16px
                    font-size: 10px
                    text-align: center
                    color: #000
                    -webkit-transform: rotate(-45deg)
                    transform: rotate(-45deg)
                    background-color: #fea019
                    ::before
                      content: ""
                      display: inline-block
                      vertical-align: middle
                      width: 0
                      height: 100%
                      margin-top: 1px
                  &.expired .text
                    background-color: #747474
                    color: #fff
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
                  .price, .oldprice
                    display: inline-block
                    width: auto
                    height: 25px
                    line-height: 25px
                    color: #f01414
                    font-size: 14px
                    font-weight: 700
                  .oldprice
                    font-size: 12px
                    font-weight: 400
                    color: #666
                    padding-left: 5px
                  .state
                    display: inline-block
                    height: 25px
                    width: auto
                    line-height: 25px
                    vertical-align: middle
                    text-align: center
                    color: #fff
                    border-radius: 2px
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
                      color: #fff
                      background: #00a0dc
                      border: 1px solid #00a0dc
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
