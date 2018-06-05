<template>
  <div>
    <fixedheader title="拼团详情" right-icon="icon-more"></fixedheader>
    <div class="tuan" ref="tuan">
      <div class="tuan_content">
        <div class="rules-wrap">
          <div class="rule-title">拼团玩法：</div>
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
              <span class="tuan_tag"><i class="icon-person"></i><em>{{tuan.limitCount}}人拼</em></span>
              <span class="tuan_newprice">¥<em>{{tuan.buttomFee}}</em></span>
            </div>
            <div class="tuan_oldprice">单买价: <del v-show="tuan.fieldPrice">{{tuan.fieldPrice | currency}}</del></div>
          </div>
        </div>
        <div class="tuan_list">
          <div class="tuan_stat" v-if="tuanData.status === 4">该团未能按时凑齐人数，拼团失败</div>
          <div class="tuan_stat" v-else-if="tuanData.status === 3">团长人气太高，已经拼团成功啦</div>
          <div class="tuan_stat">还差<span class="text-red">{{leftPerson}}人</span>拼团成功，剩余<span class="countdown"><i>{{countdownStats.days}}</i>天<i v-if="countdownStats.hours">{{countdownStats.hours}}</i>:<i v-if="countdownStats.mins">{{countdownStats.mins}}</i>:<i v-if="countdownStats.seconds">{{countdownStats.seconds}}</i></span></div>
          <ul class="tuan_users">
            <li class="user_item" v-for="(item, index) in tuanData.teamOrders" :key="index">
              <span class="tips" v-show="item.owner">团长</span>
              <img :src="getUserIcon(item.userIcon)" :class="{'leader': item.owner}" alt="">
            </li>
          </ul>
        </div>
        <div class="ops">
          <div class="btns btn-red" v-if="tuanData.owner && tuanData.status <= 2" @click.stop.prevent="wxshare"><span>邀请好友参团</span></div>
          <div class="btns btn-red" v-else-if="!tuanData.join && tuanData.status <= 2" @click.stop.prevent="joinTuan"><span>我要参团</span></div>
          <div class="btns btn-red" v-else-if="!tuanData.owner && tuanData.status >= 3" @click.stop.prevent="createTuan"><span>我也要开团</span></div>
          <div class="btns btn-red" v-else @click.stop.prevent="createTuan"><span>再开一团</span></div>
        </div>
      </div>
    </div>
    <rules ref="rules" title="拼团规则"></rules>
    <share ref="weixinShare"></share>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {countdown} from '@/common/js/date';
  import share from '@/components/tuan/share';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import rules from '@/components/tuan/rules';
  import api from '@/api/api';
  import wx from 'weixin-js-sdk';
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
        preOrderId: ''
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
        let actual = this.tuanData && this.tuanData.teamOrders && this.tuanData.teamOrders.length;
        let expected = this.tuan.limitCount;
        return expected - actual;
      },
      isTuanOwner() {
        return this.tuanData.owner;
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.tuan, {
              click: true,
              bounce: false
            });
          } else {
            this.scroll.refresh();
          }
        });
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
        api.getTuanList({
          userId: user.userId,
          preOrderId: tuanId
        }).then(response => {
          if (response.result === 0) {
            this.tuanData = response.data;
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
          this.$store.dispatch('openToast', '未登录!');
          return;
        }
        let tuanId = this.$route.query.tuanId;
        if (!tuanId) {
          return;
        }
        api.createTuanOrder({
          fieldId: this.tuan.id,
          userId: user.userId,
          id: tuanId,
          openid: user.openid,
          userName: user.nickName,
          userIcon: user.icon || ''
        }).then(response => {
          if (response.result === 0) {
            this.preOrderId = response.data.teamOrderId;
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
            window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=8';
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
          this.$store.dispatch('openToast', '未登录!');
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
            this.preOrderId = response.data.teamOrderId;
            let good = {
              id: this.tuan.id,
              name: this.tuan.name,
              pictures: this.good.pictures,
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
            window.location.href = 'http://' + location.host + location.pathname + '#/pay?orderType=8';
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
        if (this.preOrderId) {
          redirect += '?tuanId=' + this.preOrderId;
        }
        let img = api.CONFIG.psCtx + '5959aca5e4b00faa50475a18?w=423&h=423';
        if (this.tuan.icon) {
          img = api.CONFIG.psCtx + this.tuan.icon;
        }
        let user = this.$store.getters.getUserInfo;
        let vm = this;
        let tuanName = this.tuan.name;
        if (tuanName) {
          tuanName = tuanName.replace('[一虎一席]', '');
        }
        let shareData = {
          title: `${user.nickName}邀你加入${tuanName}拼团`,
          desc: `开团价：¥${this.tuan.buttomFee}, 单买价：¥${this.tuan.fieldPrice}.「一虎一席茶席艺术商城」精品.【一站式优品商城，品味脱凡】`,
          link: redirect,
          imgUrl: img,
          success: function () {
            vm.$refs.weixinShare.hideDialog();
          }
        };
        wx.ready(function() {
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
        });
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
      }
    },
    components: {
      share, fixedheader, split, rules
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .tuan
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
    .tuan_content
      position: relative
      width: 100%
      padding-bottom: 30px
      .tuan_wrap
        position: relative
        display: flex
        padding: 10px 10px
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
            margin-bottom: 3px
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
        .tuan_newprice
          color: #ff463c
          font-family: arial
          font-size: 12px
          em
            margin-left: 3px
            font-size: 18px
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
              background-color: #333333
              border-radius: 2px
              margin: 0 2px
        .tuan_users
          position: relative
          display: inline-block
          padding: 0 10px
          .user_item
            position: relative
            display: block
            float: left
            width: 50px
            height: 50px
            margin-right: 20px
            &:last-child
              margin-right: 0
            img
              width: 100%
              height: 100%
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
      padding: 0 10px
      box-sizing: border-box
</style>
