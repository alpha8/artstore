<template>
  <div>
    <fixedheader title="物流查询"></fixedheader>
    <div class="expressLog" ref="expressLog">
      <div class="expressLog-wrap">
        <div class="expressLog-container" v-if="logisticsInfo">
          <div class="status">最新状态：{{deliveryStatus}} <span v-if="logisticsInfo.expName">, &nbsp;承运公司：{{logisticsInfo.expName}} <span v-if="logisticsInfo.expPhone">({{logisticsInfo.expPhone}})</span></span></div>
          <div class="expressLog-list">
            <div class="expressLog-item" v-for="(expressLog, index) in logisticsInfo.list" :key="index">
              <i></i>
              <div class="msg-box">{{expressLog.status}}</div>
              <small>{{expressLog.time}}</small>
            </div>
          </div>
        </div>
        <div class="no-expressLog" v-else>{{errorTips}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';
  import api from '@/api/api';

  export default {
    data() {
      return {
        logisticsInfo: null,
        scrollY: 0,
        errorTips: '啊哦，还没有相关记录哦'
      };
    },
    computed: {
      deliveryStatus() {
        if (this.logisticsInfo.deliverystatus == '0') {
          return '快递收件(揽件)';
        } else if (this.logisticsInfo.deliverystatus == '1') {
          return '在途中';
        } else if (this.logisticsInfo.deliverystatus == '2') {
          return ' 正在派件';
        } else if (this.logisticsInfo.deliverystatus == '3') {
          return '已签收';
        } else if (this.logisticsInfo.deliverystatus == '4') {
          return '派送失败';
        } else if (this.logisticsInfo.deliverystatus == '5') {
          return '疑难件';
        } else if (this.logisticsInfo.deliverystatus == '6') {
          return '退件签收';
        } else {
          return '未知状态';
        }
      }
    },
    activated() {
      this.fetchData(true);
      this.show();
    },
    deactivated() {
      this._reset();
      this.hide();
    },
    mounted() {
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        this.$store.dispatch('openLoading', '加载中...');
        let no = this.$route.params.no;
        let company = this.$route.query.company || '';
        api.getExpressLog({
          no: no,
          company: company 
        }).then(response => {
          if (response.code == 200) {
            if (response.data.status == '0') {
              this.logisticsInfo = response.data.result;
            } else {
              this.errorTips = `抱歉，未查询此运单${no}信息。`;
            }
          } else {
            this.errorTips = `抱歉，未查询此运单${no}信息。`;
          }
          this.$store.dispatch('closeLoading');
        }).catch(response => {
          this.$store.dispatch('closeLoading');
        });
      },
      _reset() {
        this.expressLogs = [];
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
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
      fixedheader
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
  .expressLog
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    overflow: auto
    -webkit-overflow-scrolling: touch
    .expressLog-wrap
      position: relative
      width: 100%
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
      .expressLog-container
        position: relative
        width: 100%
        padding: 5px 15px 0 38px
        font-size: 12px
        line-height: 1.5
        box-sizing: border-box
        background-color: #fff
        >.status, >.status span
          font-size: 14px
          font-weight: 700
          color: #666
        .expressLog-list
          position: relative
          .expressLog-item
            position: relative
            padding: 10px 0
            color: #999
            &:after
              content: "\20"
              display: block
              width: 1px
              height: 100%
              background: #999
              position: absolute
              left: -20px
              top: 20px
            &:first-child
              color: #333
              i
                border-color: #fb8a00
                &:after
                  background-color: #fb8a00
            &:last-child:after
              background: none
            i
              position: absolute
              left: -24px
              top: 13px
              display: block
              width: 8px
              height: 8px
              background: #fff
              border-radius: 8px
              border: 1px solid #999
              z-index: 1
              &:after
                position: absolute
                top: 50%
                left: 50%
                margin: -3px 0 0 -3px
                content: "\20"
                display: block
                width: 6px
                height: 6px
                background: #999
                border-radius: 6px
            .msg-box
              position: relative
              font-size: 13px
            small
              font-size: 11px
              color: #999
      .no-expressLog
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
</style>
