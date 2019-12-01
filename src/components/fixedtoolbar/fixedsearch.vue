<template>
  <div class="toolbar" :class="{'searchBox': showSearchBox, 'fixed': showFixed || highlight}">
    <div class="toolbar-wrapper">
      <div class="search-form">
        <div class="search-form-box">
          <i class="icon-search2"></i>
          <div class="search-form-input">
            <form action="" v-on:submit.stop.prevent="search">
              <input type="search" name="txtSearch" class="txtSearch" :class="{'trans': trans}" :placeholder="rollingSlogan" autocomplete="off" @click.stop.prevent="openSmartSearch" v-model="keyword" v-on:input="changeText">
            </form>
          </div>
        </div>
      </div>
      <div class="ext-tools">
        <span v-show="showLogin"><span @click="getLoginUrl">登录</span></span>
        <span v-show="showDiscard" @click.stop.prevent="hideDialog"><span class="button" :class="{'active': !highlight}">取消</span></span>
        <span v-show="showSearchBtn"><span class="button" :class="{'active': !highlight}" @click.stop.prevent="search">搜索</span></span>
        <span v-show="hasLogin && !typing"><router-link to="/my" class="userIcon"><i class="icon-user2"></i></router-link></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  export default {
    props: {
      showFixed: {
        type: Boolean
      }
    },
    data() {
      return {
        showLogin: true,
        showDiscard: false,
        showSearch: false,
        keyword: '',
        isLogin: this.$store.getters.userId,
        typing: false,
        highlight: false,
        trans: false,
        slogan: '搜索商品',
        counter: 10
      };
    },
    computed: {
      showSearchBox() {
        return this.$store.state.searchDialog;
      },
      showSearchBtn() {
        this.showSearch = (this.keyword != '');
        if (this.showSearch) {
          this.showDiscard = this.showLogin = false;
        } else if (!this.isLogin && !this.showLogin) {
          this.showDiscard = true;
        }
        return this.showSearch;
      },
      hasLogin() {
        this.isLogin = this.$store.getters.userId;
        this.showLogin = !this.isLogin;
        return this.isLogin;
      },
      rollingSlogan() {
        return this.slogan;
      }
    },
    activated() {
      let userId = this.$store.getters.userId;
      this.isLogin = (userId > 0);
    },
    deactivated() {
      this.hideDialog();
      this.keyword = '';
      this.counter = 10;
    },
    created() {
      let ads = ['搜索商品', '优质生活、高端礼品', '领略东方生活之美...', '一站式优品商城'];
      let idx = 0;
      setInterval(() => {
        if (!this.typing) {
          this.trans = !this.trans;
          setTimeout(() => {
            this.trans = false;
          }, 800);
          this.slogan = ads[idx];
          if (++idx >= ads.length) {
            idx = 0;
          }
        }
      }, 8500);
    },
    methods: {
      search() {
        let kw = this.keyword && this.keyword.trim() || '';
        this.$store.dispatch('addSearchHistory', kw);
        this.$router.push({path: '/search', query: {keyword: kw}});
      },
      showLoginForm() {
        this.showLogin = !this.isLogin;
      },
      getLoginUrl() {
        this.$router.push('/login');
      },
      changeText() {
        if (!this.keyword.length) {
          this.typing = false;
          this.showDiscard = true;
          this.keyword = '';
        } else {
          this.typing = true;
        }
      },
      openSmartSearch() {
        this.$store.commit('SHOW_SEARCH');
        this.showDiscard = true;
        this.showLogin = this.showSearch = false;
        this.typing = true;
        this.highlight = true;
      },
      hideDialog() {
        this.typing = false;
        this.$store.commit('HIDE_SEARCH');
        this.showLoginForm();
        this.showDiscard = this.showSearch = false;
        this.highlight = false;
      },
      clearText() {
        this.typing = true;
        this.showDiscard = true;
        this.keyword = '';
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @require '../../common/stylus/variables'
  .toolbar
    position: fixed
    margin: 0 auto
    top: 0
    left: 0
    right: 0
    z-index: 10
    height: 40px
    padding: 0 10px
    &.searchBox
      background: #fff
    &.fixed
      background: $color-main
      animation: searchTop .4s ease-in-out
    @-webkit-keyframes searchTop
      from { top: -50px; }
      to { top: 0;}
    @keyframes searchTop
      from { top: -50px; }
      to { top: 0;}
    .toolbar-wrapper
      position: relative
      display: flex
      width: 100%
      height: 100%
      .search-form
        flex: 1
        .search-form-box
          position: relative
          height: 29px
          overflow: hidden
          background: rgba(255,255,255,0.9)
          -moz-border-radius: 15px
          -webkit-border-radius: 15px
          border-radius: 15px
          margin-top: 5px
          .icon-search2
            position: relative
            display: inline-block
            width: 13px
            height: 13px
            top: 50%
            left: 12px
            float: left
            color: #d5d4d4
            font-size: 13px
            margin-top: -6.5px
          .removeText
            position: absolute
            top: 50%
            right: 3px
            width: 20px
            height: 20px
            margin-top: -10px
            background: url(../../common/images/close.png) no-repeat
            background-size: 20px auto
          .search-form-input
            display: inline-block
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            form
              position: relative
              height: 100%
            .txtSearch
              position: relative
              display: block
              padding-left: 28px
              background: 0
              border: 0
              outline: none
              width: 100%
              height: 16px
              line-height: 16px
              top: 50%
              margin-top: -8px
              font-size: 13px
              color: #666
              box-sizing: border-box
              transition: all 1s ease-in
              &.trans
                transform: translate3d(0, -30px, 0)
              &::-webkit-input-placeholder
                color: #999!important
              &:-moz-placeholder
                color: #999!important
              &::-moz-placeholder
                color: #999!important
              &:-ms-input-placeholder
                color: #999!important
      .ext-tools
        width: 60px
        text-align: center
        box-sizing: border-box
        padding: 3px 0
        span, a
          display: inline-block
          font-size: 13px
          color: #fff
          width: 100%
          height: 33px
          line-height: 33px
          vertical-align: top
          .userIcon
            text-align: left
            text-indent: 10px
            margin-top: 1px
            text-align: center
          .button
            background: $color-main
            color: #fff
            border: none
            &.active
              color: #666
              background: #efefef
              border: 1px solid #ddd
              border-radius: 3px
          .icon-user2
            font-size: 16px
</style>
