<template>
  <div class="coin">
    <split v-show="totals > 0"></split>
    <div class="coin-wrap" v-show="totals > 0">
      <h1 class="section-title"><div class="title">我的朋友：</div><span class="more" @click.stop.prevent="toggleShow">如何获取{{getCoinName}}<i class="icon" :class="{'icon-arrow_down': !up, 'icon-arrow_up': up}"></i></span></h1>
      <div class="friends-wrap">
        <ul class="friends-list">
          <li v-for="item in items"><img :src="getUserIcon(item.icon)" width="32" height="32" alt=""></li>
          <li @click.stop.prevent="goMyCoin"><span class="total-friends">[{{totals}}人]</span></li>
        </ul>
      </div>
    </div>
    <split v-show="showGetCoin"></split>
    <div class="get-coin" v-show="showGetCoin">
      <h1 class="section-title"><div class="title">如何获取{{getCoinName}}(<b>极简</b>)：<i @click.stop.prevent="goMyCoin">[{{totalCoin}}枚]</i></div><span class="more" @click.stop.prevent="openRules">细则<i class="icon icon-question_mark"></i></span></h1>
      <div class="get-wrapper">
        <timeflow :items="flowItems"></timeflow>
        <div class="get-rules">
          <div class="pline"><span class="line-left">*</span><div class="line-right">如：100个新用户进入，您将获赠{{coinW}}枚({{coinConfig.newshare * 100 / 100}}元).</div></div>
          <div class="pline"><span class="line-left">*</span><div class="line-right">好友第一次进入商城，Ta将获赠{{getCoinName}}{{coinConfig.newuser}}枚({{coinConfig.newuser / 100}}元).</div></div>
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
          text: '新用户100枚<br/>老用户每天10枚'
        }, {
          text: '金币购物<em style="color: rgba(250,180,90,0.93);position: absolute;font-size: 20px;margin-top: -3px;">*</em><br/>可抵至5折'
        }],
        layer: {
          title: '细则',
          text: '',
          button: {
            text: '知道了!'
          }
        },
        items: [],
        totals: 0,
        showGetCoin: true,
        up: true
      };
    },
    computed: {
      totalCoin() {
        let profile = this.$store.getters.getUserProfile;
        return profile.wallet && profile.wallet.coinValue || 0;
      },
      getCoinName() {
        let config = this.$store.getters.getCoinConfig;
        let coinName = config.name || '金币';
        if (coinName !== '金币') {
          if (this.flowItems && this.flowItems.length === 3) {
            this.flowItems[1].text = `新用户${config.newshare}枚<br/>老用户每天${config.oldshare}枚`;
            this.flowItems[2].text = `${coinName}购物<em style="color: rgba(250,180,90,0.93);position: absolute;font-size: 20px;margin-top: -3px;">*</em><br/>可抵至5折`;
          }
        }
        return coinName;
      },
      coinConfig() {
        return this.$store.getters.getCoinConfig;
      },
      coinW() {
        let num = this.$store.getters.getCoinConfig.newshare * 100;
        if (num >= 10000) {
          return '1万';
        }
        return num;
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
      this.up = true;
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
            if (this.totals) {
              this.$emit('ready');
            }
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
        this.up = !this.up;
      },
      openRules() {
        let config = this.$store.getters.getCoinConfig;
        let coinName = config.name || '金币';
        this.layer.text = `<div style="display:flex;position:relative;padding-bottom: 3px;text-align:left;padding-left:3px"><span style="padding-right:3px">*</span><div style="flex:1;color:#666">1枚${coinName}等价于人民币0.01元。</div></div><div style="display:flex;position:relative;text-align:left;padding-left:3px"><span style="padding-right:3px">*</span><div style="flex:1;color:#666">在购买常规商品时，${coinName}可自动被最大化抵扣至商品原价的5折。已特惠的商品(首单特惠/拼团/秒杀/砍价/团购/拍卖)，不能用${coinName}抵扣商品价格。</div></div>`;
        this.$refs.tipsLayer.show();
      },
      hideGetArea() {
        this.showGetCoin = false;
        this.up = false;
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
      padding: 10px 13px 10px 14px
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
        color: #666
        .icon
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
      padding: 0 13px 0 14px
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
          padding-right: 9.5px
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
      padding-top: 7px
      margin-bottom: 10px
      .get-rules
        margin-top: 10px
        font-size: 14px
        padding: 0 14px
        color: #999
        .pline
          position: relative
          display: flex
          padding-bottom: 3px
          &:last-child
            padding-bottom: 0
          .line-left
            text-align: right
            padding-right: 3px
          .line-right
            flex: 1
    b
      font-weight: 700
</style>
