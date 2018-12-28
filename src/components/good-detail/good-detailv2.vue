<template>
  <div>
    <fixedheader title="商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
        </div>
        <div class="content">
          <h1 class="title">{{good.name}}</h1>
          <div class="price">
            <span class="now">¥{{getGoodPrice}}</span><span class="old" v-show="good.oldPrice && good.oldPrice !== good.price">¥{{good.oldPrice}}</span>
          </div>
          <div v-if="good.stock && (good.stock.total > 0 || good.stock.status !== 1)">
            <div class="row">
              <div class="label">商品库存：</div>
              <div class="desc">{{good.stock && good.stock.total || 0}}</div>
            </div>
            <div class="row" v-if="good.deliveryDays">
              <div class="label">预计发货：</div>
              <div class="desc">{{good.deliveryDays}}天</div>
            </div>
          </div>
          <div v-if="good.stock && good.stock.total <= 0 && good.stock.status === 1">
            <div class="row">
              <div class="label">预订库存：</div>
              <div class="desc">{{good.stock && good.stock.bookTotal || 0}}</div>
            </div>
            <div class="row highlight">
              <div class="label">预计到货：</div>
              <div class="desc">{{good.stock && good.stock.bookDay || 0}}天</div>
            </div>
          </div>
          <div class="row">
            <div class="label">优惠活动：</div>
            <div class="desc" v-if="good.useCoupon">优惠券可抵<span v-if="good.couponPercent">{{good.couponPercent * 100}}%</span><span v-if="!good.couponPercent">30%</span><span>，金币50%</span><i class="icon icon-exclamation_mark2" @click.stop.prevent="openRules"></i></div>
            <div class="desc" v-else>不支持优惠券</div>
          </div>
          <div class="cartcontrol-wrapper" v-if="good.count">
            <cartcontrol @add="addGood" :good="good"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-if="good.stock && (good.stock.total > 0 || good.stock.bookTotal > 0) && !good.count">加入购物车</div>
          </transition>
        </div>
        <coin ref="coin"></coin>
        <split v-show="good.content"></split>
        <div class="info" v-if="good.videoUrl || (good.videos && good.videos.length)">
          <h1 class="title">商品视频</h1>
          <div class="player">
            <div id="tencent_video_player" v-if="good.videos && good.videos.length">
              <video oncontextmenu="return false;" controls="controls" loop="loop" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://www.yihuyixi.com/ps/download/5a4c7ceae4b065c96d6562dc" v-for="v in good.videos">
                <source :src="v.url" type="video/mp4">
              </video>
            </div>
            <div id="tencent_video_player" v-else-if="good.videoUrl">
              <video oncontextmenu="return false;" controls="controls" loop="loop" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://www.yihuyixi.com/ps/download/5a4c7ceae4b065c96d6562dc">
                <source :src="good.videoUrl" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
        <split v-if="good.videoUrl"></split>
        <div class="intro goodsIntroHook" v-show="good.content">
          <h1 class="title">商品介绍<span class="toolbar" @click.stop.prevent="showQrcode"><i class="icon-qrcode"></i></span></h1>
          <div class="sellpoint" v-if="good.sellPoint">{{good.sellPoint}}</div>
          <div class="text" v-html="good.content" ref="goodContent" id="productIntro"></div>
        </div>
        <split v-if="good.parameter"></split>
        <div class="info goodsIntroHook" v-if="good.parameter">
          <h1 class="title">商品参数</h1>
          <div class="text">
            <table class="table">
              <tr v-for="p in good.parameter" v-if="p.value">
                <td>{{p.text}}</td>
                <td class="adjustText"><pre v-html="p.value"></pre></td>
              </tr>
            </table>
          </div>
        </div>
        <split v-if="good.ratings && good.ratings.length"></split>
        <div class="rating" v-if="good.ratings && good.ratings.length">
          <h1 class="title">商品评论</h1>
          <!--<ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="good.ratings"></ratingselect> -->
          <div class="rating-wrapper">
            <ul>
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
        <split v-show="good.relates && good.relates.length"></split>
        <modal-title title="相关商品" moreText="更多" catKey="" catName="" v-show="good.relates && good.relates.length"></modal-title>
        <channel v-show="good.relates && good.relates.length" :items="good.relates || []" :cols="2" module="productdetail" section="relatedGoods"></channel>
        <split v-show="guessGoods.length"></split>
        <modal-title title="您可能还喜欢" moreText="更多" catKey="" catName="" v-show="guessGoods.length"></modal-title>
        <channel :items="guessGoods" :cols="2" module="productdetail" section="guessGoods"></channel>
        <split v-if="showFollow"></split>
        <modal-title title="关于「一虎一席茶生活美学商城」" catKey="" catName="" v-show="showFollow"></modal-title>
        <div v-if="showFollow" class="wx_follow">
          <img :src="wxqrcode" border="0" @click.stop.prevent="previewQrcode" />
        </div>
      </div>
      <fixedcart ref="shopcart" @add="addToCart" :good="good" @share="wxshare"></fixedcart>
      <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
    </div>
    <layer :title="layer.title" :text="getQrcode" :btn="layer.button" ref="layerWin"></layer>

    <layer title="金币使用细则" :text="layer.text" :btn="layer.button" ref="tipsLayer"></layer>
    <share ref="weixinShare"></share>
    <quietlogin></quietlogin>
    <coinshow :coin="coins.coin" :yourCoin="coins.yourCoin" ref="coinShow"></coinshow>
    <poster ref="poster"></poster>    
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {mixUsername, formatDate, convertVideoUrl, reduceGoodsName} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedcart from '@/components/fixedtoolbar/fixedcart';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import quietlogin from '@/components/common/quietlogin';
  import gotop from '@/components/fixedtoolbar/gotop';
  import swipe from '@/components/swipe/quietswipe';
  import star from '@/components/star/star';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  import layer from '@/components/common/layer';
  import share from '@/components/coin/share';
  import coin from '@/components/coin/coin';
  import coinshow from '@/components/coin/coinshow';
  import poster from '@/components/common/poster';

  const ALL = 3;
  // const ERR_OK = 0;

  export default {
    activated() {
      this.fetchData();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    created() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.fetchData();
      this.loadUserProfile();
    },
    beforeDestroy() {
      this._reset();
      this.hide();
    },
    watch: {
      $route (to, from) {
        if (to.name === from.name && to.name === 'good') {
          if (to.params.id !== from.params.id) {
            this._reset();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.fetchData();
          }
        }
      }
    },
    updated() {
      this.processLoading();
    },
    data() {
      return {
        scrollY: 0,
        good: {},
        lazyloaded: false,
        processing: false,
        previewImgList: [],
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
        addedProducts: this.$store.getters.addedProducts,
        layer: {
          title: '快速检索，扫码定位商品',
          text: '',
          button: {
            text: '知道了!'
          }
        },
        showFollow: true,
        wxqrcode: api.CONFIG.wxqrcode,
        coins: {
          coin: 0,
          yourCoin: 0
        }
      };
    },
    computed: {
      swiperSlides() {
        let pics = this.good.pictures || [];
        let sliders = [];
        pics.forEach(pic => {
          if (pic) {
            if (pic.width < pic.height || pic.height / pic.width <= 1) {
              sliders.push({'thumbnail': api.CONFIG.psCtx + pic.id + '?w=750&h=500&v=v2', 'src': api.CONFIG.psCtx + pic.id});
            } else {
              sliders.push({'thumbnail': api.CONFIG.psCtx + pic.id + '?w=750&h=500', 'src': api.CONFIG.psCtx + pic.id});
            }
          } else {
            sliders.push({'thumbnail': api.CONFIG.defaultImg, 'src': api.CONFIG.defaultImg});
          }
        });
        return sliders;
      },
      getQrcode() {
        if (this.good.id) {
          let uid = this.$store.getters.getUserInfo.userId;
          if (uid) {
            return `<img src="${api.CONFIG.cmsCtx}/qrcode/artwork?aid=${this.good.id}&userId=${uid}" border="0" width="180" height="180" style="text-align: center; margin: -7px auto; display: block;"></img>`;
          } else {
            return `<img src="${api.CONFIG.cmsCtx}/qrcode/artwork?aid=${this.good.id}" border="0" width="180" height="180" style="text-align: center; margin: -7px auto; display: block;"></img>`;
          }
        }
        return '';
      },
      getGoodPrice() {
        return this.good.price;
      },
      getFrameHeight() {
        let width = document.documentElement.clientWidth || 375;
        return width / 4 * 3;
      },
      getVideoUrl() {
        let url = this.good.videoUrl;
        if (url) {
          return convertVideoUrl(`http://${url}`);
        } else {
          return 'about: blank';
        }
      }
    },
    mounted() {
      this.scroller = this.$refs.good;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        if (!id) {
          return;
        }
        this.$store.dispatch('openLoading');
        let user = this.$store.getters.getUserInfo;
        let anon = '';
        if (!user.userId) {
          anon = this.$store.getters.getAnonymous;
        }
        api.GetGoodDetail(id, {
          type: 'productdetail',
          stat: 1,
          unlogin: anon
        }).then(response => {
          let good = response;
          let sid = 'p' + good.id;
          var qty = this.addedProducts && this.addedProducts[sid];
          good.count = qty || 0;
          this.good = good;
          this.show();
          this.processing = false;
          // this.loadTencentPlayer();
          this.$store.dispatch('closeLoading');
          this.wxReady();
          // this.processLoading();
          this.getRelatedGoods();
          // this.fetchComments();
          this.getLikeGoods();
          this.getCoin();
          // this.getWXFollow();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
          this.$router.replace('/404');
        });
      },
      processLoading() {
        if (this.good.content && !this.processing) {
          this.processing = true;
          this.lazyload();
          this.bindPictureEvent();
        }
        this._initScroll();
      },
      openRules() {
        let config = this.$store.getters.getCoinConfig;
        let coinName = config.name || '金币';
        this.layer.text = `<div style="display:flex;position:relative;padding-bottom: 3px;text-align:left;padding-left:3px"><span style="padding-right:3px">*</span><div style="flex:1;color:#666">1枚${coinName}等价于人民币0.01元。</div></div><div style="display:flex;position:relative;text-align:left;padding-left:3px"><span style="padding-right:3px">*</span><div style="flex:1;color:#666">在购买常规商品时，${coinName}可自动被最大化<span style="text-decoration:underline">抵扣至商品原价的5折</span>。已特惠的商品(首单特惠/拼团/秒杀/砍价/团购/拍卖)，不能用${coinName}抵扣商品价格。</div></div>`;
        this.$refs.tipsLayer.show();
      },
      loadTencentPlayer() {
        if (!this.good.videoUrl) {
          return;
        }
      },
      wxshare() {
        this.$refs.weixinShare.show();
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
      },
      bindPictureEvent() {
        if (!this.previewImgList.length) {
          return;
        }
        if (this.lazyloaded) {
          let imgs = this.$refs.goodContent && this.$refs.goodContent.getElementsByTagName('img') || [];
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
          pageSize: 12,
          keyword: kw,
          categoryParentName: cat || '',
          pid: this.good.id,
          commodityStatesId: 2,
          scoreSort: true
        }).then((response) => {
          let list = response.artworks;
          this.removeDups(list, this.good.relates || []);
          this.guessGoods = list;
          setTimeout(() => {
            this._initScroll();
          }, 800);
        });
      },
      getRelatedGoods() {
        let ids = [];
        if (this.good.relates && this.good.relates.length) {
          this.good.relates.forEach((item) => {
            ids.push(item.id);
          });
        }
        if (!ids.length) {
          return;
        }
        api.GetRelatedGoods({
          relatedid: ids.join(',')
        }).then((response) => {
          this.good.relates = response || [];
          setTimeout(() => {
            this._initScroll();
          }, 800);
        });
      },
      removeDups(goods, relates) {
        if (!goods.length || !relates.length) {
          return;
        }
        for (let i = 0; i < goods.length; i++) {
          let good = goods[i];
          relates.forEach((item) => {
            if (good.id === item.id) {
              goods.splice(i, 1);
              i--;
            }
          });
        }
      },
      getWXFollow() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.showFollow = true;
          return;
        }
        api.getUserProfile(user.userId || 0).then(response => {
          if (response.result === 0 && response.user) {
            this.showFollow = (response.user.follow === 0 || response.user.follow === 2);
          }
        }).catch(response => {
          console.error(response);
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
      showQrcode() {
        // this.$refs.layerWin.show();
        if (this.good.id) {
          var qrcode = `${api.CONFIG.cmsCtx}/qrcode/artwork?aid=${this.good.id}&size=180&margin=0`;
          let uid = this.$store.getters.getUserInfo.userId;
          if (uid) {
            qrcode += `&userId=${uid}`;
          }
          this.$refs.poster.drawPoster(this.good, qrcode);
          this.$refs.poster.show();
        }
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
        let stockEmpty = false;
        if (!this.good.count) {
          Vue.set(this.good, 'count', 1);
        } else {
          let stock = this.good.stock && this.good.stock.total || 0;
          let bookStock = this.good.stock && this.good.stock.bookTotal || 0;
          let total = stock + bookStock;
          if (this.good.count >= total) {
            this.$store.dispatch('openToast', '超过当前库存数了哦!');
            stockEmpty = true;
          } else {
            this.good.count++;
          }
        }
        if (!stockEmpty) {
          this._drop(target);
          this.$store.commit('ADD_QUANTITY', this.good.id);
          this.$store.dispatch('addToCart', this.good);
        }
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
      previewQrcode() {
        wx.previewImage({
          current: this.wxqrcode,
          urls: [this.wxqrcode]
        });
      },
      viewMore() {
        this.$router.push({name: 'goodComment', params: {id: this.good.id}});
      },
      getThumbnailPic(item) {
        let pic = item.pictures;
        if (pic && pic.length) {
          return api.CONFIG.psCtx + pic[0].id + '?w=750&h=500';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      favorited(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        let ids = good.collected || [];
        for (let i = 0, len = ids.length; i < len; i++) {
          if (uid === ids[i]) {
            good.marked = true;
            return 'icon-favorite';
          }
        }
        good.marked = false;
        return 'icon-heart';
      },
      mark(good) {
        let uid = this.$store.getters.getUserInfo.userId;
        if (!uid) {
          this.$store.dispatch('openToast', '请先登录！');
          return;
        }
        let params = {
          userId: uid,
          type: 1,
          artworkId: good.id,
          price: good.price,
          name: good.name,
          icons: good.pictures,
          fromCart: false
        };
        if (good.marked) {
          delete params.name;
          delete params.icons;
          delete params.price;
          // 已关注，再次点击取消关注
          api.unmark(params).then(response => {
            if (response.result === 0) {
              good.collected = [];
            }
          });
          good.marked = false;
          return;
        }
        api.mark(params).then(response => {
          if (response.result === 0) {
            if (good.collected) {
              good.collected.push(uid);
            } else {
              good.collected = [uid];
            }
            good.marked = true;
          }
        });
        this.favorited(good);
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
        let redirect = 'http://' + location.host + '/weixin/g/' + this.good.id;
        let uid = this.$store.getters.getUserInfo.userId;
        if (uid) {
          redirect += '?userId=' + uid;
        }
        let img = api.CONFIG.psCtx + '5959aca5e4b00faa50475a18?w=423&h=423';
        if (this.good.wxicon) {
          img = api.CONFIG.psCtx + this.good.wxicon;
        } else if (this.good.pictures && this.good.pictures.length) {
          img = api.CONFIG.psCtx + this.good.pictures[0].id + '?w=423&h=423';
        }
        let vm = this;
        let shareData = {
          title: `${this.good.name}`,
          desc: '售价：¥' + (this.good.activityPrice || this.good.markPrice) + '.「一虎一席茶生活美学商城」精品.【一站式优品商城，品味脱凡】',
          link: redirect,
          imgUrl: img,
          success: function () {
            vm.$refs.weixinShare.hideDialog();
          }
        };
        let shareData2 = {
          title: `${this.good.name}（¥${this.good.activityPrice || this.good.markPrice}）`,
          desc: '售价：¥' + (this.good.activityPrice || this.good.markPrice) + '.「一虎一席茶生活美学商城」精品.【一站式优品商城，品味脱凡】',
          link: redirect,
          imgUrl: img,
          success: function () {
            vm.$refs.weixinShare.hideDialog();
          }
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData2);
          wx.onMenuShareAppMessage(shareData);
        });
      },
      lazyload() {
        let w = window.innerWidth;
        let picImgList = [];
        let imgs = this.$refs.goodContent && this.$refs.goodContent.getElementsByTagName('img') || [];
        let prefix = api.CONFIG.cdnCtx;
        let html = this.good.content;
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
            } else {
              src = src.replace('http://www.yihuyixi.com', prefix);
            }
            if (src.lastIndexOf('?') < 0) {
              src += '?1';
            }
            src = src + '&w=750';
            html = html.replace(key, 'img src="' + src + '" width="' + w + '" style="margin-left: -14px; margin-bottom: 3px;"').replace(key2, 'img src="' + src + '" width="' + w + '" style="margin-left: -14px; margin-bottom: 3px;"');
            if (width && width > 100) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            } else if (width === null) {
              picImgList.push(src.substring(0, src.lastIndexOf('?')));
            }
          } else {
            if (!picImgList.length) {
              return;
            }
            let pic = img.getAttribute('src');
            let width = img.getAttribute('width');
            let height = img.getAttribute('height');
            let suffix = '';
            if (width) {
              suffix += ' width="' + width + '"';
            }
            if (height) {
              suffix += ' height="' + height + '"';
            }
            let p1 = suffix + ' alt="" src="' + pic + '"';
            let p2 = suffix + ' src="' + pic + '"';
            if (pic.indexOf('http:') < 0) {
              pic = prefix + pic;
            } else {
              pic = pic.replace('http://www.yihuyixi.com', prefix);
            }
            if (pic.lastIndexOf('?') < 0) {
              pic += '?1';
            }
            pic = pic + '&w=750';
            html = html.replace(p1, ' src="' + pic + '" width="' + w + '" style="margin-left: -14px; margin-bottom: 3px;"').replace(p2, 'img src="' + pic + '" width="' + w + '" style="margin-left: -14px; margin-bottom: 3px;"');
            if (width && width > 100) {
              picImgList.push(pic.substring(0, pic.lastIndexOf('?')));
            } else if (width === null) {
              picImgList.push(pic.substring(0, pic.lastIndexOf('?')));
            }
          }
        }
        if (picImgList.length) {
          this.previewImgList = picImgList;
          this.lazyloaded = true;
          this.processing = false;
        }
        this.$nextTick(() => {
          this.good.content = html;
        });
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      _reset() {
        this.good.videoUrl = '';
        this.good.videos = [];
        this.guessGoods = [];
        this.processing = false;
        this.lazyloaded = false;
        this.coins = {
          coin: 0,
          yourCoin: 0
        };
      },
      getCoin() {
        // this.$refs.coin.hideGetArea();
        let user = this.$store.getters.getUserInfo;
        let isAutoLogin = window.sessionStorage.getItem('quiet_login') || false;
        if (!user.userId && isAutoLogin) {
          this.$refs.coinShow.show();
          return;
        }
        let referee = this.$route.query.userId || 0;
        if (!referee) {
          return;
        }
        api.getCoin({
          userId: referee,
          friendId: user.userId,
          nickName: user.nickName,
          icon: user.icon,
          type: 'product'
        }).then(response => {
          if (response.result === 0) {
            let data = response.data;
            let older = {code: data.oldsharecode, count: data.oldsharecount};
            let friends = {code: data.newsharecode, count: data.newsharecount};
            let your = {code: data.newusercode, count: data.newusercount};
            if (older.code) {
              // 老用户
              this.coins.coin = older.count || 0;
              this.$refs.coinShow.show();
              this.loadUserProfile();
              this.$refs.coin.fetchData();
            } else if (your.code || friends.code) {
              // 新用户
              this.coins.coin = friends.count || 0;
              this.coins.yourCoin = your.count || 0;
              this.$refs.coinShow.show();
              this.loadUserProfile();
              this.$refs.coin.fetchData();
            }
          }
        }).catch(response => {
          console.error(response);
        });
      },
      loadUserProfile() {
        let user = this.$store.getters.getUserInfo;
        api.getProfile({
          userId: user.userId || 0
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('updateUserProfile', response);
          }
        }).catch(response => {
          console.error(response);
        });
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
      cartcontrol, split, ratingselect, fixedcart, fixedheader, swipe, star, modalTitle, channel, quietlogin, gotop, layer, share, coin, coinshow, poster
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
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      .swiper-container
        height: auto
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
      padding-bottom: 80px
      overflow: auto
      -webkit-overflow-scrolling: touch
      .channel
        display: flex
        flex-wrap: wrap
        margin-left: 5px
        .chanel-item
          position: relative
          width: 33.3%
          height: auto
          vertical-align: top
          box-sizing: border-box
          padding-bottom: 10px
          &.p50
            width: 50%
            .item-img img
              width: 48vw
              height: auto
          &.p100
            width: 100%
            .item-img img
              width: 100%
              height: auto
          .item-img
            position: relative
            width: 100%
            min-height: 102px
            overflow: hidden
            img
              width: 31.5vw
              height: auto
          .item-info
            position: relative
            width: 100%
            padding-right: 40px
            box-sizing: border-box
            h3
              line-height: 1.5
              height: 20px
              font-size: 14px
              overflow: hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-line-clamp: 1
              -webkit-box-orient: vertical
            .price
              margin-top: 1px
              color: #ff463c
              font-size: 14px
              font-weight: 700
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
            .icon
              position: absolute
              top: 50%
              margin-top: -20px
              right: 0
              width: 40px
              height: 40px
              line-height: 40px
              text-align: center
              font-size: 20px
              box-sizing: border-box
              .icon-favorite
                color: #ff463c
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
      .detail
        margin: 5px 0 0
        font-size: 0
        .stock, .rating, .follower
          font-size: 10px
          color: rgb(147, 153, 159)
        .stock
          display: inline-block
          font-size: 12px
      .price
        font-weight: 700
        line-height: 18px
        .now
          margin-right: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 12px
          color: rgb(147, 153, 159)
      .delivery-annouce
        font-size: 12px
        color: rgb(147, 153, 159)
        margin: 2px 0 0
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        top: 50%
        margin-top: -16px
      .buy
        position: absolute
        right: 12px
        top: 50%
        margin-top: -12px
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
          color: #666
        span
          position: relative
          display: inline-block
          vertical-align: bottom
    .info, .intro
      position: relative
      margin-bottom: 10px
      .title
        position: relative
        padding: 10px 18px 10px 14px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        background-color: #fff
        .toolbar
          position: absolute
          display: inline-block
          right: 0
          top: 0
          width: auto
          height: 34px
          line-height: 34px
          padding-right: 8px
          box-sizing: border-box
          i
            font-size: 20px
            vertical-align: middle
            color: #666
      .text, .player
        font-size: 14px
        color: rgb(77, 85, 93)
        line-height: 1.3
        box-sizing: border-box
        overflow-x: hidden
        background-color: #fff
      #tencent_video_player
        width: 100%
        height: auto
        overflow: hidden
        video
          object-fit: cover
      .text
        padding-left: 14px
        padding-right: 10px
      .sellpoint
        padding: 0 10px 0 14px
        font-size: 14px
        color: #4d555d
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        line-height: 1.3
        -webkit-box-orient: vertical
      .zoompic
        margin-left: -14px
      .table
        width: 100%
        max-width: 100%
        order-spacing: 0
        border-collapse: collapse
        border-bottom: solid 1px #e7e7e7
        border-left: solid 1px #e7e7e7
        word-wrap: break-word
        word-break: break-all
        tr
          display: flex
        td, th
          border-top: solid 1px #e7e7e7
          border-right: solid 1px #e7e7e7
          padding: 10px 5px 10px 8px
          color: #848689
          font-size: 13px
          &:first-child
            width: 75px
        .adjustText
          flex: 1
    .intro
      margin-bottom: 5px
    .row
      position: relative
      display: flex
      margin-top: 5px
      color: #666
      &.highlight
        color: #07111b
        .label, .desc
          font-weight: 700
      .label
        display: block
        float: left
        font-size: 13px
      .desc
        position: relative
        flex: 1
        font-size: 13px
        oveflow: hidden
        .icon-exclamation_mark2
          display: inline-block
          margin-top: -3px
          padding-left: 5px
          font-size: 13px
          color: #999
          vertical-align: middle
    .rating
      position: relative
      .title
        line-height: 14px
        padding: 10px 14px
        font-size: 14px
        color: rgb(7, 17, 27)
        background-color: #fff
      .rating-wrapper
        position: relative
        padding: 0 14px
        background-color: #fff
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
    .wx_follow
      position: relative
      width: 100%
      height: auto
      overflow: hidden
      img
        position: relative
        width: 100%
        height: auto
</style>
