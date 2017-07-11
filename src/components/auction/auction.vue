<template>
  <div class="main">
    <fixedheader title="拍卖专场" ref="header"></fixedheader>
    <div class="auction" ref="auction">
      <div class="auction-wrap">
        <modal-title title="今日拍卖"></modal-title>
        <ul class="auction-list">
          <li class="item" v-for="auction in auctionList">
            <router-link to="" class="thumbnail">
              <img :src="auction.thumbnail" alt="">
              <div class="item-extra">
                <div class="item-state on">{{auction.state}}</div>
                <div class="item-time">距离结束：<span class="time">{{getEndTime(auction.leftTime)}}</span></div>
              </div>
            </router-link>
            <div class="item-detail">
              <div class="item-name">
                <router-link to="">{{auction.name}}</router-link>
              </div>
              <div class="item-info">
                <span class="text-red">{{auction.count}}</span>件拍品<b></b>
                <span class="text-red">{{auction.buyer}}</span>人出价
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import topchanel from '@/components/channel/topchanel';
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import modalTitle from '@/components/modal-title/modal-title';

  export default {
    data() {
      return {
        auctionList: [{
          name: '大千木雕珍藏专场',
          state: '正在进行',
          leftTime: 36255327,
          count: 64,
          buyer: 100,
          thumbnail: 'http://img11.360buyimg.com/da/jfs/t5701/147/4821084102/193440/8ec5e8bd/5954fef2N9eddc482.jpg'
        }, {
          name: '景德镇精品大师陶瓷专场',
          state: '正在进行',
          leftTime: 36255327,
          count: 10,
          buyer: 11,
          thumbnail: 'http://img11.360buyimg.com/da/jfs/t6736/287/1781393521/85063/37a3d251/595797fcN6b7d6eb1.jpg'
        }, {
          name: '景德镇精品大师陶瓷专场',
          state: '正在进行',
          leftTime: 36255327,
          count: 10,
          buyer: 11,
          thumbnail: 'http://img11.360buyimg.com/da/jfs/t6736/287/1781393521/85063/37a3d251/595797fcN6b7d6eb1.jpg'
        }]
      };
    },
    activated() {
      this._initScroll();
    },
    created() {
      setInterval(() => {
        this.auctionList.forEach((auction) => {
          auction.leftTime -= 1000;
        });
      }, 1000);
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.auction, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
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
      back() {
        this.$router.back();
      }
    },
    components: {
      modalTitle, fixedheader, split, topchanel
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .auction
    position: absolute
    width: 100%
    top: 44px
    bottom: 50px
    overflow: hidden
    .auction-wrap
      position: relative
      width: 100%
      padding-bottom: 30px
      .auction-list
        position: relative
        padding: 10px 8px
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

</style>
