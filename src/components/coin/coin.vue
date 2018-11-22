<template>
  <div class="coin">
    <split v-show="totals > 0"></split>
    <div class="coin-wrap" v-show="totals > 0">
      <h1 class="section-title dot"><div class="title">我的朋友</div><span class="more" @click.stop.prevent="toggleShow">如何获取金币</span></h1>
      <div class="friends-wrap">
        <ul class="friends-list">
          <li v-for="item in items"><img :src="getUserIcon(item.icon)" width="32" height="32" alt=""></li>
          <li @click.stop.prevent="goMyCoin"><span class="total-friends">[{{totals}}人]</span></li>
        </ul>
      </div>
    </div>
    <split v-show="showGetCoin"></split>
    <div class="get-coin" v-show="showGetCoin">
      <h1 class="section-title"><div class="title">如何使用金币(<b>极简</b>)：<i>{{totalCoin}}枚</i></div><span class="more" @click.stop.prevent="openRules">细则<i class="icon-question_mark"></i></span></h1>
      <div class="get-wrapper">
        <timeflow :items="flowItems"></timeflow>
        <div class="get-rules">
          <p>* 如：100个新用户进入，您将获赠5000枚(50元)。</p>
          <p>* 好友第一次进入商城，TA将获赠金币1000枚(10元)。</p>
        </div>
      </div>
    </div>
    <layer :title="layer.title" :text="layer.text" :btn="layer.button" ref="tipsLayer"></layer>
  </div>
</template>

<script type="text/ecmascript-6">
  import timeflow from '@/components/common/timeflow';
  import layer from '@/components/common/layer';
  import split from '@/components/split/split';
  import api from '@/api/api';
  export default {
    data() {
      return {
        flowItems: [{
          text: '分享，<br/>朋友进入'
        }, {
          text: '老用户2枚<br/>新用户50枚'
        }, {
          text: '金币购物<br/>可抵至5折'
        }],
        layer: {
          title: '金币细则',
          text: '',
          button: {
            text: '知道了!'
          }
        },
        items: [],
        totals: 0,
        showGetCoin: true
      };
    },
    computed: {
      totalCoin() {
        let profile = this.$store.getters.getUserProfile;
        return profile.wallet && profile.wallet.coinValue || 0;
      }
    },
    created() {
      this.fetchData();
    },
    activated() {
      this.fetchData();
    },
    deactivated() {
      this.items = [];
      this.totals = 0;
      this.showGetCoin = true;
    },
    methods: {
      fetchData() {
        let user = this.$store.getters.getUserInfo;
        api.getCoinList({
          userId: user.userId || -1,
          currentPage: this.pageNumber,
          pageSize: 14
        }).then(response => {
          if (response.result === 0) {
            this.items = response.data || [];
            this.totals = response.totalRecords || 0;
          }
        }).catch(response => {
          console.error(response);
        });
      },
      getUserIcon(icon) {
        if (!icon) {
          return api.CONFIG.usericon;
        }
        return icon;
      },
      goMyCoin() {
        this.$router.push('/mycoin');
      },
      toggleShow() {
        this.showGetCoin = !this.showGetCoin;
      },
      openRules() {
        this.layer.text = '<p style="text-align: left">* 1枚金币等价于人民币0.01元。</p><p style="text-align: left">* 在购买常规商品时，金币可自动被最大化抵扣至商品原价的5折。已特惠的商品(首单特惠/拼团/秒杀/砍价/团购/拍卖)，不能用金币抵扣商品价格。</p>';
        this.$refs.tipsLayer.show();
      },
      hideGetArea() {
        this.showGetCoin = false;
      }
    },
    components: {
      timeflow, layer, split
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .coin
    position: relative
    width: 100%
    background-color: #fff
    .section-title
      position: relative
      display: flex
      padding: 10px 18px 10px 14px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
      items-align: center
      >.title
        flex: 1
        overflow: hidden
        text-overflow: ellipsis
        i
          color: #666
      >.more
        display: inline-block
        .icon-question_mark
          margin-left: 1px
          color: #999
      &.dot > span
        padding-right: 3px
      &.dot:after
        position: absolute
        display: block
        width: 8px
        height: 8px
        content: ""
        border-top: 1px solid #666
        border-left: 1px solid #666
        -webkit-transform-origin: 50%
        transform-origin: 50%
        -webkit-transform: rotate(135deg)
        transform: rotate(135deg)
        top: 50%
        right: 13px
        margin-top: -4px
    .friends-wrap
      position: relative
      padding: 0 14px
      .friends-list
        position: relative
        display: block
        width: 100%
        min-height: 40px
        max-height: 80px
        overflow: hidden
        li
          float: left
          height: 35px
          padding-right: 10px
          padding-bottom: 5px
          img
            border-radius: 50%
            vertical-align: middle
            overflow: hidden
          .total-friends
            color: #666
            height: 35px
            line-height: 35px
            font-size: 14px
  .get-coin
    position: relative
    display: block
    width: 100%
    .get-wrapper
      flex: 1
      padding-top: 9px
      margin-bottom: 10px
      .get-rules
        margin-top: 8px
        font-size: 14px
        padding: 0 14px
        color: #999
        p
          padding-bottom: 3px
          &:last-child
            padding-bottom: 0
    b
      font-weight: 700
</style>
