<template>
  <div>
    <fixedheader title="我的秒杀"></fixedheader>
    <div class="order">
      <div class="order-wrap">
        <div class="order-container" ref="seckList" v-if="seckills.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="order-list">
            <mu-flexbox-item basis="100%" class="order-item border-1px" v-for="(item, index) in seckills" :key="index">
              <div class="item-content">
                <div class="item-img" @click.stop.prevent="showDetail(item)"><img :src="getThumbnail(item)" alt=""></div>
                <div class="item-info">
                  <h3 class="title" @click.stop.prevent="showDetail(item)">{{item.name}}</h3>
                  <p class="line">状态：{{mapStatus[item.status]}}</p>
                  <p class="line">时间：{{item.createTime | formatDate}}</p>
                </div>
                <div class="item-ops">
                  <span class="btn" v-show="item.status === 0" @click.stop.prevent="pay(item)">去付款</span>
                  <span class="btn white" v-show="item.status === 1" @click.stop.prevent="showOrders()">我的订单</span>
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
        mapStatus: ['待付款', '已付款', '已失效']
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
        let uid = this.$store.getters.getUserInfo.userId;
        api.getSuccessSeckills({
          offset: this.pageNumber,
          limit: this.pageSize,
          userId: uid || ''
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
        this.$router.push({path: '/order', query: {type: 2}});
      },
      pay(item) {
        let good = {
          id: item.seckillId,
          name: item.name,
          price: item.killPrice,
          oldPrice: item.price,
          count: 1,
          icon: (item.icon) ? api.CONFIG.psCtx + item.icon + '?w=114&h=114' : api.CONFIG.defaultImg,
          checked: false,
          createTime: item.createTime
        };
        this.$store.dispatch('addPayGoods', [good]);
        this.$router.push({name: 'pay', query: {orderType: 3}});
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
                padding: 8px 10px 0 10px
                >.title
                  overflow: hidden
                  text-overflow: ellipsis
                  word-wrap: break-word
                  display: -webkit-box
                  -webkit-line-clamp: 2
                  -webkit-box-orient: vertical
                  line-height: 1.45
                  height: 35px
                .line
                  line-height: 15px
                  font-size: 12px
                  color: #666
              .item-ops
                position: absolute
                right: 0
                top: 50%
                margin-top: -12px
                width: 80px
                .btn
                  display: inline-block
                  float: right
                  height: 25px
                  line-height: 25px
                  padding: 0 10px
                  letter-spacing: 1px
                  background: #eb3c3c
                  color: #fff
                  &.white
                    color: #000
                    background: #fff
                    border: 1px solid rgba(7, 17, 27, 0.1)
      .no-order
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
