<template>
  <div>
    <fixedheader title="我的拼团"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="orders" v-show="orders.length">
          <div class="rules-wrap">
            <div class="rule-title">"拼团" 简介：</div>
            <div class="rule-button" @click.stop.prevent="showRuleDetail">规则</div>
            <div class="rule-flow">
              <div class="flow-item">
                <i class="icon-tuan"></i>
                <div class="text">开团/参团</div>
              </div>
              <div class="flow-item">
                <i class="icon-dancers"></i>
                <div class="text">邀请好友</div>
              </div>
              <div class="flow-item">
                <i class="icon-express_vehicle"></i>
                <div class="text">满员发货<br>(不满自动退款)</div>
              </div>
            </div>
          </div>
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in orders" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""><i class="tag" :class="{'expired': item.teamStatus === '4'}"><span class="text" :class="{'success': item.teamStatus === '3'}">{{stateDesc(item.teamStatus)}}</span></i></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{reduceName(item.name)}}</h3>
                  <div class="sellpoint" v-if="item.sellPoint">{{item.sellPoint}}</div>
                  <div class="extra-wrap">
                    <div class="price-wrap">
                      <div class="countdowntips">{{tuanResult(item)}}</div>
                      <span class="price">{{item.teamFee | currency}}</span>
                    </div>
                    <div class="more-ops">
                      <span class="btn-buy red" v-if="item.status <= 2" @click.stop.prevent="showOrders(item)">去付款</span>
                      <span class="btn-buy disabled" v-else-if="item.status === 4">拼团失败</span>
                      <span class="btn-buy blue" v-else @click.stop.prevent="showOrders(item)">我的订单</span>
                    </div>
                  </div>
                </div>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" :isLoaded="loadEnd"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-order" v-show="!orders.length && !loading">———&nbsp;&nbsp;啊哦，还没有相关记录哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
      </div>
    </div>
    <rules ref="rules" title="拼团规则"></rules>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate} from '@/common/js/date';
  import rules from '@/components/tuan/rules';
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
          0: '正在拼团',
          1: '正在拼团',
          2: '正在拼团',
          3: '拼团成功',
          4: '未满人数'
        }
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
        api.getMyTuanList({
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
      reduceName(name) {
        return reduceGoodsName(name);
      },
      resultDesc(item) {
        if (item.teamStatus === '0' || item.teamStatus === '1') {
          return '正在拼团';
        } else if (item.teamStatus === '4') {
          return '拼团失败';
        } else if (item.teamStatus === '3') {
          return '拼团成功';
        } else {
          return '';
        }
      },
      isOwner(item) {
        let uid = this.$store.getters.getUserInfo.userId;
        return item.apUserNameId === uid;
      },
      tuanResult(item) {
        return `已拼${item.joinCount || 0}人 • ${item.limitCount}人拼`;
      },
      showDetail(item) {
        this.$router.push({name: 'sharetuan', params: {id: item.fieldId}, query: {tuanId: item.teamOrderId || '', from: 1}});
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
      showOrders(item) {
        api.getCmsOrderInfo({
          spreadId: item.id
        }).then(response => {
          if (response && response.orderNo) {
            window.location.href = 'http://' + location.host + '/weixin/order/' + response.orderNo;
          } else {
            window.location.href = 'http://' + location.host + '/weixin/order?type=1';
          }
        }).catch(response => {
          window.location.href = 'http://' + location.host + '/weixin/order?type=1';
        });
      },
      showRuleDetail() {
        this.$refs.rules.showDetail();
      }
    },
    components: {
      fixedheader, gotop, rules
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
        background-color: #fff
        .rules-wrap
          position: relative
          width: 100%
          background: #e45050
          padding-bottom: 15px
          .rule-title
            width: 100%
            font-size: 14px
            padding: 10px
            color: #eee
            box-sizing: border-box
          .rule-button
            width: 36px
            height: 30px
            line-height: 30px
            position: absolute
            top: 0
            right: 10px
            border-bottom-left-radius: 18px
            border-bottom-right-radius: 18px
            background: #e4c017
            color: #a17400
            font-size: 11px
            text-align: center
          .rule-flow
            position: relative
            display: flex
            .flow-item
              position: relative
              flex: 1
              text-align: center
              color: #eee
              &:not(:first-child)::after
                display: block
                position: absolute
                width: 50px
                height: 2px
                border-top: 1px dashed #eee
                top: 50%
                left: -25px
                margin-top: -10px
                content: ' '
              i
                display: block
                font-size: 36px
                padding: 10px 15px
              .text
                font-size: 14px
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
                    &.success
                      background: #d05148
                      color: #f1f1f1
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
                  color: #000
                  padding-top: 5px
                  font-size: 14px
                  line-height: 1.2
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 1
                  -webkit-box-orient: vertical
                  .resultFlag
                    margin-left: 5px
                    font-size: 12px
                    color: #999
                .sellpoint
                  display: block
                  font-size: 12px
                  color: #7f7f7f
                  margin-top: 2px
                  height: 17px
                  line-height: 17px
                  overflow: hidden
                  text-overflow: ellipsis
                  display: -webkit-box
                  -webkit-line-clamp: 1
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
                    font-weight: 700
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
                  flex: 1
                  text-align: right
                  margin-right: 2px
                  .btn-buy
                    position: absolute
                    bottom: 0
                    right: 0
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
                    &.green
                      background: #44b549
                      color: #fff
                    &.darkred
                      background: #d05148
                      color: #fff
                    &.blue
                      background: #00a0dc
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
        position: relative
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
</style>
