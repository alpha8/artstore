<template>
  <div>
    <fixedheader title="商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
          <!-- <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div> -->
        </div>
        <div class="detail bg_pink">
          <div class="price">¥<em>{{good.groupPrice}}</em></div>
          <div class="msg">
            <div class="text"><del class="old_price" v-show="good.oldPrice">{{good.oldPrice | currency}}</del></div>
            <div class="text"><span class="type_seckill">商品团购</span></div>
          </div>
          <div class="countdown">
            <p class="countdown_text">已团{{good.bookmoq}}件·{{good.moq}}人团</p>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{good.name}}</h1>
          <div class="price">
            <span class="now">¥{{good.groupPrice}}</span><span class="old" v-show="good.oldPrice">{{good.oldPrice | currency}}</span>
            <span class="stock"></span>          
          </div>
          <div class="duration">团购时间： {{good.startDate | formatDate}} ~ {{good.endDate | formatDate}}</div>  
        </div>
        <split v-show="good.description"></split>
        <div class="info" v-show="good.description">
          <h1 class="title">商品介绍</h1>
          <div class="text" v-html="good.description" ref="goodContent" id="productIntro"></div>
        </div>
        <div class="info" v-show="good.rule">
          <h1 class="title">使用规则</h1>
          <div class="text" v-html="good.rule" ref="goodRule" id="rules"></div>
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
      </div>
    </div>
    <div class="fixed-foot">
      <div class="foot-wrapper">
        <span class="mini-favorite-item" @click.stop.prevent="mark">
          <span class="button-lg"><i :class="favorited"></i></span>
        </span>
        <div class="foot-item" v-if="good.status === 2">
          <span class="button-lg gray">已结束</span>
        </div>
        <div class="foot-item" v-else-if="good.bookmoq === good.moq">
          <span class="button-lg gray">已抢完</span>
        </div>
        <div class="foot-item" v-else-if="good.bookmoq != good.moq" @click.stop.prevent="pay">
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
  import {formatDate} from '@/common/js/date';
  import {mixUsername} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
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
      this.show();
    },
    deactivated() {
      this.hide();
      this.marked = false;
      this.processing = false;
    },
    updated() {
      if (this.good.description && !this.processing) {
        this.processing = true;
        this.lazyload();
        this.bindPictureEvent();
      }
      this._initScroll();
    },
    data() {
      return {
        good: {},
        selectType: ALL,
        onlyContent: true,
        lazyloaded: false,
        processing: false,
        previewImgList: [],
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
        countdownStats: {}
      };
    },
    computed: {
      swiperSlides() {
        let pics = this.good.artwork && this.good.artwork.pictures || [];
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
        let ids = this.good.artwork && this.good.artwork.collected || [];
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
        api.getGroupbuyDetail(id).then(res => {
          if (res.result === 1) {
            this.$store.dispatch('closeLoading');
            return;
          }
          this.good = res;
          this.wxReady();
          this.show();
          this.processing = false;
          this.$store.dispatch('closeLoading');
          this.fetchComments();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
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
      bindPictureEvent() {
        if (this.lazyloaded) {
          let imgs = this.$refs.goodContent.getElementsByTagName('img');
          for (let j = 0; j < imgs.length; j++) {
            imgs[j].addEventListener('click',
              (e) => {
                let pic = (e.target || e.srcElement).src;
                if (pic) {
                  pic = pic.substring(0, pic.lastIndexOf('?'));
                  wx.previewImage({
                    current: pic,
                    urls: this.previewImgList
                  });
                }
            }, false);
          }
        }
      },
      fetchComments() {
        api.getProductComments({
          currentPage: 1,
          pageSize: 5,
          productId: this.good.artwork && this.good.artwork.id || ''
        }).then(response => {
          if (!this.good.ratings) {
            Vue.set(this.good, 'ratings', response.comments);
          } else {
            this.good.ratings = response.comments;
          }
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
        this.$router.push({name: 'goodComment', params: {id: this.good.artwork && this.good.artwork.id}});
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
      addFirst(event) {
        Vue.set(this.good, 'count', 1);
      },
      addGood(target) {
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
        let good = {
          id: this.good.id,
          name: this.good.name,
          pictures: this.good.artwork.pictures,
          src: this.good.icon,
          content: this.good.content,
          price: this.good.groupPrice,
          oldPrice: this.good.oldPrice,
          count: 1,
          icon: (this.good.icon) ? api.CONFIG.psCtx + this.good.icon + '?w=114&h=114' : api.CONFIG.defaultImg,
          checked: false
        };
        this.$store.dispatch('addPayGoods', [good]);
        // this.$router.push({name: 'pay', query: {orderType: 4}});
        window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=4';
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
          artworkId: this.good.artwork.id,
          fromCart: false
        };
        if (this.marked) {
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              this.good.artwork.collected = [];
            }
          });
          this.marked = false;
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (this.good.artwork.collected) {
              this.good.artwork.collected.push(uid);
            } else {
              this.good.artwork.collected = [uid];
            }
          }
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
        let redirect = location.href.replace('?from=singlemessage&isappinstalled=0', '');
        let uid = this.$store.getters.getUserInfo.userId;
        if (uid) {
          redirect += '?userId=' + uid;
        }
        let shareData = {
          title: this.good.name,
          desc: '团购价：¥' + this.good.groupPrice + '。「一虎一席茶席艺术平台」精品。新关注用户送百元现金券。',
          link: redirect,
          imgUrl: (this.good.pictures && (api.CONFIG.psCtx + this.good.pictures[0].id + '?w=423&h=423')) || 'http://www.yihuyixi.com/ps/download/5959aca5e4b00faa50475a18?w=423&h=423'
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      lazyload() {
        let w = window.innerWidth;
        let picImgList = [];
        let imgs = this.$refs.goodContent.getElementsByTagName('img');
        let prefix = 'http://www.yihuyixi.com';
        let html = this.good.description;
        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          let src = img.getAttribute('data-original');
          if (src) {
            let width = img.getAttribute('width');
            let height = img.getAttribute('height');
            let key = 'img class="lazy" data-original="' + src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"';
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
            src = src + '&w=750';
            html = html.replace(key, 'img src="' + src + '" width="' + w + '" style="margin-left: -14px"').replace(key2, 'img src="' + src + '" width="' + w + '" style="margin-left: -14px"');
            if (width && width > 100) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            } else if (width === null) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            }
          }
        }
        if (picImgList.length) {
          this.previewImgList = picImgList;
          this.lazyloaded = true;
          this.processing = false;
        }
        this.good.description = html;
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
        let date = new Date(time.replace(/\s/, 'T'));
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
      mix(name) {
        return mixUsername(name);
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedheader, swipe, star, frame
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
        position: relative
        height: 100%
        text-align: center
        height: 49px
        line-height: 49px
        padding-right: 8px
        box-sizing: border-box
        overflow: hidden
        .countdown_text
          font-size: 12px
          color: #fff
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
      padding: 16px 18px 15px 14px
      .title
        line-height: 17px
        margin-bottom: 2px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
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
        line-height: 18px
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
        margin-top: 5px
        font-size: 12px
        color: #666
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        top: 12px
      .buy
        position: absolute
        right: 18px
        top: 18px
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
      margin-bottom: 10px
      .title
        padding: 10px 18px 10px 14px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        font-size: 12px
        color: rgb(77, 85, 93)
        line-height: 1.3
        padding-left: 14px
        padding-right: 10px
        box-sizing: border-box
        overflow-x: hidden
    .rating
      position: relative
      .title
        line-height: 14px
        padding: 10px 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        position: relative
        padding: 0 14px
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
          padding-bottom: 10px
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
