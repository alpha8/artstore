<template>
  <div>
    <fixedheader title="商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="seckillRef">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
          <!-- <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div> -->
        </div>
        <div class="detail bg_pink" v-if="seckill.leftStartTimes <= 0">
          <div class="price">¥<em>{{good.killPrice}}</em></div>
          <div class="msg">
            <div class="text"><del class="old_price" v-show="good.price">{{good.price | currency}}</del></div>
            <div class="text"><span class="type_seckill">商品秒杀</span></div>
          </div>
          <div class="countdown">
            <p class="countdown_text">距秒杀结束还剩</p>
            <p class="countdown_nums"><span v-if="countdownStats.days"><span class="box">{{countdownStats.days}}</span>:</span><span v-if="countdownStats.hours"><span class="box">{{countdownStats.hours}}</span>:</span><span v-if="countdownStats.mins"><span class="box">{{countdownStats.mins}}</span>:</span><span v-if="countdownStats.seconds"><span class="box">{{countdownStats.seconds}}</span></span></p>
          </div>
        </div>
        <div class="detail bg_green" v-if="seckill.leftStartTimes > 0">
          <div class="price">¥<em>{{good.killPrice}}</em></div>
          <div class="msg">
            <div class="text"><del class="old_price" v-show="good.price">{{good.price | currency}}</del></div>
            <div class="text"><span class="type_seckill">商品秒杀</span></div>
          </div>
          <div class="countdown_start bg_green">
            <p v-html="countdownTips()"></p>
          </div>
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
          <!-- <div class="duration" v-if="countdownStats.milliseconds">结束倒计时：<span v-if="countdownStats.days"><span class="red-text">{{countdownStats.days}}</span>天</span><span v-if="countdownStats.hours"><span class="red-text">{{countdownStats.hours}}</span>小时</span><span v-if="countdownStats.mins"><span class="red-text">{{countdownStats.mins}}</span>分</span><span v-if="countdownStats.seconds"><span class="red-text">{{countdownStats.seconds}}</span>秒</span></div>  -->         
        </div>
        <split v-show="good.content"></split>
        <div class="info" v-show="good.content">
          <h1 class="title">商品介绍</h1>
          <div class="text" v-html="good.content" ref="goodContent" id="productIntro"></div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <div class="rating-wrapper">
            <ul v-if="good.ratings && good.ratings.length">
              <li class="rating-item" v-for="rating in good.ratings" v-show="needShow(rating.score, rating.content)">
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
            <div class="no-rating" v-show="!good.ratings || !good.ratings.length">暂无评论</div>
            <div class="more-rating" v-show="good.ratings && good.ratings.length" @click.stop.prevent="viewMore">———— 查看更多评论 ————</div>
          </div>
        </div>
        <split v-show="guessGoods.length"></split>
        <modal-title title="您可能还喜欢" moreText="更多" catKey="" catName="" v-show="guessGoods.length"></modal-title>
        <channel :items="guessGoods" :cols="2"></channel>
      </div>
    </div>
    <div class="fixed-foot">
      <div class="foot-wrapper">
        <span class="mini-favorite-item" @click.stop.prevent="mark">
          <span class="button-lg"><i :class="favorited"></i></span>
        </span>
        <div class="foot-item" v-show="seckill.leftStartTimes > 0" @click.stop.prevent="killNotify">
          <span class="button-lg green">秒杀提醒</span>
        </div>
        <div class="foot-item" v-if="seckill.leftEndTimes <= 0">
          <span class="button-lg gray">已结束</span>
        </div>
        <div class="foot-item" v-else-if="seckill.number <= 0">
          <span class="button-lg gray">已抢完</span>
        </div>
        <div class="foot-item" v-else-if="existKilled()">
          <span class="button-lg orange">抢过了</span>
        </div>
        <div class="foot-item" v-show="!existKilled() && seckill.leftStartTimes <= 0 && seckill.leftEndTimes > 0 && seckill.number > 0" @click.stop.prevent="pay">
          <span class="button-lg red">立即抢购</span>
        </div>
      </div>
    </div>
    <frame></frame>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate, countdown} from '@/common/js/date';
  import {mixUsername} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import frame from '@/components/common/myiframe';
  import swipe from '@/components/swipe/quietswipe';
  import star from '@/components/star/star';
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
        guessGoods: [],
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
            sliders.push({'thumbnail': api.CONFIG.psCtx + pic.id + '?w=750&h=500', 'src': api.CONFIG.psCtx + pic.id});
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
            this.wxReady();
            this.show();
            this.lazyload();
            this.$store.dispatch('closeLoading');
            this.fetchComments();
            this.getLikeGoods();
          }).catch(response => {
            this.$store.dispatch('closeLoading');
          });
        });
      },
      fetchComments() {
        api.getProductComments({
          currentPage: 1,
          pageSize: 5,
          productId: this.good.id || ''
        }).then(response => {
          if (!this.good.ratings) {
            Vue.set(this.good, 'ratings', response.comments);
          } else {
            this.good.ratings = response.comments;
          }
        });
      },
      getLikeGoods() {
        let kw = '';
        let cat = '';
        if (this.good.keyword.length) {
          kw = this.good.keyword.join(',');
        } else {
          cat = this.good.artworkCategory.parent.name;
        }
        api.GetGoods({
          artworkTypeName: 'tea',
          currentPage: 1,
          pageSize: 20,
          keyword: kw,
          categoryParentName: cat || '',
          pid: this.good.id
        }).then((response) => {
          this.guessGoods = response.artworks;
          setTimeout(() => {
            this._initScroll();
          }, 800);
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
        this.$router.push({name: 'goodComment', params: {id: this.good.id}});
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
        if (this.seckill.leftStartTimes) {
          this.countdownStats = countdown(this.seckill.leftStartTimes);
        } else {
          this.countdownStats = countdown(this.seckill.leftEndTimes);
        }
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
      countdownTips() {
        let text = '';
        if (this.countdownStats.days) {
          text += this.countdownStats.days + '天';
        }
        if (this.countdownStats.hours) {
          text += this.countdownStats.hours + '小时';
        }
        if (this.countdownStats.mins) {
          text += this.countdownStats.mins + '分';
        }
        if (this.countdownStats.seconds) {
          text += this.countdownStats.seconds + '秒';
        }
        if (this.seckill.leftStartTimes) {
          return `距开抢 ${text}`;
        }
        return '';
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.seckillRef, {
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
              this.$store.dispatch('addKillProduct', this.seckill.seckillId);
              // this.$router.push({name: 'pay', query: {orderType: 3}});
              window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=3';
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
      existKilled() {
        return !!this.$store.getters.getKilledProduct.find(id => id === this.seckill.seckillId);
      },
      killNotify() {
        let openid = this.$store.getters.getUserInfo.openid;
        api.reservedNotify({
          pid: this.seckill.seckillId,
          pname: this.seckill.name,
          type: 0,
          openid: openid,
          strDate: formatDate(new Date(this.seckill.startTime.replace(/\s/, 'T')), 'yyyy-MM-dd hh:mm')
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
        let shareData = {
          title: this.good.name,
          desc: '秒杀价：¥' + this.good.killPrice + '。「一虎一席商城」正品保证，微信专享。',
          link: location.href,
          imgUrl: (this.good.pictures && (api.CONFIG.psCtx + this.good.pictures[0].id + '?w=423&h=423')) || 'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?w=423&h=423'
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
          let html = this.good.content;
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
          this.good.content = html;
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
      cartcontrol, split, ratingselect, fixedheader, swipe, star, frame, modalTitle, channel
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
        .type_seckill
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
