<template>
  <div>
    <fixedheader title="您已关联的朋友"></fixedheader>
    <div class="friends">
      <div class="friends-wrap">
        <div class="friends-container" ref="friendsRef" v-show="friends.length">
          <mu-flexbox wrap="wrap" justify="space-around" :gutter="0" class="friends-list">
            <table>
              <tr>
                <th class="col-1">朋友</th>
                <th class="col-4">最近来访</th>
                <th class="col-4">首次来访</th>
                <th class="col-3">PV</th>
              </tr>
              <tr v-for="(item, index) in friends" :key="index">
                <td class="col-1"><img :src="getUserIcon(item.icon)" class="thumbnail" />{{item.nickName}}</td>
                <td class="col-4"><span v-if="item.latestTime">{{item.latestTime | formatDate}}</span></td>
                <td class="col-4"><span v-if="item.firstTime">{{item.firstTime | formatDate}}</span></td>
                <td class="col-3">{{item.pv}}</td>
              </tr>
            </table>
          </mu-flexbox>
          <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
          <div class="no-more" v-show="loadEnd">———&nbsp;&nbsp;没有更多了&nbsp;&nbsp;———</div>
        </div>
        <div class="no-friends" v-show="friends.length === 0 && !loading">———&nbsp;&nbsp;啊哦，还没有记录哦&nbsp;&nbsp;———</div>
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
  let Base64 = require('js-base64').Base64;

  export default {
    data() {
      return {
        friends: [],
        pageNumber: 1,
        pageSize: 20,
        totalPages: -1,
        loadEnd: false,
        scroller: null,
        loading: false,
        lastExec: +new Date(),
        scrollY: 0,
        winHeight: document.documentElement.clientHeight
      };
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
      this.scroller = this.$refs.friendsRef;
      window.onscroll = () => {
        this.scrollY = window.pageYOffset;
      };
    },
    methods: {
      fetchData(force) {
        if (this.totalPages > -1 && this.pageNumber > this.totalPages) {
          return;
        }
        let now = +new Date();
        if (!force && now - this.lastExec <= 50) {
          return;
        }
        this.loading = true;
        let user = this.$store.getters.getUserInfo;
        api.getYourFriends({
          currentPage: this.pageNumber,
          pageSize: this.pageSize,
          rid: user.userId || 0
        }).then(response => {
          if (response.code === 0) {
            if (response.data && response.data.length) {
              response.data.forEach(item => {
                if (item.nickName) {
                  item.nickName = Base64.decode(item.nickName);
                } else {
                  item.nickName = '匿名';
                }
                this.friends.push(item);
              });
            }
            this.totalPages = response.totalPages;
            this.pageNumber++;
            this.lastExec = +new Date();
            this.loading = false;
            this.loadEnd = this.pageNumber > this.totalPages;
          }
        }).catch(response => {
          this.loadEnd = false;
          this.loading = false;
          this.totalPages = 0;
        });
      },
      _reset() {
        this.friends = [];
        this.pageNumber = 1;
        this.totalPages = -1;
        this.loadEnd = false;
      },
      getUserIcon(icon) {
        if (!icon) {
          return 'http://www.yihuyixi.com/ps/download/5959abcae4b00faa50475a10';
        }
        return icon;
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
      loadMore() {
        this.fetchData();
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
        return formatDate(date, 'yyyy-MM-dd');
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
  .friends
    position: absolute
    top: 44px
    bottom: 0
    width: 100%
    .friends-wrap
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
      .tab
        position: relative
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
          flex: 1
          font-size: 14px
          padding: 15px 0
          text-align: center
          border-bottom: 2px solid transparent
          &.active
            color: #f15353
            border-bottom: 2px solid #f15353
      .no-more
        width: 100%
        padding: 10px 0
        color: #ccc
        text-align: center
        font-size: 12px
        margin-bottom: 10px
      .friends-container
        position: relative
        width: 100%
        padding-right: 5px
        display: flex
        flex-wrap: wrap
        overflow: auto
        box-sizing: border-box
        -webkit-overflow-scrolling: touch
        .friends-list
          position: relative
          width: 100%
        table
          position: relative
          width: 100%
          font-size: 12px
          background-color: #fff
          color: #666
          text-align: left
          tr
            display: flex
            height: 40px
            line-height: 40px
          th
            background-color: #fafafa
            font-size: 13px
          .col-1, .col-4
            flex: 1
            padding-left: 10px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            word-wrap: break-word
            word-break: break-all
            box-sizing: border-box
          .col-2
            flex: 1
            width: 135px
            padding-left: 8px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 1
            -webkit-box-orient: vertical
            word-wrap: break-word
            word-break: break-all
            box-sizing: border-box
          .col-3, .col-5
            width: 10%
            padding-left: 5px
            word-break: break-all
            overflow: hidden
            box-sizing: border-box
          .col-4
            padding-left: 5px
          .col-5
            width: 20%
          .highlight
            font-weight: 700
            color: #ff463c
          .thumbnail
            width: 32px
            height: 32px
            border-radius: 50%
            margin-right: 3px
            vertical-align: middle
            overflow: hidden
            box-sizing: border-box
      .no-friends
        width: 100%
        padding: 40px 0
        text-align: center
        font-size: 14px
        color: #ccc
        img
          width: 110px
          height: 110px
</style>
