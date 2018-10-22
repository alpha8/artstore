<template>
  <div>
    <fixedheader title="拼团详情" right-icon="icon-more"></fixedheader>
    <div class="tuan" ref="tuan">
      <div class="tuan_content">
        <div class="rules-wrap">
          <div class="rule-title">"拼团" 简介：</div>
          <div class="rule-button" @click.stop.prevent="showDetail">规则</div>
          <div class="rule-flow">
            <div class="flow-item">
              <i class="icon-tuan"></i>
              <div class="text">开团/参团</div>
            </div>
            <div class="flow-item">
              <i class="icon-dancers"></i>
              <div class="text">邀请好友</div>
            </div>
            <div class="flow-item">
              <i class="icon-express_vehicle"></i>
              <div class="text">满员发货<br>(不满自动退款)</div>
            </div>
          </div>
        </div>
        <div class="tuan_wrap" @click.stop.prevent="goTuanDetail">
          <div class="tuan_icon">
            <img :src="tuanIcon" alt="" class="thumbnail">
          </div>
          <div class="tuan_info">
            <div class="tuan_name">{{tuan.name}}</div>
            <div class="price-wrap">
              <!-- <span class="tuan_tag"><i class="icon-person"></i><em>{{tuan.limitCount}}人拼</em></span> -->
              <span class="tuan_newprice">¥<em>{{tuan.buttomFee}}</em><del class="tuan_oldPrice" v-show="tuan.fieldPrice">{{tuan.fieldPrice | currency}}</del><span class="tuanPerson">({{tuan.limitCount}}人拼)</span></span>
            </div>
            <!-- <div class="tuan_oldprice">单买价: <del v-show="tuan.fieldPrice">{{tuan.fieldPrice | currency}}</del></div> -->
            <div class="btn_detail">商品详情</div>
          </div>
        </div>
        <div class="tuan_list">
          <div class="tuan_stat" v-if="tuanData.status === 4">该团未能按时凑齐人数，拼团失败</div>
          <div class="tuan_stat" v-else-if="tuanData.status === 3">团长人气太高，已经拼团成功啦</div>
          <div class="tuan_stat">限时<span class="text-red">{{leftPerson}}人</span>拼团，剩余<span class="countdown"><i>{{countdownStats.days}}</i>天<i v-if="countdownStats.hours">{{countdownStats.hours}}</i>:<i v-if="countdownStats.mins">{{countdownStats.mins}}</i>:<i v-if="countdownStats.seconds">{{countdownStats.seconds}}</i></span></div>
          <ul class="tuan_users">
            <li class="user_item" v-for="(item, index) in tuanData.teamOrders" :key="index" v-show="item.owner || item.status === 3">
              <span class="tips" v-show="item.owner">团长</span>
              <img :src="getUserIcon(item.userIcon)" :class="{'leader': item.owner}" alt="">
              <div class="text"><em>{{getFriendlyUsername(item.userName)}}</em></div>
            </li>
          </ul>
        </div>
        <div class="ops">
          <div class="btns btn-gray" v-if="tuan.status === 3"><span>已下架</span></div>
          <div class="btns btn-gray" v-else-if="tuan.stock <= 0"><span>已售罄</span></div>
          <div class="btns btn-gray" v-else-if="tuan.leftEndTimes <= 0"><span>拼团已结束</span></div>
          <div class="btns btn-red" v-else-if="(tuanData.owner && tuanData.status <= 2)" @click.stop.prevent="wxshare"><span>邀请好友参团</span></div>
          <div class="btns btn-red" v-else-if="!tuanData.join && tuanData.status <= 2" @click.stop.prevent="joinTuan"><span>我要参团</span></div>
          <div class="btns btn-red" v-else-if="!tuanData.owner && tuanData.status >= 3" @click.stop.prevent="createTuan"><span>我也要开团</span></div>
          <div class="btns btn-red" v-else @click.stop.prevent="createTuan"><span>我要开团</span></div>
        </div>
        <split></split>
        <modal-title title="关于「一虎一席茶生活美学商城」" catKey="" catName=""></modal-title>
        <div class="wx_follow">
          <img :src="wxqrcode" border="0" @click.stop.prevent="previewQrcode" />
        </div>
      </div>
    </div>
    <rules ref="rules" title="拼团规则"></rules>
    <!-- <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="tipsLayer"></layer> -->
    <nicelayer :text="layer.text" ref="tipsLayer"></nicelayer>
    <share ref="weixinShare"></share>
    <frame></frame>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll';
  import {reduceGoodsName} from '@/common/js/util';
  import {countdown} from '@/common/js/date';
  import share from '@/components/tuan/share';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import rules from '@/components/tuan/rules';
  import frame from '@/components/common/myiframe';
  import modalTitle from '@/components/modal-title/modal-title';
  import layer from '@/components/common/layer';
  import nicelayer from '@/components/common/nicelayer';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
  let Base64 = require('js-base64').Base64;

  export default {
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.stopTimer();
      this.hide();
      this.cleanup();
    },
    data() {
      return {
        tuan: {},
        tuanData: {},
        countdownStats: {},
        timer: null,
        preOrderId: '',
        shareData: {},
        wxqrcode: api.CONFIG.wxqrcode,
        layer: {
          title: '温馨提示',
          text: '',
          button: {
            text: '知道了!'
          }
        }
      };
    },
    computed: {
      tuanIcon() {
        if (this.tuan.icon) {
          return api.CONFIG.psCtx + this.tuan.icon + '?w=750&h=500';
        } else {
          return api.CONFIG.defaultImg;
        }
      },
      tuanStatus() {
        let orders = this.tuanData && this.tuanData.teamOrders;
        if (orders && orders.length) {
          return orders[0].status;
        }
        return 0;
      },
      leftPerson() {
        let actual = 0;
        let orders = this.tuanData.teamOrders || [];
        orders.forEach(item => {
          if (item.owner || item.status === 3) {
            actual++;
          }
        });
        let expected = this.tuan.limitCount;
        return expected - actual;
      },
      isTuanOwner() {
        return this.tuanData.owner;
      }
    },
    mounted() {
      this.scroller = this.$refs.tuan;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      _initScroll() {
        // this.$nextTick(() => {
        //   if (!this.scroll) {
        //     this.scroll = new BScroll(this.$refs.tuan, {
        //       click: true,
        //       bounce: false
        //     });
        //   } else {
        //     this.scroll.refresh();
        //   }
        // });
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
          type: 'sharetuan',
          stat: 1,
          unlogin: anon
        }).then(res => {
          this.tuan = res;
          this.show();
          this.wxReady();
          this.$store.dispatch('closeLoading');
          this.timerLoop();
          this.fetchTuanData();
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      fetchTuanData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return;
        }
        let tuanId = this.$route.query.tuanId || '';
        this.preOrderId = tuanId;
        this.updateShareData();
        api.getTuanList({
          userId: user.userId,
          preOrderId: tuanId,
          fieldId: this.tuan.id
        }).then(response => {
          if (response.data) {
            if (response.code === 2001) {
              this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
              return;
            }
            this.tuanData = response.data;
            let preOrderId = this.tuanData && this.tuanData.order && this.tuanData.order.id || 0;
            if (preOrderId) {
              this.preOrderId = preOrderId;
              this.updateShareData();
            }
          }
          this._initScroll();
        }).catch(response => {
          console.error(response);
        });
      },
      timerLoop() {
        if (this.tuan.leftEndTimes < 0) {
          return;
        }
        this.tuan.leftEndTimes -= 1000;
        this.countdownStats = countdown(this.tuan.leftEndTimes / 1000);
        if (this.tuan.leftEndTimes <= 0) {
          this.countdownStats = {
            days: 0,
            hours: '00',
            mins: '00',
            seconds: '00',
            milliseconds: 0
          };
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.timerLoop, 1000);
      },
      stopTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      cleanup() {
        this.countdownStats = {};
        this.tuanData = {};
        this.preOrderId = '';
        this.shareData = {};
      },
      getFriendlyUsername(userName) {
        if (userName) {
          return Base64.decode(userName);
        }
        return '匿名';
      },
      previewQrcode() {
        wx.previewImage({
          current: this.wxqrcode,
          urls: [this.wxqrcode]
        });
      },
      goTuanDetail() {
        let tuanId = this.$route.query.tuanId;
        this.$router.push({name: 'tuandetail', params: {id: this.tuan.id}, query: {tuanId: tuanId}});
      },
      getUserIcon(icon) {
        if (icon) {
          return icon;
        } else {
          return 'http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10';
        }
      },
      joinTuan() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          let tuanId = this.$route.query.tuanId || '';
          setTimeout(() => {
            let redirect = 'http://' + location.host + '/weixin/tuan/' + this.tuan.id + '?tuanId=' + tuanId;
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        let tuanId = this.$route.query.tuanId || '';
        api.createTuanOrder({
          fieldId: this.tuan.id,
          userId: user.userId,
          id: tuanId,
          openid: user.openid,
          userName: user.nickName,
          userIcon: user.icon || ''
        }).then(response => {
          if (response.result === 0) {
            if (response.code === 2001) {
              this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
              return;
            }
            let preOrderId = response.data.infoOrderId;
            let good = {
              id: this.tuan.id,
              name: this.tuan.name,
              pictures: [this.tuan.icon],
              src: this.tuan.icon,
              content: '',
              price: this.tuan.buttomFee,
              oldPrice: this.tuan.fieldPrice,
              count: 1,
              icon: (this.tuan.icon) ? api.CONFIG.psCtx + this.tuan.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
              checked: false,
              preOrderId: preOrderId
            };
            this.$store.dispatch('addPayGoods', [good]);
            // window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=8';
            window.location.href = 'http://' + location.host + '/weixin/pay?orderType=8';
          } else if (response.code === 2001) {
            this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
            console.log(response);
          } else if (response.code === 1006) {
            this.$store.dispatch('openToast', '拼团已结束!');
            console.log(response);
          } else if (response.code === 1005) {
            this.$store.dispatch('openToast', '你有一单未完成的订单，请前往「个人中心」→「我的拼团」查看!');
            console.log(response);
          } else if (response.code === 2005) {
            let leftTimes = this.$store.getters.getUserProfile.cutTimes && this.$store.getters.getUserProfile.cutTimes.dicTuan || 0;
            this.layer.text = `<p style="text-align:left">您 “开团或参团” 的权益配额合计为 [每周${leftTimes}次], 本周已用完。您下周可继续 “拼团” 购物。</p>`;
            this.$refs.tipsLayer.show();
          } else {
            this.$store.dispatch('openToast', '活动太过火爆,请稍候再来!');
            console.error(response);
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '活动太过火爆,请稍候再来!');
          console.error(response);
        });
      },
      createTuan() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          let tuanId = this.$route.query.tuanId || '';
          setTimeout(() => {
            let redirect = 'http://' + location.host + '/weixin/tuan/' + this.tuan.id + '?tuanId=' + tuanId;
            window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
          }, 1500);
          return;
        }
        api.createTuanOrder({
          fieldId: this.tuan.id,
          userId: user.userId,
          id: '',
          openid: user.openid,
          userName: user.nickName,
          userIcon: user.icon || ''
        }).then(response => {
          if (response.result === 0) {
            if (response.code === 2001) {
              this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
              return;
            }
            this.preOrderId = response.data.infoOrderId;
            this.updateShareData();
            let good = {
              id: this.tuan.id,
              name: this.tuan.name,
              pictures: [this.tuan.icon],
              src: this.tuan.icon,
              content: '',
              price: this.tuan.buttomFee,
              oldPrice: this.tuan.fieldPrice,
              count: 1,
              icon: (this.tuan.icon) ? api.CONFIG.psCtx + this.tuan.icon + '?w=750&h=500' : api.CONFIG.defaultImg,
              checked: false,
              preOrderId: this.preOrderId
            };
            this.$store.dispatch('addPayGoods', [good]);
            window.location.href = 'http://' + location.host + '/weixin/pay?orderType=8';
          } else if (response.code === 2001) {
            this.$store.dispatch('openToast', '太火爆了，商品已售罄!');
            console.log(response);
          } else if (response.code === 1006) {
            this.$store.dispatch('openToast', '拼团已结束!');
            console.log(response);
          } else if (response.code === 1005) {
            this.$store.dispatch('openToast', '你有一单未完成的订单，请前往「个人中心」→「我的拼团」查看!');
            console.log(response);
          } else if (response.code === 2005) {
            let leftTimes = this.$store.getters.getUserProfile.cutTimes && this.$store.getters.getUserProfile.cutTimes.dicTuan || 0;
            this.layer.text = `<p style="text-align:left">您 “开团或参团” 的权益配额合计为 [每周${leftTimes}次], 本周已用完。您下周可继续 “拼团” 购物。</p>`;
            this.$refs.tipsLayer.show();
          } else {
            this.$store.dispatch('openToast', '活动太过火爆,请稍候再来!');
            console.error(response);
          }
        }).catch(response => {
          this.$store.dispatch('openToast', '活动太过火爆,请稍候再来!');
          console.error(response);
        });
      },
      wxshare() {
        this.$refs.weixinShare.show();
      },
      goOrder() {
        window.location.href = 'http://' + location.host + '/weixin/order?type=0';
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
        let redirect = 'http://' + location.host + '/weixin/tuan/' + this.tuan.id;
        let img = api.CONFIG.psCtx + '5959aca5e4b00faa50475a18?w=423&h=423';
        if (this.tuan.icon) {
          img = api.CONFIG.psCtx + this.tuan.icon;
        }
        let user = this.$store.getters.getUserInfo;
        if (this.preOrderId) {
          redirect += '?tuanId=' + this.preOrderId + '&userId=' + user.userId;
        } else {
          redirect += '?userId=' + user.userId;
        }
        let vm = this;
        this.shareData = {
          title: `[一虎一席.茶席艺术节]•[拼团.${this.tuan.buttomFee}元] ` + reduceGoodsName(this.tuan.name),
          desc: `拼团价：¥${this.tuan.buttomFee}, 单买价：¥${this.tuan.fieldPrice}.「一虎一席茶生活美学商城」精品.【一站式优品商城，品味脱凡】`,
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
        let redirect = 'http://' + location.host + '/weixin/tuan/' + this.tuan.id;
        if (this.preOrderId) {
          redirect += '?tuanId=' + this.preOrderId + '&userId=' + user.userId;
        } else {
          redirect += '?userId=' + user.userId;
        }
        this.shareData.link = redirect;
      },
      showDetail() {
        this.$refs.rules.showDetail();
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
        this._initScroll();
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      share, fixedheader, split, rules, frame, modalTitle, layer, nicelayer
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .tuan
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)      
    .wx_follow
      position: relative
      width: 100%
      height: auto
      overflow: hidden
      img
        position: relative
        width: 100%
        height: auto
    .tuan_content
      position: relative
      width: 100%
      padding-bottom: 30px
      overflow: auto
      -webkit-overflow-scrolling: touch
      background-color: #fff
      .tuan_wrap
        position: relative
        display: flex
        padding: 12px 10px 10px
        box-sizing: border-box
        .tuan_icon
          position: relative
          display: block
          width: 105px
          float: left
          overflow: hidden
          img
            width: 100%
            height: auto
            overflow: hidden
        .tuan_info
          position: relative
          flex: 1
          padding-left: 8px
          box-sizing: border-box
          .tuan_name
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            word-wrap: break-word
            word-break: break-all
            font-size: 14px
            line-height: 1.2
            height: 34px
            padding-top: 2px
          .btn_detail
            position: absolute
            right: 0
            bottom: 3px
            z-index: 10
            height: 24px
            line-height: 24px
            padding: 0 12px
            box-sizing: border-box
            font-size: 12px
            border-radius: 12px
            color: #fff
            background: #d05148
        .tuan_tag
          position: relative
          display: inline-block
          color: #ff463c
          height: 16px
          font-size: 0
          padding-right: 5px
          margin-right: 10px
          vertical-align: bottom
          box-sizing: border-box
          &::after
            content: ""
            display: block
            border: 1px solid #ff463c
            position: absolute
            top: 0
            left: 0
            pointer-events: none
            -webkit-transform: scale(.5);
            -webkit-transform-origin: 0 0;
            bottom: -100%;
            right: -100%;
            border-color: #ff463c
            border-radius: 3px
          i
            display: inline-block
            font-size: 16px
            padding-right: 2px
          em
            display: inline-block
            font-size: 12px
            padding-top: 2px
            vertical-align: top
            box-sizing: border-box
        .price-wrap
          position: absolute
          display: flex
          width: 100%
          bottom: 3px
        .tuan_newprice
          color: #ff463c
          font-family: arial
          font-size: 12px
          em
            margin-left: 3px
            font-size: 18px
          .tuan_oldPrice
            margin-left: 7px
            font-size: 12px
            color: rgb(147, 153, 159)
          .tuanPerson
            font-size: 13px
            margin-left: 8px
            color: #666
            font-weight: 700
        .tuan_oldprice
          position: relative
          font-size: 12px
          color: #7f7f7f
          padding-top: 5px
        .tuan_countdown
          position: absolute
          right: 0
          top: 0
          bottom: 0
          width: 120px
          text-align: center
          small
            display: block
            font-size: 12px
            height: 17px
            line-height: 17px
            color: #cf2c01
            margin-top: 4px
          span
            display: block
            font-size: 12px
            color: #cf2c01
            i
              display: inline-block
              width: 19px
              height: 24px
              line-height: 24px
              text-align: center
              color: #fff
              font-size: 12px
              background-color: #fc8117
              border-radius: 2px
              margin: 0 2px
      .tuan_list
        position: relative
        width: 100%
        padding: 15px 0 5px
        text-align: center
        box-sizing: border-box
        .tuan_stat
          padding-bottom: 10px
          font-size: 13px
          .countdown
            display: inline-block
            font-size: 12px
            i
              display: inline-block
              width: 19px
              height: 24px
              line-height: 24px
              text-align: center
              color: #fff
              font-size: 12px
              background:#e4393c
              border-radius: 2px
              margin: 0 2px
        .tuan_users
          position: relative
          display: inline-block
          padding: 3px 10px
          .user_item
            position: relative
            display: block
            float: left
            min-width: 50px
            max-width: 65px
            height: 70px
            margin-right: 15px
            &:last-child
              margin-right: 0
            img
              width: 50px
              height: 50px
              border-radius: 100%
              border: 1px solid transparent
              &.leader
                border: 1px solid #E93B3D
            .tips
              position: absolute
              display: block
              top: -4px
              left: 50%
              background: #E93B3D
              color: #fff
              border-radius: 20px
              font-size: 10px
              width: 30px
              margin-left: -15px
              padding: 2px
              text-align: center
            .text
              position: relative
              display: block
              width: 100%
              font-size: 12px
              text-align: center
              line-height: 1.3
              em
                margin: 0 auto
                position: relative
                text-align: center
                overflow: hidden
                display: -webkit-box
                word-wrap: break-word
                word-break: break-all
                text-overflow: ellipsis
                -webkit-line-clamp: 1
                -webkit-box-orient: vertical
                max-width: 100%
      .rules-wrap
        position: relative
        width: 100%
        background: #e45050
        padding-bottom: 15px
        .rule-title
          width: 100%
          font-size: 14px
          padding: 10px
          color: #eee
          box-sizing: border-box
        .rule-button
          width: 36px
          height: 30px
          line-height: 30px
          position: absolute
          top: 0
          right: 10px
          border-bottom-left-radius: 18px
          border-bottom-right-radius: 18px
          background: #e4c017
          color: #a17400
          font-size: 11px
          text-align: center
        .rule-flow
          position: relative
          display: flex
          .flow-item
            position: relative
            flex: 1
            text-align: center
            color: #eee
            &:not(:first-child)::after
              display: block
              position: absolute
              width: 50px
              height: 2px
              border-top: 1px dashed #eee
              top: 50%
              left: -25px
              margin-top: -10px
              content: ' '
            i
              display: block
              font-size: 36px
              padding: 10px 15px
            .text
              font-size: 14px
    .ops
      position: relative
      width: 100%
      padding: 0 10px 3px
      box-sizing: border-box
      .btns
        margin-top: 0
</style>
