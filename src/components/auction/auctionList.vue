<template>
  <div class="main">
    <fixedheader title="拍卖列表" ref="header"></fixedheader>
    <div class="auction">
      <div class="auction-wrap" ref="auction">
        <div class="auction-list">
          <div class="item">
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
              <div class="item-ring"><i class="icon icon-time_of_appointment"></i><div class="text">设置提醒</div></div>
            </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '@/components/split/split';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';

  export default {
    data() {
      return {
        auction: {},
        scroller: null,
        loading: false,
        scrollY: 0,
        winHeight: document.documentElement.clientHeight,
        timer: null
      };
    },
    activated() {
      this.show();
      let id = Number(this.$route.params.id || 0);
      let auctionList = [
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
      this.auction = auctionList.find((item) => item.id === id);
      this.timer = setInterval(() => {
        this.auction.leftTime -= 1000;
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
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      fixedheader, split, gotop
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
            .item-ring
              position: absolute
              right: 0
              top: 0
              width: 24%
              border-left: 1px solid #d7d7d7
              color: #e89542
              text-align: center
              margin-top: 10px
              box-sizing: border-box
              overflow: hidden
              .icon
                font-size: 22px
              .text
                padding-top: 5px
                font-size: 12px
      .mu-circle-secondary, .mu-circle-spinner
        border-color: #ce3d3e
</style>
