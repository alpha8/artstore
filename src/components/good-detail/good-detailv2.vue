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
            <span class="now">¥{{getGoodPrice}}</span><span class="old" v-show="good.oldPrice">¥{{good.oldPrice}}</span>
          </div>          
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addGood" :good="good"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!good.count || good.count === 0">加入购物车</div>
          </transition>
        </div>
        <!--  <div class="sku-wrap">
          <div class="sku">
            <label>数量</label>
            <span class="num-wrap">
              <cartcontrol @add="addGood" :good="good"></cartcontrol>
            </span>
          </div>
        </div> -->
        <split v-show="good.content"></split>
        <div class="info" v-show="good.content">
          <h1 class="title">商品介绍</h1>
          <div class="text" v-html="good.content" ref="goodContent" id="productIntro"></div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!--<ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="good.ratings"></ratingselect> -->
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
        <split></split>
        <modal-title title="您可能还喜欢" moreText="更多" catKey="" catName=""></modal-title>
        <channel :items="guessGoods" :cols="2"></channel>
      </div>
      <fixedcart ref="shopcart" @add="addToCart" :good="good"></fixedcart>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {mixUsername, formatDate} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedcart from '@/components/fixedtoolbar/fixedcart';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import swipe from '@/components/swipe/quietswipe';
  import star from '@/components/star/star';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

  const ALL = 3;
  // const ERR_OK = 0;

  export default {
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.hide();
    },
    data() {
      return {
        good: {},
        guessGoods: [],
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '好评',
          common: '中评',
          negative: '差评'
        },
        psCtx: api.CONFIG.psCtx,
        addedProducts: this.$store.getters.addedProducts
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
      getGoodPrice() {
        return this.good.price;
      }
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        this.$store.dispatch('openLoading');
        api.GetGood(id).then(response => {
          let good = response;
          let sid = 'p' + good.id;
          var qty = this.addedProducts && this.addedProducts[sid];
          good.count = qty || 0;
          this.good = good;
          this.wxReady();
          this.show();
          this.lazyload();
          this.$store.dispatch('closeLoading');
          this.fetchComments();
          this.getLikeGoods();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      fetchComments() {
        api.getProductComments({
          currentPage: 1,
          pageSize: 5,
          productId: this.good.id || ''
        }).then(response => {
          this.good.ratings = response.comments;
          this._initScroll();
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
        this._drop(event.target);
        this.$store.commit('ADD_QUANTITY', this.good.id);
        this.$store.dispatch('addToCart', this.good);
      },
      addGood(target) {
        this._drop(target);
      },
      addToCart(target) {
        if (!this.good.count) {
          Vue.set(this.good, 'count', 1);
        } else {
          this.good.count++;
        }
        this._drop(target);
        this.$store.commit('ADD_QUANTITY', this.good.id);
        this.$store.dispatch('addToCart', this.good);
      },
      _drop(target) {
        // 优化体验，异步执行小球下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
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
        return true;
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
      wxReady() {
        api.wxsignature(encodeURIComponent(location.href.split('#')[0])).then(response => {
          wx.config({
            // debug: true, // 开启调试模式
            appId: response.appId,      // 必填，公众号的唯一标识
            timestamp: response.timestamp,  // 必填，生成签名的时间戳
            nonceStr: response.nonceStr,   // 必填，生成签名的随机串
            signature: response.signature,  // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
          });
        });
        let shareData = {
          title: this.good.name,
          desc: '售价：¥' + this.good.price + '。「一虎一席商城」正品保证，微信专享。',
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
          let prefix = 'http://www.yihuyixi.com';
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
        return formatDate(time);
      },
      mix(name) {
        return mixUsername(name);
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedcart, fixedheader, swipe, star, modalTitle, channel
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
</style>
