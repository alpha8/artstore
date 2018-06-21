<template>
  <div class="info" ref="info">
    <dl>
      <dt>Client Info</dt>
      <dd v-for="item in clients">
        <div class="label">{{item.key}}</div>
        <div class="text">{{item.value}}</div>
      </dd>
    </dl>
    <dl>
      <dt>Session Storage</dt>
      <dd v-for="item in sessions">
        <div class="label">{{item.key}}</div>
        <div class="text">{{item.value}}</div>
      </dd>
    </dl>
    <dl>
      <dt>Cookie</dt>
      <dd v-for="item in cookies">
        <div class="label">{{item.key}}</div>
        <div class="text">{{item.value}}</div>
      </dd>
    </dl>
    <dl>
      <dt>Vuex</dt>
      <dd>
        <div class="label">UserInfo</div>
        <div class="text">{{userInfo}}</div>
      </dd>
    </dl>
    <dl>
      <dt>Local Storage</dt>
      <dd v-for="item in localsessions">
        <div class="label">{{item.key}}</div>
        <div class="text">{{item.value}}</div>
      </dd>
    </dl>
    <div class="btns"><span class="btn-green" @click.stop.prevent="reloadData">重新加载</span></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        clients: [],
        sessions: [],
        localsessions: [],
        cookies: [],
        userInfo: this.$store.getters.getUserInfo
      };
    },
    activated() {
      this.$store.commit('HIDE_FOOTER');
      this._initData();
    },
    deactivated() {
      this.$store.commit('SHOW_FOOTER');
    },
    methods: {
      _initData() {
        this.clients = [];
        this.sessions = [];
        this.localsessions = [];
        this.cookies = [];
        this.clients.push({'key': 'userAgent', 'value': navigator.userAgent});
        this.clients.push({'key': 'Platform', 'value': navigator.platform});
        this.clients.push({'key': 'Language', 'value': navigator.language});
        this.clients.push({'key': 'Location', 'value': navigator.geolocation});
        this.clients.push({'key': 'URL', 'value': location.href});
        for (let i = 0; i < window.sessionStorage.length; i++) {
          let key = window.sessionStorage.key(i);
          this.sessions.push({'key': key, 'value': window.sessionStorage.getItem(key)});
        }
        for (let i = 0; i < window.localStorage.length; i++) {
          let key = window.localStorage.key(i);
          this.localsessions.push({'key': key, 'value': window.localStorage.getItem(key)});
        }
        let arr = document.cookie.split(';');
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i].split('=');
          this.cookies.push({'key': item[0], 'value': unescape(item[1])});
        }
      },
      _init() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.info, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      reloadData() {
        this.$store.dispatch('openToast', '重新加载数据...');
        this.$store.dispatch('reloadUserInfo');
        this.userInfo = this.$store.getters.getUserInfo;
        this._initData();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  dl
    position: relative
    margin: 10px 0
    dt
      font-size: 14px
      font-weight: 700
    dd
      position: relative
      display: flex
      font-size: 12px
      padding: 3px 0
      .label
        display: block
        float: left
        width: 110px
        text-indent: 5px
        overflow: hidden
        box-sizing: border-box
      .text
        flex: 1
        word-wrap: break-word
        word-break: break-all
</style>
