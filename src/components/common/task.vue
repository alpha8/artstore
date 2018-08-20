<template>
  <div v-show="showDialog && isShow">
    <transition name="move">
      <div class="task" ref="task">        
        <div class="task-wrapper">
          <div class="header-wrapper">
            <div class="box">
              <div class="box-container">
                <div class="avatar">
                  <img :src="getUserIcon" alt="" class="pic">
                  <span class="vipflag" v-if="userExt.model === 2">代理商</span>
                </div>
                <div class="line">
                  <div class="userName"><span class="svip" :class="getVipIcon"></span>{{user().nickName}}
                    <div class="info" v-if="userExt.spreadLevel"><span class="vip" :class="getSVipIcon">{{getSVipTitle}}</span><span class="userflag" @click.stop.prevent="goYourFriends">[朋友:{{userExt.friendCount}}]</span><span class="userflag" @click.stop.prevent="goYourBuyers">[买家:{{userExt.friendOrderCount}}]</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tasks-wrapper">
            <div class="title border-1px">
              <b>待办事项:</b> (您可前往「个人中心」查看)
            </div>
            <div class="task-list">
              <div class="task-item border-1px" v-for='(todo, index) in todos' :key="index" v-show="hasData(todo.key)" @click.stop.prevent="goUrl(todo.link)">
                <i :class="todo.icon"></i>
                <span class="task-text">
                  <div class="task-name">{{todo.text}}</div>
                  <div class="task-desc">{{todo.desc}}</div>
                </span>
                <span class="task-ops"><i class="icon-keyboard_arrow_right"></i></span>
              </div>
            </div>
          </div>
          <div class="task-footer">
            <div class="btns"><span class="btn-red" @click.stop.prevent="hideDialog">我知道了</span></div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="todo-mask"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {mapGetters} from 'vuex';
  import api from '@/api/api';
  const CONST_SHOW_ONCE = 'SHOW_ONCE';

  export default {
    data() {
      return {
        userExt: {},
        profile: {},
        todos: [
          { key: 'unpayCount', icon: 'icon-pending_payment', text: '待付款订单', desc: '您有待付款的订单，点击可前往', link: '/order?type=0' },
          { key: 'teamCount', icon: 'icon-tuan', text: '正在拼团订单', desc: '您有正在进行中的拼团，点击可前往', link: '/mytuan' },
          { key: 'cutCount', icon: 'icon-cutingprice', text: '正在砍价订单', desc: '您有正在进行中的砍价，点击可前往', link: '/myshare' }
        ],
        stats: {},
        isShow: true,
        showOnce: window.localStorage.getItem(CONST_SHOW_ONCE) || 0
      };
    },
    watch: {
      $route (to, from) {
        if (from && to && from.name !== to.name) {
          let canShownPages = ['home', 'good', 'auctiondetail', 'seckillDetail', 'groupbuyDetail', 'articledetail', 'firstdetail', 'sharedetail', 'tuandetail', 'sharetuan'];
          let found = canShownPages.find(page => page === to.name);
          if (found) {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
        } else {
          this.isShow = false;
        }
        this.showOnce = window.localStorage.getItem(CONST_SHOW_ONCE) || 0;
      }
    },
    activated() {
      this.refreshData();
      setTimeout(() => {
        this.getTodoList();
      }, 1500);
    },
    deactivated() {
      this.isShow = false;
      this.stats = {};
    },
    mounted() {
      this.refreshData();
      setTimeout(() => {
        this.getTodoList();
      }, 1500);
    },
    computed: {
      showDialog() {
        // 一天只弹出一次
        let lastDay = this.showOnce;
        let today = (new Date().getMonth() + 1) + '-' + new Date().getDate();
        if (lastDay === today) {
          return false;
        }
        if (this.stats.total) {
          return true;
        }
        return false;
      },
      getVipTitle() {
        let agentLevel = {'lv0': '初级', 'lv1': '皇冠一星', 'lv2': '皇冠二星', 'lv3': '皇冠三星', 'lv4': '皇冠四星', 'lv5': '皇冠五星'};
        let level = this.userExt.level || 'lv0';
        if (this.userExt.model === 1) {
          // 初级用户
          return agentLevel[level];
        } else if (this.userExt.model === 2) {
          // 代理商
          return agentLevel[level];
        } else {
          return agentLevel[level];
        }
      },
      getVipIcon() {
        return this.userExt.level || 'lv0';
      },
      getSVipIcon() {
        return this.userExt.spreadLevel || 'lv1';
      },
      getSVipTitle() {
        let agentLevel = {'lv1': '皇冠一星', 'lv2': '皇冠二星', 'lv3': '皇冠三星', 'lv4': '皇冠四星', 'lv5': '皇冠五星'};
        let level = this.userExt.spreadLevel || 'lv1';
        if (this.userExt.model === 1) {
          // 初级用户
          return agentLevel[level];
        } else if (this.userExt.model === 2) {
          // 代理商
          return agentLevel[level];
        } else {
          return agentLevel[level];
        }
      },
      getUserIcon() {
        let user = this.$store.getters.getUserInfo;
        if (user && user.icon) {
          return user.icon;
        }
        return this.profile.user && this.profile.user.icon;
      }
    },
    updated() {
      this._initScroll();
    },
    methods: {
      ...mapGetters({
        hasLogin: 'checkLogined',
        user: 'getUserInfo'
      }),
      refreshData() {
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return;
        }
        api.getProfile({
          userId: user.userId
        }).then(response => {
          if (response.result === 0) {
            this.$store.dispatch('updateUserProfile', response);
            this.userExt = response.user || {};
            this.profile = response;
          }
          this._initScroll();
        }).catch(response => {
          console.error(response);
        });
      },
      getTodoList() {
        // 一天只弹出一次
        // let lastDay = this.showOnce;
        // let today = (new Date().getMonth() + 1) + '-' + new Date().getDate();
        // if (lastDay === today) {
        //   return;
        // }
        let user = this.$store.getters.getUserInfo;
        if (!user.userId) {
          return;
        }
        api.getTodoList(user.userId, {
          front: true
        }).then(response => {
          if (response.result === 0) {
            this.stats = response.data;
            this.$store.dispatch('updateAppCache', {'TodoList': {
              data: this.stats
            }});
          }
        }).catch(response => {
          console.error(response);
        });
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.task, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hasData(type) {
        return (this.stats[type] || 0) > 0;
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
      },
      goYourFriends() {
        this.$router.push({name: 'yourfriends'});
      },
      goYourBuyers() {
        this.$router.push({name: 'yourbuyers'});
      },
      hideDialog() {
        this.isShow = false;
        this.showOnce = (new Date().getMonth() + 1) + '-' + new Date().getDate();
        window.localStorage.setItem(CONST_SHOW_ONCE, this.showOnce);
      },
      goUrl(link) {
        this.$router.push(link);
        this.hideDialog();
      }
    },
    components: {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .task
    position: fixed
    left: 0
    top: auto
    bottom: 0
    width: 100%
    z-index: 99
    max-height: 500px
    background: #fff
    transform: translate3d(0, 0, 0)
    overflow: hidden
    &.move-enter-active, &.move-leave-active
      transform: translate3d(0, 0, 0)
      transition: all 0.5s
    &.move-enter, &.move-leave-active
      transform: translate3d(0, 100%, 0)
  .header-wrapper
    position: relative
    width: 100%
    padding: 10px
    background-color: #fff
    box-sizing: border-box
    overflow: hidden
    .box
      padding: 30px 0
      border-radius: 6px
      font-size: 12px
      color: #fff
      background: -webkit-linear-gradient(left,#eb3c3c,#ff7459)
      background: linear-gradient(90deg,#eb3c3c,#ff7459)
      box-shadow: 0 2px 4px rgba(228,57,60,.4)
      .box-container
        display: flex
        -webkit-box-align: center
        align-items: center
        padding: 0 15px
        .avatar
          position: relative
          margin-right: 7px
          width: 60px
          height: 60px
          border: 1px solid hsla(0,0%,100%,.4)
          border-radius: 60px
          box-shadow: 0 2px 10px rgba(0,0,0,.15)
          img
            position: absolute
            top: 0
            left: 0
            width: 100%
            border-radius: 60px
          .vipflag
            position: absolute
            top: -8px
            left: 50%
            transform: translate(-50%, 0)
            display: block
            width: 35px
            text-align: center
            font-size: 9px
            color: #e1e1e1
            border-radius: 10px
            height: 14px
            line-height: 14px
            background: #9f3838
        .line
          position: relative
          flex: 1
          width: 1px
          .userName
            position: relative
            display: inline-block
            width: 100%
            max-width: 100%
            font-size: 14px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            box-sizing: border-box
            color: #e1e1e1
            a
              display: inline-block
              width: 60px
              text-align: center
              height: 22px
              line-height: 22px
              background-color: #9f3838
              border-radius: 3px
              color: #e0e0e0
              font-size: 12px
              box-sizing: border-box
            .supplier
              display: inline-block
              font-size: 10px
              vertical-align: middle
            .svip
              position: relative
              display: block
              float: left
              width: 16px
              height: 16px
              background: url(../../common/images/icons.png) no-repeat 0 0
              margin-right: 2px
              &.lv1
                background-position: 0 0
              &.lv2
                background-position: 0 -25px
              &.lv3
                background-position: 0 -50px
              &.lv4
                background-position: 0 -75px
              &.lv5
                background-position: 0 -100px
              &.lv6
                background-position: 0 -125px
              &.lv7
                background-position: 0 -150px
          .info
            margin-top: 5px
            .vip, .svip
              position: relative
              padding: 2px 8px 2px 15px
              height: 16px
              line-height: 16px
              font-size: 10px
              color: #e1e1e1
              background: #9f3838
              border-radius: 12px
              &:before
                content: ""
                display: block
                width: 14px
                height: 14px
                position: absolute
                left: 0
                top: 50%
                margin-top: -8px
                background: url(../../common/images/icons.png) no-repeat 0 0
              &.lv6:before
                background-position: -25px -125px
              &.lv5:before
                background-position: -25px -100px
              &.lv4:before
                background-position: -25px -75px
              &.lv3:before
                background-position: -25px -50px
              &.lv2:before
                background-position: -25px -25px
              &.lv1:before
                background-position: -25px 0
              &.lv0:before
                background-position: 0 -175px
            .svip
              padding: 2px 8px 2px 16px
              margin-left: 8px
              &.lv1:before
                background-position: 0 0
              &.lv2:before
                background-position: 0 -25px
              &.lv3:before
                background-position: 0 -50px
              &.lv4:before
                background-position: 0 -75px
              &.lv5:before
                background-position: 0 -100px
              &.lv6:before
                background-position: 0 -125px
              &.lv7:before
                background-position: 0 -150px
            .userflag
              padding: 2px 0 2px 3px
              height: 16px
              line-height: 16px
              font-size: 11px
              color: #e1e1e1
  .tasks-wrapper
    position: relative
    width: 100%
    .title
      padding: 0 10px
      height: 40px
      line-height: 40px
      font-size: 14px
      color: #7e8c8d
      border-1px(rgba(7, 17, 27, 0.1))
      box-sizing: border-box
      i
        padding-right: 3px
      b
        color: #000
    .task-list
      position: relative
      width: 100%
      padding-bottom: 10px
      .task-item
        display: flex
        font-size: 14px
        padding: 10px
        height: 36px
        color: #666
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        &.highlight
          >i, .text
            color: #ff463c
        >i
          height: 100%
          line-height: 36px
          font-size: 22px
          padding-right: 6px
          vertical-align: middle
        .task-text
          position: relative
          flex: 1
          vertical-align: middle
          box-sizing: border-box
          &.strong
            font-weight: 700
          .dot
            position: absolute
            width: 6px
            height: 6px
            border-radius: 50%
            background: #ff463c
            right: 0
            top: 1px
          .task-name
            height: 20px
            line-height: 20px
            font-size: 14px
            color: #333
          .task-desc
            padding-top: 2px
            font-size: 12px
            color: #ccc
        .task-ops
          float: right
          height: 100%
          line-height: 36px
          font-size: 22px
  .task-footer
    padding: 0 10px
  .todo-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    bottom: 0
    z-index: 40
    transition: all 0.5s
    background: rgba(7, 17, 27, 0.6)
    &.fade-transition
      transition: all 0.5s
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
