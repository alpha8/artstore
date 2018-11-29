<template>
  <transition name="fade">
    <div v-show="isOpen && canShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <div class="main-content">
            <img class="icon" src="../../common/images/coin.png" alt="">
            <div class="text">
              <p v-if="hasLogin">{{getRandText}}哦耶，<span v-if="yourCoin">今日您获赠{{yourCoin}}枚{{getCoinName}}，</span>您的朋友因您获赠了{{coin}}枚{{getCoinName}}～</p>
              <p v-else>每天您的第一次来访，系统将赠送给您及您所访页面的这位朋友10-100枚{{getCoinName}}，{{getCoinName}}购物可抵至5折。</p>
            </div>
            <div class="coin"></div>
            <div class="footer">
              <span class="btn" v-if="hasLogin" @click.stop.prevent="doOtherAction">{{getCoinName}}:{{totalCoin}}枚</span>
              <a class="btn" v-else :href="getLoginUrl" @click="noPrompt">不再提醒</a>
              <span class="btn ok" v-if="hasLogin" @click.stop.prevent="doAction">{{btns.ok.text}}</span>
              <a class="btn ok" v-else :href="getLoginUrl" @click="noPrompt">多多益善～</a>
            </div>
          </div>
          <!-- <div class="btn-close"><i class="icon-close"></i></div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  const CONST_SHOW_ONCE = 'COIN_ACTIVITY';
  export default {
    props: {
      coin: {
        type: Number,
        default() {
          return 0;
        }
      },
      yourCoin: {
        type: Number,
        default() {
          return 0;
        }
      },
      btns: {
        type: Object,
        default() {
          return {
            ok: {
              text: '我知道了'
            },
            cancel: {
              text: '取消',
              callback: function() {
              }
            }
          };
        }
      }
    },
    data() {
      return {
        isOpen: false,
        showOnce: window.localStorage.getItem(CONST_SHOW_ONCE) || 0,
        words: [
          '心若有空山，无处不清欢。',
          '我住长江头，君住长江尾。',
          '此时情绪此时天，无事小神仙。',
          '唯有别时今不忘，暮烟疏雨过枫桥。',
          '高阁建础立丹崖，',
          '小舟轻荡春山雨，',
          '心悦君兮君不知，',
          '小苑蒲萄花满枝，',
          '横笛晚唱清音邈，',
          '桃源深处，小桥流水人家。',
          '清晨入古寺，初日照高林。',
          '敬亭白云气，秀色连苍梧。',
          '水调歌归去，洞天隐苍崖。',
          '谩将无孔笛，吹出凤游云。',
          '君住长江头，我住长江尾。'
        ]
      };
    },
    created() {
      this.showOnce = window.localStorage.getItem(CONST_SHOW_ONCE) || 0;
    },
    computed: {
      getRandText() {
        let user = this.$store.getters.getUserInfo;
        let len = this.words.length;
        let pos = Math.floor(Math.random() * len);
        return this.words[pos];
      },
      hasLogin() {
        return this.$store.getters.checkLogined;
      },
      totalCoin() {
        let profile = this.$store.getters.getUserProfile;
        return profile.wallet && profile.wallet.coinValue || 0;
      },
      canShow() {
        if (this.$store.getters.checkLogined) {
          return true;
        }
        // 一天只弹出一次
        let lastDay = this.showOnce;
        let today = (new Date().getMonth() + 1) + '-' + new Date().getDate();
        if (lastDay === today) {
          return false;
        }
        return true;
      },
      getLoginUrl() {
        let redirect = window.location.href;
        let anon = this.$store.getters.getAnonymous;
        let referee = this.$route.query.userId || 0;
        return `${api.CONFIG.wxCtx}/baseInfo?url=${escape(redirect)}&uid=${anon}&userId=${referee}`;
      },
      getCoinName() {
        let config = this.$store.getters.getCoinConfig;
        return config.name || '金币';
      }
    },
    methods: {
      show() {
        this.isOpen = true;
      },
      hide() {
        this.isOpen = false;
      },
      doAction() {
        if (this.btns.ok && this.btns.ok.callback) {
          this.btns.ok.callback();
        }
        this.isOpen = false;
      },
      doOtherAction() {
        this.isOpen = false;
      },
      noPrompt() {
        let today = (new Date().getMonth() + 1) + '-' + new Date().getDate();
        window.localStorage.setItem(CONST_SHOW_ONCE, today);
        this.isOpen = false;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: rgba(7, 17, 27, 0.6)
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      position: relative
      width: 100%
      height: 100%
      box-sizing: border-box
      overflow: auto
      -webkit-overflow-scrolling: touch
      .detail-main
        position: absolute
        top: 50%
        left: 0
        width: 100%
        height: auto
        box-sizing: border-box
        transform: translate(0, -50%)
        .main-content
          position: relative
          height: 100%
          margin: 0 50px
          background: #fff
          border-radius: 15px
          box-sizing: border-box
          .icon
            position: absolute
            top: -32px
            left: 50%
            width: 64px
            height: 64px
            margin-left: -32px
          .text
            padding: 43px 20px 6px
            font-size: 14px
            line-height: 1.4
            box-sizing: border-box
          .coin
            width: 100%
            padding-bottom: 12px
            text-align: center
            img
              width: 80px
              height: 80px
          .footer
            text-align: center
            display: flex
            overflow: hidden
            border-bottom-right-radius: 15px
            border-bottom-left-radius: 15px
            .btn
              flex: 1
              position: relative
              background: #fff
              color: #333
              text-align: center
              font-size: 14px
              height: 44px
              line-height: 44px
              &::before
                content: ""
                position: absolute
                z-index: 1
                pointer-events: none
                background-color: #e5e5e5
                height: 1px
                left: 0
                right: 0
                top: 0
              &::after
                content: ""
                position: absolute
                z-index: 1
                pointer-events: none
                background-color: #e5e5e5
                width: 1px
                top: 0
                bottom: 0
                left: 0
              &.ok
                color: #e93b3d
        .btn-close
          position: absolute
          width: 24px
          height: 24px
          border-radius: 100%
          background: #fff
          border: 1px solid #e1e1e1
          right: 38px
          top: -10px
          clear: both
          font-size: 24px
          padding: 2px
          color: #e4393c
          box-shadow: 0px 1px 20px 0px #dfdbdb
</style>
