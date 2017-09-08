<template>
  <div>
    <fixedheader title="商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
          <!-- <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div> -->
        </div>
        <div class="content">
          <h1 class="title">{{good.name}}</h1>
          <!-- <div class="detail">
            <span class="sell-count">月售{{good.sellCount}}份</span>
          </div> -->
          <div class="price">
            <span class="now">¥{{good.killPrice}}</span><span class="old" v-show="good.price">¥{{good.price}}</span>
            <span class="stock">库存： {{good.number}}</span>          
          </div>
          <div class="duration">秒杀时间： {{good.startTime | formatDate2}} ~ {{good.endTime | formatDate2}}</div>          
          <div class="duration" v-if="countdownStats.milliseconds">结束倒计时：<span v-if="countdownStats.days"><span class="red-text">{{countdownStats.days}}</span>天</span><span v-if="countdownStats.hours"><span class="red-text">{{countdownStats.hours}}</span>小时</span><span v-if="countdownStats.mins"><span class="red-text">{{countdownStats.mins}}</span>分</span><span v-if="countdownStats.seconds"><span class="red-text">{{countdownStats.seconds}}</span>秒</span></div>          
        </div>
        <split v-show="good.content"></split>
        <div class="info" v-show="good.content">
          <h1 class="title">商品介绍</h1>
          <div class="text" v-html="good.content" ref="goodContent" id="productIntro"></div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="good.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="good.ratings && good.ratings.length">
              <li class="rating-item border-1px" v-for="rating in good.ratings" v-show="needShow(rating.rateType, rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" alt="" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!good.ratings || !good.ratings.length">暂无评论</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-foot">
      <div class="foot-wrapper">
        <span class="mini-favorite-item" @click.stop.prevent="mark">
          <span class="button-lg"><i :class="favorited"></i></span>
        </span>
        <div class="foot-item" v-show="seckill.leftStartTimes > 0" @click.stop.prevent="killNotify">
          <span class="button-lg orange">秒杀提醒</span>
        </div>
        <div class="foot-item" v-show="seckill.leftEndTimes <= 0 || seckill.number <= 0">
          <span class="button-lg gray">已结束</span>
        </div>
        <div class="foot-item" v-show="seckill.leftStartTimes <= 0 && seckill.leftEndTimes > 0 && seckill.number > 0" @click.stop.prevent="pay">
          <span class="button-lg red">立即抢购</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatDate, countdown} from '@/common/js/date';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import swipe from '@/components/swipe/quietswipe';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  const ALL = 2;
  // const ERR_OK = 0;

  export default {
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.stopTimer();
      this.hide();
      this.marked = false;
    },
    data() {
      return {
        good: {},
        seckill: {},
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        },
        psCtx: api.CONFIG.psCtx,
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        marked: false,
        timer: null,
        nowTimes: +new Date(),
        md5: '',
        countdownStats: {}
      };
    },
    computed: {
      swiperSlides() {
        let pics = this.good.pictures || [];
        let sliders = [];
        pics.forEach(pic => {
          if (pic) {
            sliders.push({'thumbnail': api.CONFIG.psCtx + pic.id + '?w=' + (window.innerWidth), 'src': api.CONFIG.psCtx + pic.id});
          } else {
            sliders.push({'thumbnail': api.CONFIG.defaultImg, 'src': api.CONFIG.defaultImg});
          }
        });
        return sliders;
      },
      favorited() {
        let uid = this.$store.getters.getUserInfo.userId;
        let ids = this.good.collected || [];
        for (let i = 0; i < ids.length; i++) {
          if (uid === ids[i]) {
            this.marked = true;
            return 'icon-favorite';
          }
        }
        this.marked = false;
        return 'icon-heart';
      }
    },
    mounted() {
      let picUrl = api.CONFIG.defaultImg;
      if (this.seckill.icon) {
        picUrl = api.CONFIG.psCtx + seckill + '?w=375&h=375';
      }
      var shareParams = {
        title: '「一虎一席」' + this.good.name,
        link: location.href,
        icon: picUrl
      };
      // 分享朋友圈
      wx.onMenuShareTimeline({
        title: shareParams.title, // 分享标题
        link: shareParams.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.icon, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
          this.$store.dispatch('openToast', '分享成功！');
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: shareParams.title, // 分享标题
        desc: shareParams.title + ' - 商品详情页', // 分享描述
        link: shareParams.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.icon, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
          this.$store.dispatch('openToast', '分享成功！');
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        this.$store.dispatch('openLoading');
        api.getSeckillDetail(id).then(res => {
          if (!res.success) {
            this.$store.dispatch('closeLoading');
            return;
          }
          let seckill = res.data;
          this.seckill = seckill;
          this.timerLoop();
          api.GetGood(seckill.goodsId).then(response => {
            let good = response;
            this.good = good;
            Object.assign(this.good, this.seckill);
            this.show();
            this.lazyload();
            this.$store.dispatch('closeLoading');
          }).catch(response => {
            this.$store.dispatch('closeLoading');
          });
        });
      },
      serverTime() {
        api.getServerTime().then(res => {
          if (res.success) {
            this.nowTimes = res.data;
          }
        });
      },
      timerLoop() {
        if (this.seckill.leftStartTimes) {
          this.seckill.leftStartTimes--;
        }
        if (this.seckill.leftEndTimes) {
          this.seckill.leftEndTimes--;
        }
        this.countdownStats = countdown(this.seckill.leftEndTimes);
        if (this.seckill.leftEndTimes <= 0) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.timerLoop, 1000);
      },
      stopTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.good, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
        this._initScroll();
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      back() {
        this.$router.back();
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      },
      pay() {
        let killResult = {'REPEAT_KILL': '重复秒杀', 'INNER_ERROR': '系统异常，请重试', 'END': '秒杀已结束', 'SUCCESS': '秒杀成功'};
        api.getSeckillUrl(this.seckill.seckillId).then(response => {
          if (response.success) {
            let md5 = response.data.md5;
            if (!md5) {
              this.$store.dispatch('openToast', '秒杀活动未开始或已结束！');
              return;
            }
            api.killGoods(this.seckill.seckillId, md5).then(res => {
              if (!res.success) {
                this.$store.dispatch('openToast', res.error || killResult[res.data.statEnum]);
                return;
              }
              let good = {
                id: this.seckill.seckillId,
                name: this.good.name,
                pictures: this.good.pictures,
                src: this.good.src,
                content: this.good.content,
                price: this.good.killPrice,
                oldPrice: this.good.price,
                count: 1,
                icon: (this.good.pictures && this.good.pictures.length) ? api.CONFIG.psCtx + this.good.pictures[0].id + '?w=114&h=114' : api.CONFIG.defaultImg,
                checked: false,
                createTime: res.data.seccessKilled && res.data.seccessKilled.createTime
              };
              this.$store.dispatch('addPayGoods', [good]);
              this.$router.push({name: 'pay', query: {orderType: 3}});
            });
          }
        });
      },
      mark() {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        let params = {
          userId: uid,
          type: 1,
          artworkId: this.good.id,
          fromCart: false
        };
        if (this.marked) {
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              this.good.collected = [];
            }
          });
          this.marked = false;
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (this.good.collected) {
              this.good.collected.push(uid);
            } else {
              this.good.collected = [uid];
            }
          }
        });
      },
      killNotify() {
        let openid = this.$store.getters.getUserInfo.openid;
        api.reservedNotify({
          pid: this.seckill.seckillId,
          pname: this.seckill.name,
          type: 0,
          openid: openid,
          strDate: formatDate(new Date(this.seckill.startTime), 'yyyy-MM-dd hh:mm')
        }).then(response => {
          this.$store.dispatch('openToast', '设置成功, 请留意微信通知！');
        });
      },
      lazyload() {
        let w = window.innerWidth;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          let previewImgList = [];
          let imgs = this.$refs.goodContent.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i];
            let src = img.getAttribute('data-original');
            let width = img.getAttribute('width');
            let height = img.getAttribute('height');
            let key = '<img class="lazy" data-original="' + src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"';
            if (width) {
              key += ' width="' + width + '"';
            }
            if (height) {
              key += ' height="' + height + '"';
            }
            this.good.content = this.good.content.replace(key, '<img src="http://www.yihuyixi.com' + src + '?w=' + w + '"');
            if (width && width > 100) {
              previewImgList.push('http://www.yihuyixi.com' + src);
            }
          }
          setTimeout(() => {
            this._initScroll();
            let newImgs = this.$refs.goodContent.getElementsByTagName('img');
            for (let j = 0; j < newImgs.length; j++) {
              newImgs[j].addEventListener('click',
                (e) => {
                  let pic = (e.target || e.srcElement).src;
                  if (pic.lastIndexOf('?') > -1) {
                    pic = pic.substring(0, pic.lastIndexOf('?'));
                  }
                  wx.previewImage({
                    current: pic,
                    urls: previewImgList
                  });
              }, false);
            }
          }, 500);
        }, 1000);
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
      formatDate2(time) {
        let date = new Date(time.replace(/\s/, 'T'));
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedheader, swipe
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'

  .good
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
    background: #fff
    overflow: hidden
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      .swiper-container
        height: 80vw
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 10px
        border-radius: 50%
        background: rgba(7, 17, 27, 0.4)
        .icon-arrow_lift
          display: block
          padding: 6px 6px 6px 4px
          font-size: 18px
          color: #fafafa
    .good-content
      position: relative
      width: 100%
      padding-bottom: 30px
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
        word-spacing: 1.2
      .red-text
        color: #e4393c
        font-weight: 700
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        position: relative
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
        .stock
          position: absolute
          right: 0
          top: 0
          font-size: 12px
          color: #666
      .duration
        display: block
        padding: 5px 0
        font-size: 12px
        color: #666
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220)
        transition: all 0.2s
        &.fade-enter-active, &.fade-leave-active
          opacity: 1
        &.fade-enter, &.fade-leave-active
          opacity: 0
    .sku-wrap
      position: relative
      padding: 10px 18px
      .sku
        position: relative
        height: 40px
        font-size: 12px
        label
          position: relative
          display: inline-block
          height: 40px
          line-height: 40px
          min-width: 75px
          color: #999
        span
          position: relative
          display: inline-block
          vertical-align: bottom
    .info
      position: relative
      margin-bottom: 18px
      .title
        padding: 10px 18px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        padding: 15px 0
        font-size: 12px
        color: rgb(77, 85, 93)
        line-height: 1.3
        box-sizing: border-box
        overflow-x: hidden
    .rating
      padding-top: 18px
      .title
        margin-left: 18px
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
  .fixed-foot
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 50px
    z-index: 80
    background: #fafafa
    .foot-wrapper
      display: flex
      height: 100%
      .foot-item, .mini-favorite-item
        flex: 1
        position: relative
        height: 100%
        font-size: 12px
        text-align: center
        color: #666
        &.active
          color: #00bb9c
        .icon
          display: block
          line-height: 1
          padding-top: 5px
          i
            display: inline-block
            width: 20px
            height: 20px
            font-size: 16px
        .text
          display: block
          line-height: 1
          font-size: 10px
        .button-lg
          display: block
          line-height: 50px
          font-family: "黑体"
          font-size: 14px
          i
            font-size: 22px
          &.gray
            background: #999
            color: #fff
          &.orange
            background: rgba(250,180,90,0.93)
            color: #fff
          &.red
            background: #ff463c
            color: #fff
          .icon-favorite
            color: #ff463c  
      .mini-favorite-item
        flex: 70px 0 0
        .button-lg
          height: 50px
          line-height: 30px
          margin-top: 15px
          overflow: hidden
        .badge
          display: inline-block
          position: absolute
          top: 6px
          right: 13px
          background: #f23030
          color: #fff
          border-radius: 50%
          padding: 2px
          width: 14px
          height: 14px
          line-height: 14px
          font-size: 10px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
</style>
