<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix" @click="hide">
        <div class="detail-main">
          <div class="main-content">
            <img class="icon" src="../../common/images/bargain.png" alt="">
            <div class="text">{{getRandText}}</div>
            <div class="coin"><img src="../../common/images/bargain_coin.png" alt=""></div>
            <div class="footer">
              <div class="btn-group"><span>我知道了</span></div>
            </div>
          </div>
          <div class="btn-close"><i class="icon-close"></i></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      amount: {
        type: Number,
        default() {
          return 0;
        }
      }
    },
    data() {
      return {
        isOpen: false,
        words: [
          '{name}，一脚远射，把比分追成了3比3。成功帮好友砍价{amount}元。',
          '{name}获得一个任意球机会。成功帮好友砍价{amount}元。',
          '点球！点球！点球！{name}立功了。成功帮好友砍价{amount}元。',
          '{name}这一刻灵魂附体！你不是一个人在战斗，不是一个人！成功帮好友砍价{amount}元。',
          '{name}防梅西防得像跟女朋友逛街似的…手拉着手，一刻也不分离。成功帮好友砍价{amount}元。',
          '{name}打门！球~进~了！成功帮好友砍价{amount}元。',
          '詹姆斯可以扑出一次射门，两次射门，但是扑不出{name}总是射门。成功帮好友砍价{amount}元。',
          '足球场上没有上帝，如果有，就是{name}。成功帮好友砍价{amount}元。',
          '谁敢横刀立马，唯我{name}大将军。成功帮好友砍价{amount}元。',
          '{name}脚踏风火轮, 单刀直入。成功帮好友砍价{amount}元。',
          '家有鲁小胖，福寿又安康。如今当队长，进球有保障。成功帮好友砍价{amount}元。',
          '{name}长传给内马尔，哦，不。他又开始秀球技了。成功帮好友砍价{amount}元。',
          '随着守门员一声哨响, 比赛正式开始。成功帮好友砍价{amount}元。',
          '老夫聊发少年狂！献绝杀！替补又何妨！成功帮好友砍价{amount}元。',
          '{name}以迅雷不及掩耳盗铃儿响叮当仁不让世界充满爱你一万年之势，一脚怒射！成功帮好友砍价{amount}元。'
        ]
      };
    },
    computed: {
      getRandText() {
        let user = this.$store.getters.getUserInfo;
        let len = this.words.length;
        let pos = Math.floor(Math.random() * len);
        return this.words[pos].replace('{name}', user.nickName || '你').replace('{amount}', this.amount);
      }
    },
    methods: {
      show() {
        this.isOpen = true;
      },
      hide() {
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
            padding: 43px 20px 0
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
            padding: 0 15px 21px
            text-align: center
            box-sizing: border-box
            .btn-group
              display: flex
              margin: 0
              height: 35px
              line-height: 35px
              padding: 0 50px
              font-size: 14px
              text-align: center
              border-radius: 2px
              text-align: center
              span
                flex: 1
                border-radius: 5px
                background: rgba(250,180,90,0.93)
                color: #f1f1f1
                box-sizing: border-box
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
