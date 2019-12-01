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
          <div class="subtitle" v-if="good.subTitle">{{good.subTitle}}</div>
          <div class="price_wrap">
            <span class="price"><em class="currency">¥</em>{{getGoodPrice}}</span>
            <span v-show="isMemberPlus && getPlusPrice" class="price_plus"><em class="currency">¥</em>{{getPlusPrice}}<em class="member"><i class="icon-diamond" />{{memberPlusInfo.name || '会员价'}}</em></span>
          </div>
          <div class="price_wrap">
            <span class="point integration"><i class="icon-database" />{{defaultPointRate * getGoodPrice}}</span>
            <span v-show="isMemberPlus && getPlusPrice" class="point_plus integration"><i class="icon-database" />{{plusPointRate * getPlusPrice}}</span></div>
          <!-- <div class="price">
            <span class="now">¥{{getGoodPrice}}</span><span class="old" v-show="good.originalPrice !== good.price">¥{{good.originalPrice}}</span>
          </div> -->
        </div>
        <split></split>
        <div class="detail_transfer" v-if="skuCount > 0">
          <div class="detail_row">
            <span class="detail_row_title">已选</span>
            <div class="detail_row_content">{{selectSku}}</div>
            <i class="icon-more" @click.stop.prevent="showSkuList"></i>
          </div>
        </div>
        <div class="detail_transfer deliveryArea">
          <div class="detail_row">
            <span class="detail_row_title">库存</span>
            <div class="detail_row_content">{{good.stock || 0}}</div>
          </div>
          <div class="detail_row" v-if="good.weight">
            <span class="detail_row_title">重量</span>
            <div class="detail_row_content">{{good.weight | filterWeight}}</div>
          </div>
        </div>
        <split v-show="good.detailHtml"></split>
        <div class="intro goodsIntroHook" v-show="good.detailHtml">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="商品介绍" name="intro">
              <div class="text" v-html="good.detailHtml" ref="goodContent" id="productIntro"></div>
            </el-tab-pane>
            <el-tab-pane label="规格参数" name="spec">
              <div class="goods_package">
                <div class="title_line">
                  <h3>包装清单</h3>
                </div>
                <div v-html="good.description"></div>
              </div>
              <div class="goods_specs" v-if="good.productAttributeValueList && good.productAttributeValueList.length">
                <div class="title_line">
                  <h3>商品参数</h3>
                </div>
                <table class="table">
                  <tr v-for="attr in good.productAttributeValueList" :key="attr.id">
                    <td>{{attr.name}}</td>
                    <td class="adjustText"><pre v-html="attr.value"></pre></td>
                  </tr>
                </table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="售后保障" name="service">
              <div class="sales_service" v-html="good.note"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-backtop target=".good-content" :bottom="55" :right="10"></el-backtop>
      </div>
      <fixedcart ref="shopcart" @add="addToCart" @fastAdd="fastConfirmOrder" :good="good"></fixedcart>
      <nicelayer ref="nicelayer" :icon="qrcode" />
    </div>
    <quietlogin />
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {mixUsername, formatDate} from '@/common/js/util';
  import cartcontrol from '@/components/cartcontrol/cartcontrol';
  import split from '@/components/split/split';
  import modalTitle from '@/components/modal-title/modal-title';
  import fixedcart from '@/components/fixedtoolbar/fixedcart';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import quietlogin from '@/components/common/quietlogin';
  import swipe from '@/components/swipe/quietswipe';
  import nicelayer from '@/components/common/nicelayer';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';

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
        good: {},
        lazyloaded: false,
        processing: false,
        previewImgList: [],
        activeName: 'intro',
        skuId: null,
        skuCount: 0,
        qrcode: api.CONFIG.qrcode
      };
    },
    computed: {
      swiperSlides() {
        var pics = this.good.albumPics && this.good.albumPics.split(',');
        if (pics && pics.length) {
          this.good.pic && pics.unshift(this.good.pic);
        } else {
          pics = [this.good.pic];
        }
        let sliders = [];
        pics.forEach(pic => {
          if (pic) {
            sliders.push({'thumbnail': `${pic}?imageView2/0/w/750/h/750`, 'src': pic});
          }
        });
        return sliders;
      },
      selectSku() {
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (!sku) {
          return `1件`;
        }
        var text = '';
        var searchSkuIdKey = '';
        sku.checkedSpec.map(item => {
          if (item) {
            text += item + ',';
            searchSkuIdKey += item + '_';
          }
        });
        if (this.good.skuStockList && this.good.skuStockList.length) {
          this.good.skuStockList.map((item, index) => {
            var txt = item.sp1 + '_';
            if (item.sp2) {
              txt += item.sp2 + '_';
            }
            if (item.sp3) {
              txt += item.sp3 + '_';
            }
            if (txt == searchSkuIdKey) {
              this.skuId = item.id;
              this.good.stock = item.stock;
              this.$set(this.good, 'skuPrice', item.price);
            }
          });
        }
        return `${text} ${this.good.count || 1}件`;
      },
      getGoodPrice() {
        if (this.good.skuPrice) {
          return this.good.skuPrice;
        }
        return this.good.price;
      },
      getFrameHeight() {
        let width = document.documentElement.clientWidth || 375;
        return width / 4 * 3;
      },
      isMemberPlus() {
        let profile = this.$store.getters.userProfile;
        let userId = this.$store.getters.userId;
        if (userId) {
          let member = profile.member;
          let defaultLevel = profile.defaultLevel;
          return member.memberLevelId != defaultLevel.id;
        }
        return false;
      },
      memberPlusInfo() {
        let profile = this.$store.getters.userProfile;
        if (this.isMemberPlus) {
          return profile.memberLevel;
        }
        return {};
      },
      defaultPointRate() {
        let profile = this.$store.getters.userProfile;
        return profile.defaultLevel && profile.defaultLevel.pointRate || 100;
      },
      plusPointRate() {
        let profile = this.$store.getters.userProfile;
        return profile.memberLevel && profile.memberLevel.pointRate || 100;
      },
      getPlusPrice() {
        return this.good.plusPrice || ''; 
      }
    },
    mounted() {
      this.scroller = this.$refs.good;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
      this.$refs.nicelayer.show();
    },
    methods: {
      fetchData() {
        let id = this.$route.params.id;
        if (!id) {
          return;
        }
        this.$store.dispatch('openLoading');
        api.GetGoodDetail(id).then(response => {
          this.good = response.data;
          this.setSkuCount();
          this.show();
          this.$store.dispatch('closeLoading');
          this.wxReady();
        }).catch(response => {
          console.log(response);
          this.$router.replace({name: 'notfound'});
          this.$store.dispatch('closeLoading');
        });
      },
      setSkuCount() {
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (sku) {
          this.skuCount = 1;
        }
      },
      processLoading() {
        if (this.good.detailHtml && !this.processing) {
          this.processing = true;
          this.lazyload();
          this.bindPictureEvent();
        }
      },
      lazyload() {
        let w = window.innerWidth;
        let picImgList = [];
        let imgs = this.$refs.goodContent && this.$refs.goodContent.getElementsByTagName('img') || [];
        let html = this.good.detailHtml;
        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          let src = img.getAttribute('src');
          if (src) {
            let key = `img class="wscnph" src="${src}"`;
            let suffix = '';
            html = html.replace(key, `img src="${src}" width="${w}"`);
            picImgList.push(src);
          }
        }
        if (picImgList.length) {
          this.previewImgList = picImgList;
          this.lazyloaded = true;
          this.processing = false;
        }
        this.$nextTick(() => {
          this.good.detailHtml = html;
        });
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
                  wx.previewImage({
                    current: pic,
                    urls: this.previewImgList
                  });
                }
            }, false);
          }
        }
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
      showSkuList() {
        this.$store.dispatch('addSku', this.good);
        this.$store.dispatch('showSkuWin', this.good);
      },
      addToCart(target) {
        let stockEmpty = false;
        if (!this.good.count) {
          this.$set(this.good, 'count', 1);
        }
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (!stockEmpty && sku) {
          this.$store.dispatch('addToCart', {
            productId: this.good.id,
            productSkuId: this.skuId,
            quantity: this.good.count
          }).then(response => {
            this._drop(target);
            this.$store.dispatch('openToast', {message: '加入购物车成功', icon: 'success'});
          }).catch(error => {
            this.$store.dispatch('openToast', {message: error || '网络开了小差，请稍候再试', icon: 'warning'});
            console.log(error);
          });
        }
      },
      fastConfirmOrder() {
        let stockEmpty = false;
        if (!this.good.count) {
          this.$set(this.good, 'count', 1);
        }
        var selected = this.$store.getters.getSelectedSku;
        var sku = selected.find(o => o.id == this.good.id);
        if (!stockEmpty && sku) {
          this.$store.dispatch('addToCart', {
            productId: this.good.id,
            productSkuId: this.skuId,
            quantity: this.good.count
          }).then(response => {
            api.addToConfirmOrder({
              productId: this.good.id,
              productSkuId: this.skuId
            }).then(response => {
              if (response.code == 200) {
                this.$router.push({name: 'pay'});
              } else {
                this.$message('网络开了小差，请稍候再试!');
              }
            });
          }).catch(error => {
            this.$store.dispatch('openToast', {message: error || '网络开了小差，请稍候再试', icon: 'warning'});
            console.log(error);
          });
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
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
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
          return id;
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
          imgs.push(this.getPicture(pics[i]));
        }
        wx.previewImage({
          current: this.getPicture(pic),
          urls: imgs
        });
      },
      viewMore() {
        this.$router.push({name: 'goodComment', params: {id: this.good.id}});
      },
      wxReady() {
        api.apiSign(encodeURIComponent(location.href.split('#')[0]))
        .then(res => {
          if (res.code != 200) {
            return;
          }
          let response = res.data;
          wx.config({
            // debug: true, // 开启调试模式
            appId: response.appId,      // 必填，公众号的唯一标识
            timestamp: response.timestamp,  // 必填，生成签名的时间戳
            nonceStr: response.nonceStr,   // 必填，生成签名的随机串
            signature: response.signature,  // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
          });
        }).catch(error => {
          console.error(error);
        });
        var redirect = location.href;
        if (api.CONFIG.profiles != 'dev') {
          redirect = 'http://' + location.host + '/wx/p/' + this.good.id;
        }
        let uid = this.$store.getters.userId;
        if (uid) {
          redirect += '?uid=' + uid;
        }
        let img = `${this.good.pic}?imageView2/0/w/423/h/423`;
        let vm = this;
        let shareData = {
          title: `${this.good.name}`,
          desc: '售价：¥' + (this.good.price) + `.「${api.CONFIG.APPNAME}」`,
          link: redirect,
          imgUrl: img,
          success: function () {
            vm.$refs.weixinShare.hideDialog();
          }
        };
        let shareData2 = {
          title: `${this.good.name}（¥${this.good.price}）`,
          desc: '售价：¥' + (this.good.price) + `.「${api.CONFIG.APPNAME}」`,
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
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      _reset() {
      }
    },
    filters: {
      formatDate(time) {
        return formatDate(time);
      },
      mix(name) {
        return mixUsername(name);
      },
      filterWeight(weight) {
        if (!weight) {
          return 0;
        }
        var kg = weight / 1000;
        if (kg) {
          return kg + 'kg';
        }
        return weight + 'g';
      }
    },
    components: {
      cartcontrol, split, fixedcart, fixedheader, swipe, modalTitle, quietlogin, nicelayer
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  @import '../../common/stylus/mixin'
  .el-backtop
    color: $color-main
  .good
    position: absolute
    top: 44px
    bottom: 50px
    width: 100%
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
      -webkit-overflow-scrolling: touch
      overflow: auto
      box-sizing: border-box
    .content
      position: relative
      padding: 12px 14px
      background-color: #fff
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
        /*! autoprefixer: off */
        -webkit-box-orient:vertical
        /*! autoprefixer: on */
      .subtitle
        color: #999
        padding: 5px 0 0
        line-height: 1.3
        position: relative
        font-size: 12px
        max-height: 46px
        overflow: hidden
      .price_wrap
        padding: 10px 10px 0 0
        height: 20px
        line-height: 20px
        vertical-align: text-bottom
        >span
          float: left
          color: #ccc
          font-weight: bold
          min-width: 30%
          max-width: 42%
          font-size: 18px
          &:nth-child(1)
            color: #ff6325
          &:nth-child(2)
            color: #666
            font-weight: bold
          &.integration
            font-size: 14px
            >i
              font-size: 10px
              padding-right: 2px
          >.currency
            font-size: 13px
            font-weight: 700
            padding-right: 2px
          .member
            font-size: 13px
            .icon-diamond
              font-size: 14px
              padding-left: 6px
              padding-right: 2px
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
        margin-top: 3px
        .now
          margin-right: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 12px
          color: rgb(147, 153, 159)
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
      .text
        font-size: 14px
        color: rgb(77, 85, 93)
        line-height: 1.3
        box-sizing: border-box
        overflow-x: hidden
        background-color: #fff
      .goods_specs, .sales_service, .goods_package
        padding: 10px 10px 30px
        font-size: 13px
        color: #848689
      .goods_package
        padding-bottom: 10px
      .title_line
        border-top: 1px solid #ddd
        text-align: center
        height: 6px
        margin: 16px 0 10px
        >h3
          display: inline-block
          font-size: 13px
          height: 13px
          line-height: 13px
          position: relative
          top: -10px
          padding: 0 20px
          background-color: #fff
      .table
        width: 100%
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
          &:first-child
            width: 85px
        .adjustText
          flex: 1
    .detail_transfer
      position: relative
      padding: 13px 0 12px
      background-color: #fff
      &.deliveryArea:before
        content: ""
        height: 0
        display: block
        border-top: 1px solid #ddd
        position: absolute
        left: 10px
        right: 0
        top: 0
      .detail_row
        position: relative
        padding: 0 40px 0 14px
        font-size: 12px
        display: flex
        align-content: center
        align-items: center
        &:not(:last-child)
          margin-bottom: 3px
        .detail_row_title
          width: 35px
          color: #999
          font-size: 12px
        .detail_row_content
          flex: 1
          font-size: 14px
          color: #333
          overflow: hidden
        .icon-more
          position: absolute
          right: 15px
          top: 50%
          margin-top: -6.5px
          font-size: 13px
          color: #666
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
</style>
