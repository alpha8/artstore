<template>
  <div>
      <frame></frame>
    <fixedheader title="砍价商品详情" right-icon="icon-more"></fixedheader>
    <div class="good" ref="good">
      <div class="good-content">
        <div class="image-header">
          <swipe :swiperSlides="swiperSlides"></swipe>
        </div>
        <div class="content">
          <h1 class="title">{{sharepay.name}}</h1>
          <div class="price">
            <span class="now">¥{{getCutPrice}}</span><span class="old" v-if="sharepay.fieldPrice !== getCutPrice">¥{{sharepay.fieldPrice}}</span>
          </div>
          <div class="row">
            <div class="label">商品底价：</div>
            <div class="desc oldPrice">{{sharepay.buttomFee | currency}}</div>
          </div>
          <div class="row">
            <div class="label">砍价优惠：</div>  
            <div class="desc fixedheight"><div class="box"><em>好友助力<strong>{{getCuttingUsers}}人 * {{sharepay.forwardFee || 0}}元</strong></em><em class="rules" @click.stop.prevent="showRules"><strong>[砍价规则]</strong></em></div></div>
          </div>
          <div>
            <div class="row">
              <div class="label">商品库存：</div>
              <div class="desc">{{sharepay.stock || 0}}</div>
            </div>
            <div class="row" v-if="good.deliveryDays">
              <div class="label">预计发货：</div>
              <div class="desc">{{good.deliveryDays}}天</div>
            </div>
          </div>
          <div class="row">
            <div class="label">优惠活动：</div>
            <div class="desc">不支持优惠券</div>
          </div>
        </div>
        <split v-if="cuttingData && cuttingData.cutInfos"></split>
        <div class="info" v-if="cuttingData && cuttingData.cutInfos">
          <h1 class="title" v-if="isOwner">好友助力砍价 <span v-if="cuttingData.leftEndTimes && cuttingData.cutOrder.status <= 2">(离优惠清零只剩: <span  class="countdownStats"><span v-if="countdownStats.days">{{countdownStats.days}}天</span><span v-if="countdownStats.hours">{{countdownStats.hours}}小时</span><span v-if="countdownStats.mins">{{countdownStats.mins}}分</span></span>)</span></h1>
          <h1 class="title" v-else>朋友获得助力 <span v-if="cuttingData.leftEndTimes && cuttingData.cutOrder.status <= 2">(离优惠清零只剩: <span  class="countdownStats"><span v-if="countdownStats.days">{{countdownStats.days}}天</span><span v-if="countdownStats.hours">{{countdownStats.hours}}小时</span><span v-if="countdownStats.mins">{{countdownStats.mins}}分</span></span>)</span></h1>
          <table class="tablist">
            <tr class="head">
              <td class="col-2" nowrap>好友名称 <span class="moreuv" v-if="cuttingData.count" @click.stop.prevent="goVisitList">[{{cuttingData.count}}人..]</span></td>
              <td class="col-4">访问时间</td>
              <td class="col-3">砍价金额</td>
            </tr>
            <tr v-if="cuttingData.enterInfo">
              <td class="col-2" nowrap><img :src="getUserIcon(cuttingData.enterInfo.userIcon)" class="thumbnail">{{getFriendlyUsername(cuttingData.enterInfo.userName)}}</td>
              <td class="col-4">{{cuttingData.enterInfo.createAt | formatDate}}</td>
              <td class="col-3 text-center">已至底价</td>
            </tr>
            <tr v-for="(item, index) in showTopTen" :key="index">
              <td class="col-2" nowrap><img :src="getUserIcon(item.userIcon)" class="thumbnail">{{getFriendlyUsername(item.userName)}}</td>
              <td class="col-4">{{item.createAt | formatDate}}</td>
              <td class="col-3 text-center">{{item.cutFee | currency}}</td>
            </tr>
          </table>
        </div>
        <split v-show="good.content"></split>
        <div class="info" v-if="good.videoUrl || (good.videos && good.videos.length)">
          <h1 class="title">商品视频</h1>
          <div class="player">
            <div id="tencent_video_player" v-if="good.videos && good.videos.length">
              <video oncontextmenu="return false;" controls="controls" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://www.yihuyixi.com/ps/download/5a4c7ceae4b065c96d6562dc" v-for="v in good.videos">
                <source :src="v.url" type="video/mp4">
              </video>
            </div>
            <div id="tencent_video_player" v-else-if="good.videoUrl">
              <video oncontextmenu="return false;" controls="controls" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" width="100%" height="100%" poster="http://www.yihuyixi.com/ps/download/5a4c7ceae4b065c96d6562dc">
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
        <split></split>
        <div class="rating">
          <h1 class="title">商品评论</h1>
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
        <split v-show="good.relates && good.relates.length"></split>
        <modal-title title="相关商品" moreText="更多" catKey="" catName="" v-show="good.relates && good.relates.length"></modal-title>
        <channel v-show="good.relates && good.relates.length" :items="good.relates || []" :cols="2" module="sharedetail" section="relatedGoods"></channel>
        <split v-show="guessGoods.length"></split>
        <modal-title title="您可能还喜欢" moreText="更多" catKey="" catName="" v-show="guessGoods.length"></modal-title>
        <channel :items="guessGoods" :cols="2" module="sharedetail" section="guessGoods"></channel>
        <split v-if="showFollow"></split>
        <modal-title title="关于「一虎一席茶席艺术商城」" catKey="" catName="" v-show="showFollow"></modal-title>
        <div v-if="showFollow" class="wx_follow">
          <img :src="wxqrcode" border="0" @click.stop.prevent="previewQrcode" />
        </div>
      </div>
      <gotop ref="top" @top="goTop" :scrollY="scrollY"></gotop>
    </div>
    <share ref="weixinShare" :needPayTips="needPayTips"></share>
    <layer :title="layer.title" :text="getQrcode" :btn="layer.button" ref="layerWin"></layer>
    <div class="fixed-foot">
      <div class="foot-wrapper">
        <div class="foot-item btn-share" v-if="isOwner && cutStatus >= 3">
          <span class="button-lg gray">{{stateDesc}}</span>
        </div>
        <div class="foot-item btn-share" v-else-if="!cuttingData.cutOrder" @click.stop.prevent="showRules">
          <span class="button-lg orange">砍价规则</span>
        </div>
        <div class="foot-item btn-share" v-else-if="isOwner" @click.stop.prevent="pay">
          <span class="button-lg orange" v-if="hasProgressOrder || GotAndPay">去付款</span>
          <span class="button-lg orange" v-else>立即购买</span>
        </div>
        <div class="foot-item btn-share" v-else-if="sharepay.status === 3">
          <span class="button-lg gray">已下架</span>
        </div>
        <div class="foot-item btn-share" v-else-if="sharepay.stock <= 0">
          <span class="button-lg gray">已售罄</span>
        </div>
        <div class="foot-item btn-share" v-else @click.stop.prevent="viewMime">
          <span class="button-lg orange">我也要砍价</span>
        </div>
        <div class="foot-item" @click.stop.prevent="reshare" v-if="isOwner && cutStatus >= 3 && sharepay.stock > 0">
          <span class="button-lg darkred">重新发起砍价</span>
        </div>
        <div class="foot-item" v-else-if="isOwner && getCutPrice <= sharepay.buttomFee">
          <span class="button-lg gray">到达底价</span>
        </div>
        <div class="foot-item" v-else-if="!isOwner && !cuttingData.cutOrder && !cuttingData.cut">
          <span class="button-lg gray" v-if="sharepay.status === 3">已下架</span>
          <span class="button-lg gray" v-else-if="sharepay.stock <= 0">已售罄</span>
          <span class="button-lg darkred" v-else :class="{'gray': getCutPrice <= sharepay.buttomFee}" @click.stop.prevent="wxshare">发起砍价</span>
        </div>
        <div class="foot-item" @click.stop.prevent="wxshare" v-else-if="isOwner || !cuttingData.cutOrder">
          <span class="button-lg darkred" :class="{'gray': getCutPrice <= sharepay.buttomFee}">好友助力砍价</span>
        </div>
        <div class="foot-item" @click.stop.prevent="wxshare" v-else>
          <span class="button-lg darkred" :class="{'gray': getCutPrice <= sharepay.buttomFee}">帮好友助力砍价</span>
        </div>
      </div>
    </div>
    <!-- 活动规则 -->
    <rules ref="rules" title="砍价活动规则"></rules>
    <bargainshow ref="bargainShow" :amount="sharepay.forwardFee" :isOwner="isOwner"></bargainshow>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {mixUsername, convertVideoUrl, reduceGoodsName} from '@/common/js/util';
  import {formatDate, countdown} from '@/common/js/date';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import channel from '@/components/channel/channel';
  import ratingselect from '@/components/ratingselect/ratingselect';
  import fixedcart from '@/components/fixedtoolbar/fixedcart';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import frame from '@/components/common/myiframe';
  import gotop from '@/components/fixedtoolbar/gotop';
  import swipe from '@/components/swipe/quietswipe';
  import star from '@/components/star/star';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  import layer from '@/components/common/layer';
  import share from '@/components/sharepay/share';
  import rules from '@/components/sharepay/rules';
  import bargainshow from '@/components/sharepay/bargainshow';
  let Base64 = require('js-base64').Base64;

  const ALL = 3;
  // const ERR_OK = 0;

  export default {
    activated() {
      this.$store.dispatch('reloadUserInfo');
      this.fetchData();
    },
    deactivated() {
      this.cuttingData = {};
      this.hasProgressOrder = false;
      this.mutex = false;
      this.good.videoUrl = '';
      this.good.videos = [];
      this.guessGoods = [];
      this.shareData = {};
      this.leftSeconds = 0;
      this.countdownStats = {};
      this.preOrderId = '';
      this.needPayTips = true;
      this.processing = false;
      this.lazyloaded = false;
      this.hide();
      this.stopTimer();
    },
    updated() {
      if (this.good.content && !this.processing) {
        this.processing = true;
        this.lazyload();
        this.bindPictureEvent();
      }
      this._initScroll();
    },
    data() {
      return {
        scrollY: 0,
        good: {},
        sharepay: {},
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
          button: {
            text: '知道了!'
          }
        },
        showFollow: true,
        wxqrcode: api.CONFIG.wxqrcode,
        prefix: '_fp',
        timer: null,
        countdownStats: {},
        leftSeconds: 0,
        cuttingData: {}, // 砍价响应信息
        mutex: false,  // 创建过一次预订单，即为true
        hasProgressOrder: false,   // 砍价订单正在进行中
        preOrderId: '',
        shareData: {},
        states: {
          0: '正在砍价',
          1: '到达底价',
          2: '等待付款',
          3: '砍价成功',
          4: '付款超时',
          5: '付款超时'
        },
        needPayTips: true,
        loopFetchLoginData: 100,
        loopTimer: null
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
            return `<img src="${api.CONFIG.cmsCtx}/qrcode/artwork?aid=${this.good.id}&userId=${uid}&type=9" border="0" width="180" height="180" style="text-align: center; margin: -7px auto; display: block;"></img>`;
          } else {
            return `<img src="${api.CONFIG.cmsCtx}/qrcode/artwork?aid=${this.good.id}&type=9" border="0" width="180" height="180" style="text-align: center; margin: -7px auto; display: block;"></img>`;
          }
        }
        return '';
      },
      getGoodPrice() {
        let user = this.$store.getters.getUserInfo;
        if (this.cuttingData.cutOrder && this.cuttingData.cutOrder.userId === user.userId) {
          return this.cuttingData.cutOrder.dealFee;
        }
        return this.sharepay.specialPrice;
      },
      getCutPrice() {
        if (this.cuttingData.cutOrder) {
          return this.cuttingData.cutOrder.dealFee;
        }
        return this.sharepay.specialPrice;
      },
      isOwner() {
        let user = this.$store.getters.getUserInfo;
        return (this.cuttingData.cutOrder && this.cuttingData.cutOrder.userId === user.userId) || false;
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
      },
      selectGoods() {
        let items = [];
        let goods = this.$store.getters.cartProducts;
        goods.forEach((product) => {
          if (product.count && product.type === this.prefix) {
            let o = {};
            Object.assign(o, product);
            items.push(o);
          }
        });
        return items;
      },
      getCuttingUsers() {
        if (this.cuttingData && this.cuttingData.cutInfos) {
          return this.cuttingData.cutInfos.length;
        }
        return 0;
      },
      showTopTen() {
        let arr = (this.cuttingData && this.cuttingData.cutInfos) || [];
        if (arr.length > 25) {
          if (this.cuttingData.enterInfo) {
            return arr.slice(0, 24);
          } else {
            return arr.slice(0, 25);
          }
        }
        return arr;
      },
      GotAndPay() {
        if (this.cuttingData) {
          return this.cuttingData.owner && (this.cuttingData.leftEndTimes <= 0 || this.cuttingData.cutOrder.status === 1);
        }
        return false;
      },
      stateDesc() {
        let status = this.cuttingData.cutOrder && this.cuttingData.cutOrder.status || 0;
        return this.states[status];
      },
      cutStatus() {
        return this.cuttingData && this.cuttingData.cutOrder && this.cuttingData.cutOrder.status || 0;
      },
      isBottomPrice() {
        let cutOrder = this.cuttingData && this.cuttingData.cutOrder;
        if (cutOrder.status === 1) {
          return true;
        } else if (cutOrder.dealFee <= cutOrder.buttomFee) {
          return true;
        }
        return false;
      }
    },
    mounted() {
      this.scroller = this.$refs.good;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      lazyStartBargain() {
        while (--this.loopFetchLoginData > 0) {
          if (this.$store.getters.checkLogined) {
            clearTimeout(this.loopTimer);
            break;
          }
          this.loopTimer = setTimeout(this.lazyStartBargain, 30);
        }
        if (this.loopFetchLoginData <= 0) {
          if (this.loopTimer) {
            clearTimeout(this.loopTimer);
          }
          if (!this.$store.getters.getUserInfo.userId) {
            this.$store.dispatch('openToast', '当前网络速度慢，正加速中，请您重新进入一次砍价页面。');
            return;
          }
        }
        if (this.$store.getters.getUserInfo.userId) {
          this.fetchCuttingData();
        }
      },
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
        api.getFirstpayGood(id, {
          type: 'sharepaydetail',
          stat: 1,
          unlogin: anon
        }).then(res => {
          let sharepay = res;
          this.sharepay = sharepay;
          if (typeof res.id === 'undefined') {
            this.$store.dispatch('closeLoading');
            this.$router.replace('/404');
            return;
          }
          api.GetGood(sharepay.artworkId).then(response => {
            let good = response;
            this.good = good;
            Object.assign(this.good, sharepay);
            this.show();
            this.processing = false;
            this.$store.dispatch('closeLoading');
            this.wxReady();
            this.lazyStartBargain();
            // this.fetchComments();
            this.getRelatedGoods();
            this.getLikeGoods();
          }).catch(response => {
            this.$store.dispatch('closeLoading');
          });
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      loadTencentPlayer() {
        if (!this.good.videoUrl) {
          return;
        }
      },
      timerLoop() {
        if (!this.leftSeconds) {
          let leftTimeMillis = this.cuttingData && this.cuttingData.leftEndTimes || 0;
          if (!leftTimeMillis) {
            return;
          }
          this.leftSeconds = leftTimeMillis / 1000;
        }
        this.leftSeconds -= 60;
        this.countdownStats = countdown(this.leftSeconds);
        if (this.leftSeconds <= 0) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.timerLoop, 60000);
      },
      stopTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (this.loopTimer) {
          clearTimeout(this.loopTimer);
        }
        this.loopFetchLoginData = 100;
      },
      showRules() {
        this.$refs.rules.showDetail();
      },
      getUserIcon(icon) {
        if (!icon) {
          return 'http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10';
        }
        return icon;
      },
      getFriendlyUsername(userName) {
        if (userName) {
          return Base64.decode(userName);
        }
        return '匿名';
      },
      viewMime() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          let shareId = this.$route.query.shareId || '';
          setTimeout(() => {
            let redirect = 'http://' + location.host + '/weixin/sp/' + this.sharepay.id + '?shareId=' + shareId;
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        this.stopTimer();
        this.preOrderId = '';
        this.updateShareData();
        api.createSharePreOrder({
          fieldId: this.sharepay.id,
          userId: user.userId,
          openid: user.openid
        }).then(response => {
          let preOrderId = response.data && response.data.preOrderId;
          if (preOrderId) {
            this.preOrderId = preOrderId;
            this.updateShareData();
          }
          if (response.code === 1005) {
            this.mutex = true;
          } else if (response.code === 2001) {
            this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
            this.mutex = true;
            return;
          } else if (response.result !== 0 || response.code) {
            this.$store.dispatch('openToast', '活动太过火爆，请稍候再来!');
            return;
          }
          this.mutex = true;
          this.firstCut();
          // 显示分享指引页
          this.$refs.weixinShare.show();
        }).catch(response => {
          this.$store.dispatch('openToast', '活动太过火爆，请稍候再来!');
          console.error(response);
        });
      },
      wxshare() {
        let cutPrice = this.cuttingData.cutOrder ? this.cuttingData.cutOrder.dealFee : this.sharepay.specialPrice;
        if (cutPrice <= this.sharepay.buttomFee) {
          return;
        }
        if (this.cuttingData.owner) {
          this.needPayTips = true;
        } else {
          this.needPayTips = false;
        }
        // 如果已经创建了砍价预订单，即跳过创建预订单，直接分享
        if (this.hasProgressOrder || (this.cuttingData && this.cuttingData.owner) || this.mutex || this.preOrderId) {
          this.$refs.weixinShare.show();
          return;
        }
        this.reshare();
      },
      reshare() {
        /** 用户已登录，创建分享预订单 */
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          this.$store.dispatch('openToast', '正在登录中...');
          let shareId = this.$route.query.shareId || '';
          setTimeout(() => {
            let redirect = 'http://' + location.host + '/weixin/sp/' + this.sharepay.id + '?shareId=' + shareId;
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        api.createSharePreOrder({
          fieldId: this.sharepay.id,
          userId: user.userId,
          openid: user.openid
        }).then(response => {
          let preOrderId = response.data && response.data.preOrderId;
          if (preOrderId) {
            this.preOrderId = preOrderId;
          }
          if (response.code === 1005) {
            this.$refs.weixinShare.show();
            this.mutex = true;
            return;
          } else if (response.code === 2001) {
            this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
            this.mutex = true;
            return;
          } else if (response.result !== 0 || response.code) {
            this.$store.dispatch('openToast', '活动太过火爆，请稍候再来!');
            return;
          }
          this.mutex = true;
          // 显示分享指引页
          this.updateShareData();
          this.firstCut();
          this.$refs.weixinShare.show();
        }).catch(response => {
          this.$store.dispatch('openToast', '活动太过火爆，请稍候再来!');
          console.error(response);
        });
      },
      fetchCuttingData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return;
        }
        let shareId = this.$route.query.shareId || '';
        this.preOrderId = shareId;
        this.updateShareData();
        api.getShareCuttings({
          userId: user.userId,
          preOrderId: shareId,
          fieldId: this.sharepay.id,
          userName: user.nickName || '匿名',
          userIcon: user.icon || ''
        }).then(response => {
          if (response.result === 0) {
            if (response.code === 2001) {
              this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
              return;
            }
            this.cuttingData = response.data;
            if (response.data.cutOrder && response.data.cutOrder.status >= 2) {
              this.hasProgressOrder = true;
            } else if (response.data.cutOrder && response.code !== 1007) {
              this.$refs.bargainShow.show();
            }
            let preOrderId = this.cuttingData && this.cuttingData.cutOrder && this.cuttingData.cutOrder.id || 0;
            if (preOrderId) {
              this.preOrderId = preOrderId;
              this.updateShareData();
            }
          }
          this._initScroll();
          this.timerLoop();
        }).catch(response => {
          console.error(response);
        });
      },
      firstCut() {
        let user = this.$store.getters.getUserInfo;
        api.getShareCuttings({
          userId: user.userId,
          preOrderId: this.preOrderId || '',
          fieldId: this.sharepay.id,
          userName: user.nickName || '匿名',
          userIcon: user.icon || ''
        }).then(response => {
          if (response.result === 0) {
            if (response.code === 2001) {
              this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
              return;
            }
            this.cuttingData = response.data;
            if (response.data.cutOrder && response.data.cutOrder.status >= 2) {
              this.hasProgressOrder = true;
            } else if (response.data.cutOrder && response.code !== 1007) {
              this.$refs.bargainShow.show();
            }
            let preOrderId = this.cuttingData && this.cuttingData.cutOrder && this.cuttingData.cutOrder.id || 0;
            if (preOrderId) {
              this.preOrderId = preOrderId;
              this.updateShareData();
            }
            if (this.cuttingData.owner) {
              this.needPayTips = true;
            } else {
              this.needPayTips = false;
            }
          }
          this._initScroll();
          this.timerLoop();
        }).catch(response => {
          console.error(response);
        });
      },
      fetchComments() {
        api.getProductComments({
          currentPage: 1,
          pageSize: 5,
          productId: this.sharepay.artworkId || ''
        }).then(response => {
          this.good.ratings = response.comments;
          this._initScroll();
        });
      },
      _initScroll() {
        // this.$nextTick(() => {
        //   if (!this.scroll) {
        //     this.scroll = new BScroll(this.$refs.good, {
        //       click: true,
        //       bounce: false,
        //       probeType: 3,
        //       preventDefaultException: {
        //         className: /(^|\s)goodsIntroHook(\s|$)/,
        //         tagName: /^(P|SPAN)$/
        //       }
        //     });
        //   } else {
        //     this.scroll.refresh();
        //   }
        //   this.scroll.on('scroll', (pos) => {
        //     let offset = Math.abs(Math.round(pos.y));
        //     if (this.scrollY !== offset) {
        //       this.scrollY = offset;
        //     }
        //   });
        // });
      },
      bindPictureEvent() {
        if (!this.previewImgList.length) {
          return;
        }
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
          pid: this.sharepay.artworkId,
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
      goVisitList() {
        this.$router.push({name: 'visitlist', query: {id: this.preOrderId}});
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
        this.$refs.layerWin.show();
      },
      addFirst(event) {
        Vue.set(this.sharepay, 'count', 1);
        this._drop(event.target);
        this.$store.commit('ADD_QUANTITY', this.prefix + this.sharepay.id);
        this.$store.dispatch('addToCart', this.sharepay);
      },
      addGood(target) {
        this._drop(target);
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
        let redirect = 'http://' + location.host + '/weixin/sp/' + this.sharepay.id;
        let img = api.CONFIG.psCtx + '5959aca5e4b00faa50475a18?w=423&h=423';
        if (this.sharepay.icon) {
          img = api.CONFIG.psCtx + this.sharepay.icon;
        } else if (this.good.pictures && this.good.pictures.length) {
          img = api.CONFIG.psCtx + this.good.pictures[0].id + '?w=423&h=423';
        }
        let user = this.$store.getters.getUserInfo;
        if (this.preOrderId) {
          redirect += '?shareId=' + this.preOrderId + '&userId=' + user.userId;
        } else {
          redirect += '?userId=' + user.userId;
        }
        let vm = this;
        this.shareData = {
          title: `[一虎一席.茶席艺术节]•[砍价至${this.sharepay.buttomFee}元] ` + reduceGoodsName(this.sharepay.name),
          desc: `砍到底：¥${this.sharepay.buttomFee}, 单买价：¥${this.sharepay.fieldPrice}.「一虎一席茶席艺术商城」精品.【一站式优品商城，品味脱凡】`,
          link: redirect,
          imgUrl: img,
          success: function () {
            vm.$refs.weixinShare.hideDialog();
          }
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(vm.shareData);
          wx.onMenuShareAppMessage(vm.shareData);
        });
      },
      updateShareData() {
        let user = this.$store.getters.getUserInfo;
        let redirect = 'http://' + location.host + '/weixin/sp/' + this.sharepay.id;
        if (this.preOrderId) {
          redirect += '?shareId=' + this.preOrderId + '&userId=' + user.userId;
        } else {
          redirect += '?userId=' + user.userId;
        }
        this.shareData.link = redirect;
      },
      lazyload() {
        let w = window.innerWidth;
        let picImgList = [];
        let imgs = this.$refs.goodContent.getElementsByTagName('img');
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
        this.good.content = html;
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      pay() {
        // let status = this.cuttingData && this.cuttingData.cutOrder && this.cuttingData.cutOrder.status || 0;
        // if (status === 2) {
        //   this.$store.dispatch('openToast', '你有一笔未付款的订单!');
        //   window.location.href = 'http://' + location.host + '/weixin/order?type=0';
        //   return;
        // }
        let good = {
          id: this.sharepay.id,
          name: this.sharepay.name,
          pictures: this.good.pictures,
          src: this.sharepay.icon,
          content: '',
          price: this.sharepay.specialPrice,
          oldPrice: this.sharepay.fieldPrice,
          count: 1,
          icon: (this.sharepay.icon) ? api.CONFIG.psCtx + this.sharepay.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
          checked: false,
          preOrderId: this.preOrderId
        };
        if (this.cuttingData && this.cuttingData.cutOrder && this.cuttingData.owner) {
          good.price = this.cuttingData.cutOrder.dealFee;
        }
        this.$store.dispatch('addPayGoods', [good]);
        // window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=9';
        window.location.href = 'http://' + location.host + '/weixin/pay?orderType=9';
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      mix(name) {
        return mixUsername(name);
      }
    },
    components: {
      cartcontrol, split, ratingselect, fixedcart, fixedheader, swipe, star, modalTitle, channel, frame, gotop, layer, share, rules, bargainshow
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
          margin-right: 6px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 15px
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
        overflow: hidden
        text-overflow: ellipsis
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
        font-size: 13px
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
      .countdownStats
        color: #f01414
      .sellpoint
        padding: 0 10px 0 14px
        font-size: 13px
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
          font-size: 12px
          &:first-child
            width: 80px
        .adjustText
          flex: 1
    .tablist
      position: relative
      width: 100%
      font-size: 12px
      background-color: #fff
      color: #666
      text-align: left
      tr
        height: 40px
        line-height: 40px
      >.head
        background-color: #fafafa
        font-size: 13px
        .col-2
          width: 135px
          padding-left: 14px
      .col-1
        width: 15%
        padding-left: 10px
        box-sizing: border-box
        span
          display: inline-block
          height: 15px
          width: 30px
          line-height: 15px
          vertical-align: middle
          text-align: center
          color: #f1f1f1
          background-color: #747474
          border-radius: 1px
          &.highlight
            background-color: #00a0dc
      .col-2
        flex: 1
        width: 135px
        padding-left: 10px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 1
        -webkit-box-orient: vertical
        word-wrap: break-word
        word-break: break-all
        box-sizing: border-box      
      .col-3
        width: 25%
        padding-left: 10px
        word-break: break-all
        overflow: hidden
        box-sizing: border-box
      .col-4
        flex: 1
        padding-left: 10px
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
        box-sizing: border-box
      .thumbnail
        width: 32px
        height: 32px
        border-radius: 50%
        margin-right: 3px
        vertical-align: middle
        overflow: hidden
        box-sizing: border-box
      .text-center
        text-align: center
      .moreuv
        font-weight: 700
        color: #07111b
    .intro
      margin-bottom: 5px
    .row
      position: relative
      display: flex
      margin-top: 5px
      color: #666
      .label
        display: block
        float: left
        font-size: 13px
      .desc
        position: relative
        flex: 1
        font-size: 13px
        &.fixedheight
          height: 13px
        &.oldPrice
          color: #07111b
          font-weight: 700
        .box
          position: relative
          display: inline-block
          width: auto
          box-sizing: border-box
          em
            display: block
            float: left
            width: auto
            &.rules
              padding-left: 6px
          strong
            font-weight: 700
            color: #07111b
          .icon-question_mark
            position: absolute
            display: block
            top: -2px
            right: 0
            color: #666
            font-size: 16px
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
          &.green
            background: #44b549
            color: #fff
          &.orange
            background: rgba(250,180,90,0.93)
            color: #fff
          &.red
            background: #ff463c
            color: #fff
          &.darkred
            background: #d05148
            color: #fff
          &.blue
            background: #00a0dc
            color: #fff
          &.gray
            background: #999
            color: #fff
          .icon-favorite
            color: #ff463c
          .line
            display:block
            font-size: 12px
            line-height: 12px
            color: #fff
            padding-top: 10px
            margin-bottom: -14px
            strong
              font-size: 18px
              font-weight: 400
              margin-left: 2px
        .input-group
          position: relative
          flex: 1
          box-sizing: border-box
          .input-group-btn
            display: block
            float: left
            width: 20%
            height: 50px
            line-height: 50px
            font-size: 26px
            background-color: rgba(250,180,90,0.93)
            color: #FFF
          .form-control
            float: left
            width: 60%
            height: 50px
            line-height: 50px
            font-size: 16px
            color: #555
            text-align: center
            background-color: #fff
            background-image: none
            border-top: 1px solid rgba(250,180,90,0.93)
            border-bottom: 1px solid rgba(250,180,90,0.93)
            -webkit-appearance: none
            border-radius: 0
            outline: none
            box-sizing: border-box
      .btn-share
        flex: none
        float: left
        width: 45%
        display: block
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
