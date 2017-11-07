<template>
  <div>
    <fixedheader title="拍卖详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
        </div>
        <div class="content">
          <h1 class="title">{{auction.name}}</h1>
          <div class="price">当前价：<span class="now">{{highPrice | currency}}</span></div>
          <div class="price" v-if="false">成交价：<span class="now">{{highPrice | currency}}</span></div>
        </div>
        <div class="auction-detail">
          <ul>
            <li><label>起拍价:</label><span>{{auction.startPrice | currency}}</span></li>
            <li><label>保留价:</label><span v-if="auction.minPrice">{{auction.minPrice | currency}}</span><span v-else-if="!auction.minPrice">无</span></li>
            <li><label>加价幅度:</label><span>{{auction.markup | currency}}</span></li>
            <li><label>拍卖类型:</label><span>加价拍</span></li>
          </ul>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title" @click.stop.prevent="gotoBidPrices">出价记录<span class="num">共{{auction.countAppr}}次</span></h1>
          <table class="auction-pricelist">
            <tr class="header">
              <td class="col-1">状态</td>
              <td class="col-2">出价用户</td>
              <td class="col-3">金额</td>
              <td class="col-4">出价时间</td>
            </tr>
            <tr v-for="(item, index) in bidPrices" :key="index">
              <td class="col-1"><span :class="{'highlight': item.state !== '淘汰'}">{{item.state}}</span></td>
              <td class="col-2">{{item.userNameId || item.userName}}</td>
              <td class="col-3">{{item.price | currency}}</td>
              <td class="col-4">{{item.time | formatDate}}</td>
            </tr>
          </table>
        </div>
        <split></split>
        <div class="auction-flow">
          <h1 class="title">拍卖流程</h1>
          <div>
            <img src="../../common/images/auction-step.png" alt="">
          </div>
        </div>
        <split v-show="auction.content"></split>
        <div class="info" v-show="auction.content">
          <h1 class="title">商品介绍</h1>
          <div class="text" v-html="auction.content" ref="goodContent" id="productIntro"></div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <div class="rating-wrapper">
            <ul v-if="auction.ratings && auction.ratings.length">
              <li class="rating-item" v-for="rating in auction.ratings" v-show="needShow(rating.score, rating.content)">
                <div class="user">
                  <img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10" width="20" height="20" alt="" class="avatar">
                  <span class="name">{{rating.from.userName | mix}}</span>
                </div>
                <div class="time">{{rating.createdAt | formatDate}}</div>
                <p class="text">
                  <star size="24" :score="rating.score"></star>{{rating.content}}
                </p>
                <ul class="piclist" v-if="rating.pictures && rating.pictures.length">
                  <li v-for="pic in rating.pictures" :class="getPicCls(rating)">
                    <img :src="getPicture(pic.pid) + '?h=90'" :data-img="getPicture(pic.pid)" height="90" v-if="rating.pictures.length === 1 || rating.pictures.length === 2 || rating.pictures.length === 4" @click.stop.prevent="previewImg(rating.pictures, pic)" />
                    <img :src="getThumbnail(pic.pid)" :data-img="getPicture(pic.pid)" width="90" height="90" v-else-if="rating.pictures.length === 3 || rating.pictures.length >= 5" @click.stop.prevent="previewImg(rating.pictures, pic)" />
                  </li>
                </ul>
                <ul v-if="rating.replys && rating.replys.length" class="reply-item">
                  <li class="rating-item" v-for="reply in rating.replys">
                    <div class="user">
                      <img src="http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a11" width="20" height="20" alt="" class="avatar">
                      <span class="name">{{reply.from.userName | mix}}</span>
                    </div>
                    <div class="time">{{reply.createdAt | formatDate}}</div>
                    <p class="text">
                      {{reply.content}}
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="no-rating" v-show="!auction.ratings || !auction.ratings.length">暂无评论</div>
            <div class="more-rating" v-show="auction.ratings && auction.ratings.length" @click.stop.prevent="viewMore">———— 查看更多评论 ————</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-foot">
      <div class="foot-wrapper">
        <div class="foot-item" v-if="auction.leftStartTimes > 0" @click.stop.prevent="notify">
          <span class="button-lg green">拍卖提醒</span>
        </div>
        <div class="foot-item" v-if="auction.leftEndTimes <= 0">
          <span class="button-lg gray">已结束</span>
        </div>
        <div class="foot-item">
          <div class="input-group">
            <span class="input-group-btn"><button class="btn" @click.stop.prevent="reduce">-</button></span>
            <input type="number" class="form-control" v-model="highPrice" />
            <span class="input-group-btn"><button class="btn" @click.stop.prevent="add">+</button></span>
          </div>
        </div>
        <div class="foot-item" @click.stop.prevent="bid">
          <span class="button-lg red">出价</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '@/common/js/date';
  import {mixUsername} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import swipe from '@/components/swipe/quietswipe';
  import star from '@/components/star/star';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';

  const ALL = 2;
  // const ERR_OK = 0;

  export default {
    activated() {
      this.fetchData();
      this.connectSocket();
    },
    deactivated() {
      this.hide();
      this.disconnect();
    },
    data() {
      return {
        auction: {},
        bidPrices: [],
        bidsTotal: 0,
        highPrice: 0,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '好评',
          common: '中评',
          negative: '差评'
        },
        psCtx: api.CONFIG.psCtx,
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        marked: false,
        timer: null,
        nowTimes: +new Date(),
        config: {
          dest: 'http://localhost:8080/cmsAuction/stomp',
          topic: '/topic/14'
        },
        client: null
      };
    },
    computed: {
      swiperSlides() {
        let sliders = [];
        if (this.auction.icon) {
          sliders.push({'thumbnail': api.CONFIG.psCtx + this.auction.icon + '?w=750&h=500', 'src': api.CONFIG.psCtx + this.auction.icon});
        } else {
          sliders.push({'thumbnail': api.CONFIG.defaultImg, 'src': api.CONFIG.defaultImg});
        }
        return sliders;
      }
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        if (!id) {
          return;
        }
        this.$store.dispatch('openLoading');
        api.getAuction(id).then(response => {
          this.auction = response;
          this.wxReady();
          this.show();
          this.lazyload();
          this.$store.dispatch('closeLoading');
          this.fetchBids();
          this.fetchComments();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      fetchComments() {
        api.getProductComments({
          currentPage: 1,
          pageSize: 5,
          productId: this.auction.productId || ''
        }).then(response => {
          if (!this.auction.ratings) {
            Vue.set(this.auction, 'ratings', response.comments);
          } else {
            this.auction.ratings = response.comments;
          }
        });
      },
      fetchBids() {
        api.getBidPrices({
          paging: 1,
          pageSize: 5,
          auctionProductId: this.auction.id || ''
        }).then(response => {
          if (response.result === 0) {
            if (response.info.apprList && response.info.apprList.length) {
              this.bidPrices = response.info.apprList;
              this.highPrice = this.bidPrices[0].price;
            } else {
              this.highPrice = this.auction.startPrice;
            }
          }
        }).catch(response => {
          this.bidPrices = [];
        });
      },
      getThumbnail(id) {
        if (id) {
          return api.CONFIG.psCtx + id + '?w=90&h=90';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getPicture(id) {
        if (id) {
          return api.CONFIG.psCtx + id;
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      getPicCls(rating) {
        let plen = rating.pictures.length;
        if (plen === 1 || plen === 2 || plen === 4) {
          return 'p50';
        } else {
          return 'p30';
        }
      },
      previewImg(pics, pic) {
        let imgs = [];
        for (let i = 0; i < pics.length; i++) {
          imgs.push(this.getPicture(pics[i].pid));
        }
        wx.previewImage({
          current: this.getPicture(pic.pid),
          urls: imgs
        });
      },
      viewMore() {
        this.$router.push({name: 'goodComment', params: {id: this.auction.productId}});
      },
      gotoBidPrices() {
        this.$router.push({name: 'bidlist', params: {id: this.auction.id}});
      },
      connectSocket() {
        let socket = new SockJS(this.config.dest);
        this.client = Stomp.over(socket);
        this.client.connect({}, function(frame) {
          this.client.subscribe(this.config.topic, function(event) {
            handleEvent(JSON.parse(event.body));
          });
        }, function(frame) {
          console.log(frame);
          console.error(new Date() + ' websocket失去连接！');
        });
      },
      handleEvent(data) {
        console.log(data);
      },
      disconnect() {
        if (this.client) {
          this.client.disconnect();
          this.client = null;
          console.log('连接已断开');
        }
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.good, {
              click: true,
              bounce: false
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
      bid() {
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.openid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        api.bidPrice({
          'userName': userInfo.nickName || '',
          'userNameID': userInfo.userId,
          'openid': userInfo.openid,
          'price': this.highPrice,
          'auctionProductId': this.auction.id
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('openToast', '出价成功！');
          } else if (response.result === 3) {
            this.$store.dispatch('openToast', '已经是最高价了，看好你哦！');
          } else if (response.result === 2) {
            this.$store.dispatch('openToast', '出价太低了，有人超过你了！');
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '网络太忙，稍后再试！');
        });
      },
      reduce() {
        if (this.highPrice > this.auction.markup) {
          this.highPrice -= this.auction.markup;
        }
      },
      add() {
        this.highPrice += this.auction.markup;
      },
      notify() {
        let openid = this.$store.getters.getUserInfo.openid;
        api.reservedNotify({
          pid: this.auction.auctionId,
          pname: this.auction.name,
          type: 0,
          openid: openid,
          strDate: formatDate(new Date(this.auction.startTime.replace(/\s/, 'T')), 'yyyy-MM-dd hh:mm')
        }).then(response => {
          this.$store.dispatch('openToast', '设置成功, 请留意微信通知！');
        });
      },
      wxReady() {
        api.wxsignature(encodeURIComponent(location.href.split('#')[0])).then(response => {
          wx.config({
            // debug: true, // 开启调试模式
            appId: response.appId,      // 必填，公众号的唯一标识
            timestamp: response.timestamp,  // 必填，生成签名的时间戳
            nonceStr: response.nonceStr,   // 必填，生成签名的随机串
            signature: response.signature,  // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
          });
        });
        let icon = 'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?w=423&h=423';
        if (this.auction.icon) {
          icon = api.CONFIG.psCtx + this.auction.icon + '?w=423&h=423';
        }
        let shareData = {
          title: this.auction.name,
          desc: '起拍价：¥' + this.auction.startPrice + '。「一虎一席商城」正品保证，微信专享。',
          link: location.href,
          imgUrl: icon
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      lazyload() {
        let w = window.innerWidth;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          let previewImgList = [];
          let imgs = this.$refs.goodContent.getElementsByTagName('img');
          let html = this.auction.content;
          for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i];
            let src = img.getAttribute('data-original');
            let width = img.getAttribute('width');
            let height = img.getAttribute('height');
            let key = '<img class="lazy" data-original="' + src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"';
            let suffix = '';
            if (width) {
              suffix += ' width="' + width + '"';
            }
            if (height) {
              suffix += ' height="' + height + '"';
            }
            let key2 = key + ' alt=""' + suffix;
            key += suffix;
            if (src.indexOf('http:') < 0) {
              src = prefix + src;
            }
            if (src.lastIndexOf('?') < 0) {
              src += '?1';
            }
            src = src + '&w=' + w;
            html = html.replace(key, '<img src="' + src + '"').replace(key2, '<img src="' + src + '"');
            if (width && width > 100) {
              previewImgList.push(src.substring(0, src.lastIndexOf('?')));
            }
          }
          this.auction.content = html;
          setTimeout(() => {
            this._initScroll();
            let newImgs = this.$refs.goodContent.getElementsByTagName('img');
            for (let j = 0; j < newImgs.length; j++) {
              newImgs[j].addEventListener('click',
                (e) => {
                  let pic = (e.target || e.srcElement).src;
                  pic = pic.substring(0, pic.lastIndexOf('?'));
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
        if (!time) {
          return '';
        }
        return time.substring(0, time.length - 3);
      },
      mix(name) {
        return mixUsername(name);
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedheader, swipe, star
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
    .detail
      position: relative
      z-index: 5
      &.bg_pink
        display: flex
        -webkit-box-align: center
        align-items: center
        height: 49px
        color: #fff
        background:url(../../common/images/bg_pink.png) no-repeat,-webkit-linear-gradient(top,#fc5997,#ef4747)
        background-size: 259px,100%
      .price
        margin: 0 10px
        font-size: 14px
        font-weight: 700
        em
          font-size: 24px
      .msg
        flex: 1
        font-size: 12px
        .text
          height: 18px
          line-height: 18px
        .type_auction
          position: relative
          display: inline-block
          margin: -2px 3px 0 0
          padding: 0 3px 0 18px
          height: 15px
          vertical-align: middle
          line-height: 15px
          font-size: 10px
          &::before
            content: ""
            position: absolute
            left: 0
            top: 0
            width: 15px
            height: 15px
            border-top-left-radius: 1px
            border-bottom-left-radius: 1px
            background:#fff url(../../common/images/clock.png) no-repeat 50%
            background-size: 12px
          &::after
            content: ""
            display: block
            border: 1px solid #e5e5e5
            position: absolute
            top: 0
            left: 0
            pointer-events: none
            -webkit-transform: scale(.5);
            -webkit-transform-origin: 0 0;
            bottom: -100%;
            right: -100%;
            border-color: #fff
            border-radius: 1px
          @media only screen and (-webkit-min-device-pixel-ratio: 2)
            border-radius: 2px
      .countdown
        position: absolute
        right: 0
        top: 0
        width: 116px
        height: 100%
        text-align: center
        background-color: #f8f8f8
        .countdown_text
          margin: 5px 0
          font-size: 10px
          color: #666
        .countdown_nums
          color: #ef4747
          font-size: 14px
          .box
            display:inline-block
            margin:0 1px
            width: 20px
            height: 21px
            line-height: 21px
            font-weight:700
            color:#fff
            background:#fff url(../../common/images/countdown.png)
            background-size:13px
    .bg_green
      display: flex
      -webkit-box-align: center
      align-items: center
      height: 49px
      color: #fff
      background: -webkit-linear-gradient(top, #56cd5c, #44b549)
      .countdown_start
        padding-right: 10px
        font-size: 12px
        color: #035807
        text-align: center
        p
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
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
        line-height: 24px
        color: #999
        font-size: 14px
        .now
          font-size: 20px
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
        padding-left: 18px
        height: 40px
        line-height: 40px
        font-size: 14px
        color: rgb(7, 17, 27)
        .num
          position: absolute
          right: 0
          top: 0
          width: 60px
          height: 40px
          line-height: 40px
          font-size: 12px
          color: #999
          &:after
            content: ""
            display: block
            position: absolute
            top: 50%
            right: 15px
            margin-top: -4px
            width: 8px
            height: 8px
            border-right: 1px solid #9c9c9c
            border-bottom: 1px solid #9c9c9c
            -webkit-transform: rotate(-45deg)
            transform: rotate(-45deg)
      .text
        padding: 15px 0
        font-size: 12px
        color: rgb(77, 85, 93)
        line-height: 1.3
        box-sizing: border-box
        overflow-x: hidden
      .auction-pricelist
        position: relative
        width: 100%
        font-size: 12px
        background-color: #fff
        text-align: left
        tr
          height: 40px
          line-height: 40px
        .header
          background-color: #f3f2f8  
        .col-1
          width: 20%
          padding-left: 10px
          box-sizing: border-box
          span
            display: inline-block
            height: 15px
            width: 30px
            line-height: 15px
            vertical-align: middle
            text-align: center
            color: #fff
            background-color: #747474
            border-radius: 1px
            &.highlight
              background-color: #3985ff
        .col-2
          width: 25%
          padding-left: 10px
          box-sizing: border-box
        .col-3
          flex: 1
          padding-left: 10px
          word-break: break-all
          overflow: hidden
          box-sizing: border-box
        .col-4
          width: 35%
          padding-left: 10px
          text-overflow: ellipsis
          white-space: nowrap
          overflow: hidden
          box-sizing: border-box
    .auction-detail
      position: relative
      padding-bottom: 12px
      clear: both
      ul
        position: relative
        display: flex
        flex-wrap: wrap
        line-height: 20px
        padding: 0 18px
        box-sizing: border-box
        li
          float: left
          width: 50%
          height: auto
          font-size: 14px
          white-space: nowrap
          overflow: hidden
          box-sizing: border-box
          label
            color: #999
            display: inline-block
            width: 65px
    .auction-flow
      position: relative
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        margin-bottom: 6px
        color: #07111b
      img
        border: 0 none
        vertical-align: bottom
        -ms-interpolation-mode: bicubic
        max-width: 100%
    .rating
      padding-top: 18px
      .title
        margin-left: 18px
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        position: relative
        padding: 0 10px
        .rating-item
          position: relative
          padding: 16px 0
          clear: both
          .reply-item
            margin-left: 20px
          .user
            position: absolute
            left: 0
            top: 20px
            font-size: 0
            height: 25px
            line-height: 25px
            .name
              display: inline-block
              margin-left: 3px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 20px
            .avatar
              border-radius: 50%
          .time
            line-height: 30px
            font-size: 10px
            color: rgb(147, 153, 159)
            text-align: right
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
          .piclist
            position: relative
            width: 100%
            min-height: 95px
            padding: 5px 0
            clear: both
            li
              display: block
              float: left
              width: 100%
              height: 90px
              margin-right: 3px
              margin-bottom: 5px
              &.p50
                width: 45%
              &.p30
                width: 30%
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
        .more-rating
          padding: 6px 0
          font-size: 12px
          color: rgb(147, 153, 159)
          text-align: center
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
          &.green
            background: #44b549
            color: #fff
          &.orange
            background: rgba(250,180,90,0.93)
            color: #fff
          &.red
            background: #ff463c
            color: #fff
          .icon-favorite
            color: #ff463c  
        .input-group
          position: relative
          display: inline-table
          border-collapse: separate
          vertical-align: middle
          box-sizing: border-box
          .input-group-btn
            display: table-cell
            vertical-align: middle
            position: relative
            font-size: 0
            white-space: nowrap
            .btn
              display: inline-block
              height: 50px
              line-height: 50px
              width: 35px
              font-size: 24px
              text-align: center
              white-space: nowrap
              vertical-align: middle
              cursor: pointer
              outline: none
              border: 0
              background-color: #ddd
              color: #FFF
          .form-control
            position: relative
            display: table-cell
            vertical-align: middle
            text-align: center
            float: left
            width: 100%
            height: 50px
            line-height: 50px
            font-size: 20px
            color: #555
            background-color: #fff
            background-image: none
            border: none
            box-sizing: border-box
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
