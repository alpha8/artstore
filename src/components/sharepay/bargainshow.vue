<template>
  <transition name="fade">
    <div v-show="isOpen" class="detail">
      <div class="detail-wrapper clearfix" @click="hide">
        <div class="detail-main">
          <div class="main-content">
            <img class="icon" src="../../common/images/bargain.png" alt="">
            <div class="text">
              <p>{{getRandText}}</p>
              <p v-show="showTips" class="tips">请记得将本商品页面转发，这样您的朋友们才能看到并进入帮您轻松砍价。</p>
            </div>
            <div class="coin" v-show="!showTips"><img src="../../common/images/bargain_coin.png" alt=""></div>
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
      },
      isOwner: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showTips: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        isOpen: false,
        words: [
          '心若有空山，无处不清欢。{name}成功帮好友砍价{amount}元～',
          '我住长江头，君住长江尾。{name}成功帮好友砍价{amount}元～',
          '有福同享，拔刀相助。{name}成功帮好友砍价{amount}元～',
          '此时情绪此时天，无事小神仙。{name}成功帮好友砍价{amount}元～',
          '唯有别时今不忘，暮烟疏雨过枫桥。{name}成功帮好友砍价{amount}元～',
          '高阁建础立丹崖，{name}成功帮好友砍价{amount}元～',
          '小舟轻荡春山雨，{name}成功帮好友砍价{amount}元～',
          '心悦君兮君不知，{name}成功帮好友砍价{amount}元～',
          '小苑蒲萄花满枝，{name}成功帮好友砍价{amount}元～',
          '横笛晚唱清音邈，{name}成功帮好友砍价{amount}元～',
          '桃源深处，小桥流水人家。{name}成功帮好友砍价{amount}元～',
          '清晨入古寺，初日照高林。{name}成功帮好友砍价{amount}元～',
          '敬亭白云气，秀色连苍梧。{name}成功帮好友砍价{amount}元～',
          '水调歌归去，洞天隐苍崖。{name}成功帮好友砍价{amount}元～',
          '谩将无孔笛，吹出凤游云。{name}成功帮好友砍价{amount}元～',
          '君住长江头，我住长江尾。{name}成功帮好友砍价{amount}元～'
        ]
      };
    },
    computed: {
      getRandText() {
        let user = this.$store.getters.getUserInfo;
        let len = this.words.length;
        let pos = Math.floor(Math.random() * len);
        if (this.isOwner) {
          return this.words[pos].replace('{name}', user.nickName || '你').replace('{amount}', this.amount).replace('帮好友', '');
        }
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
            padding: 43px 20px 3px
            font-size: 14px
            line-height: 1.4
            box-sizing: border-box
          .tips
            padding-top: 8px
            padding-bottom: 12px
          .coin
            width: 100%
            padding-bottom: 12px
            text-align: center
            img
              width: 80px
              height: 80px
          .footer
            padding: 2px 15px 23px
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
