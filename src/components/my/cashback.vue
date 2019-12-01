<template>
  <div>
    <div class="header border-bottom-1px">
      <div class="left">
        <div class="back" @click.stop.prevent="back"><i class="icon-arrow_lift"></i></div>
      </div>
      <div class="title">我的积分</div>
      <div class="right" @click.stop.prevent="detail">积分明细</div>
    </div>
    <div class="cashback" ref="cashback">
      <div class="cashback-wrapper">
        <div class="cashback-heading">
          <p class="balance-name">积分余额</p>
          <p class="balance-num"><span>{{balance}}</span></p>
        </div>
        <div class="cashback-content">
          <div class="content-title">积分有什么用？</div>
          <div class="content-text">
            <p><em>[积分当钱花]</em> 您可以使用积分来抵扣商品货款，积分足够多，就可以0元换购商品了。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import split from '@/components/split/split';
  import api from '@/api/api';
  import {mapGetters} from 'vuex';

  export default {
    activated() {
      this.show();
    },
    deactivated() {
      this.hide();
    },
    computed: {
      balance() {
        return this.user().integration || 0;
      }
    },
    methods: {
      ...mapGetters({
        user: 'userInfo'
      }),
      detail() {
        this.$router.push('/cashbackdetail');
      },
      back() {
        this.$router.back();
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      }
    },
    components: {
      fixedheader, split
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    display: flex
    padding: 0 8px
    top: 0
    width: 100%
    height: 44px
    line-height: 44px
    text-align: center
    color: #9B9B9B
    background: #f2f2f2
    box-sizing: border-box
    overflow: hidden
    z-index: 20
    .left
      width: 30px
      float: left
      margin-top: 2px
      i
        font-size: 18px
    .title
      flex: 1
      padding: 0 10px
    .right
      width: auto
      font-size: 14px
      i
        font-size: 18px
        color: #666
  .cashback
    position: absolute
    left: 0
    top: 44px
    bottom: 0
    width: 100%
    .cashback-wrapper
      position: relative
      width: 100%
      background-color: #fff
      box-sizing: border-box
      overflow: auto
      box-sizing: border-box
      -webkit-overflow-scrolling: touch
      padding-bottom: 100px
      .cashback-heading
        padding: 20px 13px
        color: #fff
        background: #e45050
        .balance-name
          font-size: 14px
          color: hsla(0,0%,100%,.7)
          vertical-align: baseline
        .balance-num
          font-size: 40px
          line-height:1
          margin-top: 5px
          .symbol
            font-weight: lighter
            font-size: 32px
            margin-right: 1px
          span
            font-weight: lighter
      .itemList
        display: flex
        width: 100%
        padding: 15px 0 0
        .item
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-right: none
          .amount
            font-size: 19px
            color: rgb(255, 95, 62)
            line-height: 1 
            margin-bottom: 2px
          .text
            padding-bottom: 5px
            line-height: 1
            font-size: 14px
            color: #666
      .cashback-content
        padding: 0 10px 13px
        color: #666
        background: #fff
        line-height: 1.83em
        .content-title
          font-weight: 700
          font-size: 15px
          color: #333
        .content-text
          font-size: 13px
          line-height: 1.83em
          p
            font-size: 13px
          em
            color: #333
            font-weight: 700
</style>

