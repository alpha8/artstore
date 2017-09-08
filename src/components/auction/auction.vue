<template>
  <div class="main">
    <fixedheader title="拍卖专场" ref="header"></fixedheader>
    <div class="auction">
      <div class="auction-wrap" ref="auction">
        <modal-title title="今日拍卖"></modal-title>
        <mu-flexbox wrap="wrap" justify="space-around" class="auction-list" :gutter="0">
          <mu-flexbox-item basis="100%" class="item" :key="item.id" v-for="item in auctionList">
            <router-link :to="{name: 'auctionList', params: {id: item.id}}" class="thumbnail">
              <img :src="item.thumbnail" alt="">
              <div class="item-extra">
                <div class="item-state on">{{item.state}}</div>
                <div class="item-time">距离结束：<span class="time">{{getEndTime(item.leftTime)}}</span></div>
              </div>
            </router-link>
            <div class="item-detail">
              <div class="item-name">
                <router-link :to="{name: 'auctionList', params: {id: item.id}}">{{item.name}}</router-link>
              </div>
              <div class="item-info">
                <span class="text-red">{{item.count}}</span>件拍品<b></b>
                <span class="text-red">{{item.buyer}}</span>人出价
              </div>
            </div>
            </router-link>
          </mu-flexbox-item>
        </mu-flexbox>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
      </div>
    </div>
    <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import modalTitle from '@/components/modal-title/modal-title';
  import gotop from '@/components/fixedtoolbar/gotop';

  export default {
    data() {
      return {
        auctionList: [
          {
            id: 1,
            name: '大千木雕珍藏专场',
            state: '正在进行',
            leftTime: 36255327,
            count: 64,
            buyer: 100,
            thumbnail: 'http://img11.360buyimg.com/da/jfs/t5701/147/4821084102/193440/8ec5e8bd/5954fef2N9eddc482.jpg'
          },
          {
            id: 2,
            name: '景德镇精品大师陶瓷专场',
            state: '正在进行',
            leftTime: 36255327,
            count: 10,
            buyer: 11,
            thumbnail: 'http://img11.360buyimg.com/da/jfs/t6736/287/1781393521/85063/37a3d251/595797fcN6b7d6eb1.jpg'
          },
          {
            id: 3,
            name: '茶生厚土茗冠天下专场',
            state: '正在进行',
            leftTime: 36255327,
            count: 8,
            buyer: 80,
            thumbnail: 'http://img11.360buyimg.com/da/jfs/t6103/26/2994096983/90331/c621163a/594b19adN27574e27.jpg'
          }
        ],
        scroller: null,
        loading: false,
        scrollY: 0,
        timer: null
      };
    },
    activated() {
      this.show();
      this.timer = setInterval(() => {
        this.auctionList.forEach((auction) => {
          auction.leftTime -= 1000;
        });
      }, 1000);
    },
    deactivated() {
      this.hide();
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    mounted () {
      this.scroller = this.$refs.auction;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      getEndTime(time) {
        let hour = time / 3600000;
        let mins = 0;
        let seconds = 0;
        let delta = 0;
        if (hour > 0) {
          delta = time % 3600000;
          mins = delta / 60000;
        }
        if (mins > 0) {
          delta = delta % 60000;
          seconds = delta / 1000;
        }
        hour = Math.floor(hour);
        mins = Math.floor(mins);
        seconds = Math.floor(seconds);
        return `${hour}小时${mins}分钟${seconds}秒`;
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
      loadData() {
        this.loading = true;
        setTimeout(() => {
          let list = [
            {
              id: 1,
              name: '大千木雕珍藏专场',
              state: '正在进行',
              leftTime: 36255327,
              count: 64,
              buyer: 100,
              thumbnail: 'http://img11.360buyimg.com/da/jfs/t5701/147/4821084102/193440/8ec5e8bd/5954fef2N9eddc482.jpg'
            },
            {
              id: 2,
              name: '景德镇精品大师陶瓷专场',
              state: '正在进行',
              leftTime: 36255327,
              count: 10,
              buyer: 11,
              thumbnail: 'http://img11.360buyimg.com/da/jfs/t6736/287/1781393521/85063/37a3d251/595797fcN6b7d6eb1.jpg'
            },
            {
              id: 3,
              name: '茶生厚土茗冠天下专场',
              state: '正在进行',
              leftTime: 36255327,
              count: 8,
              buyer: 80,
              thumbnail: 'http://img11.360buyimg.com/da/jfs/t6103/26/2994096983/90331/c621163a/594b19adN27574e27.jpg'
            }
          ];
          list.forEach((item) => {
            this.auctionList.push(item);
          });
          this.loading = false;
        }, 1200);
      },
      loadMore() {
        this.loadData();
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      modalTitle, fixedheader, split, gotop
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
    box-sizing: border-box
    overflow: hidden
    z-index: 20
  .auction
    position: absolute
    width: 100%
    top: 44px
    bottom: 0
    .auction-wrap
      position: relative
      width: 100%
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      .auction-list
        position: relative
        padding: 10px 8px
        box-sizing: border-box
        >.item
          margin-bottom: 10px
          font-size: 12px
          .thumbnail
            position: relative
            display: block
            width: 100%
            img
              width: 100%
              min-height: 101px
            .item-extra
              position: absolute
              width: 100%
              bottom: 0
              color: #fff
              height: 23px
              line-height: 23px
              .item-state
                position: relative
                float: left
                text-align: center
                width: 72px
                &.on
                  background: #f15353
                &.end
                  background: #999
              .item-time
                margin-left: 72px
                padding: 0 10px
                background: rgba(0,0,0,.6)
          .item-detail
            position: relative
            width: 100%
            padding: 15px 10px
            box-sizing: border-box
            .item-name
              font-size: 14px
              margin-bottom: 10px
              >a
                color: #444
            .item-info
              color: #999
              b
                display: inline-block
                width: 10px
                height: 100%
      .mu-circle-secondary, .mu-circle-spinner
        border-color: #ce3d3e
</style>
