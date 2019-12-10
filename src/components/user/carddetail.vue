<template>
  <div>
    <fixedheader title="卡券兑换"></fixedheader>
    <div class="carddetail">
      <div class="carddetail-wrap">
        <div class="card_detail">
          <div class="card_title">{{cardDetail.title}}</div>
          <div class="card_duration">有效期： {{cardDetail.createTimes | formatDate}} - {{cardDetail.expireTimes | formatDate}}</div>
          <div class="card_times">
            <div class="times_item">
              <div class="nums">{{exchangedTimes + leftTimes || 0}}</div>
              <div class="desc">总兑换次数</div>
            </div>
            <div class="times_item">
              <div class="nums">{{exchangedTimes || 0}}</div>
              <div class="desc">已兑换次数</div>
            </div>
            <div class="times_item">
              <div class="nums">{{leftTimes || 0}}</div>
              <div class="desc">剩余兑换次数</div>
            </div>
          </div>
        </div>
        <div class="carddetail-container" ref="carddetailRef" v-if="relationGoods.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="cash-list">
            <mu-flexbox-item basis="100%" class="cash-item border-1px" v-for="(item, index) in relationGoods" :key="index">
              <div class="content">
                <p class="line text" @click="goProductDetail(item)">{{item.productName}}</p>
                <p class="time">销售价：{{item.productPrice | currency}}&nbsp;&nbsp;&nbsp;&nbsp;<del>市场价：{{item.productOriginalPrice | currency}}</del></p>
              </div>
              <div class="amount">
                <el-button size="small" type="warning" plain disabled v-if="!leftTimes">兑换</el-button>
                <el-button size="small" type="warning" v-else @click="exchangeGoods(item)">兑换</el-button>
              </div>
            </mu-flexbox-item>
          </mu-flexbox>
          <div class="no-more">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-carddetail" v-else-if="!relationGoods.length && !loading">———&nbsp;&nbsp;啊哦，没有可兑换商品哦&nbsp;&nbsp;———</div>
        <gotop ref="top" @top="goTop" v-show="scrollY > winHeight"></gotop>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import gotop from '@/components/fixedtoolbar/gotop';
  import {formatDate} from '@/common/js/date';
  import api from '@/api/api';

  export default {
    data() {
      return {
        cardDetail: {},
        relationGoods: [],
        exchangedTimes: 0,
        leftTimes: 0,
        loading: true,
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
      };
    },
    activated() {
      let id = this.$route.params.id;
      if (!id) {
        this.$message.warning('非法请求');
        return;
      }
      this.fetchCardDetail(id);
      this.fetchData(id);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      this.scroller = this.$refs.carddetailRef;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchCardDetail(id) {
        api.getCardDetail(id).then(response => {
          if (response.code == 200) {
            this.cardDetail = response.data;
            if (this.cardDetail.status != 3) {
              this.exchangedTimes = 0;
              this.leftTimes = 1;
            } else {
              this.exchangedTimes = 1;
            }
          }
        });
      },
      fetchData(id) {
        this.loading = true;
        api.getCardRelationGoods(id).then(response => {
          this.loading = false;
          if (response.code == 200) {
            this.relationGoods = response.data;
          }
        }).catch(response => {
          this.loading = false;
        });
      },
      goProductDetail(item) {
        this.$router.push({ name: 'good', params: {id: item.productId}, query: {readOnly: true} });
      },
      exchangeGoods(item) {
        this.$confirm('确定兑换此商品吗？', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('setExchangedGoods', [item]);
          this.$router.replace({name: 'exchangeOrder', params: {id: this.cardDetail.id}});
        });
      },
      _reset() {
        this.relationGoods = [];
        this.cardDetail = {};
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
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
    components: {
      fixedheader, gotop
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy.MM.dd');
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .header
    position: fixed
    top: 0
    width: 100%
    height: 44px
    overflow: hidden
    z-index: 2
  .card_detail
    position: relative
    width: 100%
    padding: 10px 8px
    box-sizing: border-box
    background: #fff
    .card_title
      font-size: 18px
      font-weight: 700
      text-overflow: ellipsis
      white-space: nowrap
      overflow: hidden
    .card_duration
      font-size: 14px
      padding: 5px 0
      color: #999
    .card_times
      display: flex
      align-items: center
      align-content: center
      color: #999
      .times_item
        flex: 1
        text-align: center
        >.nums
          font-size: 20px
          font-weight: 700
          padding: 5px 0
        >.desc
          font-size: 14px
  .carddetail
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .carddetail-wrap
      position: relative
      width: 100%
      .btn-red
        background: #d05148
        color: #fff
      .btn-blue
        background: #3a77e7
        color: #fff
      .btn-green
        background: #44b549
        color: #fff
      .btn-orange
        background: #f19325
        color: #fff
      .btn-white
        background: #fff
        color: #333
        border: 1px solid #ddd
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .carddetail-container
        position: relative
        width: 100%
        display: flex
        margin-top: 15px
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .cash-list
          position: relative
          width: 100%
          padding: 10px
          box-sizing: border-box
          .cash-item
            background: #fff
            position: relative
            display: flex
            margin-bottom: 15px
            padding: 10px
            border-top: 6px solid #999
            border-bottom: 10px solid #fff
            border-radius: 6px
            box-sizing: border-box
            .content
              flex: 1
              height: 60px
              box-sizing: border-box
              overflow: hidden
              .line
                position: relative
                font-size: 14px
                line-height: 1.8
                text-overflow: ellipsis
                white-space: nowrap
                overflow: hidden
                strong
                  font-weight: 700
                &.text
                  padding-bottom: 10px
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                  font-weight: 400
                  font-size: 14px
                  line-height: 1.0625rem
              .time
                color: #666
                font-size: 12px
            .amount
              width: 80px
              height: 60px
              color: #44b549
              font-size: 14px
              font-weight: 700
              text-align: right
              &.plus
                color: #e45050
            &:last-child
              margin-bottom: 0    
      .no-carddetail
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
</style>
