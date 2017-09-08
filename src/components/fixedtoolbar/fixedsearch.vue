<template>
  <div class="toolbar" :class="{'searchBox': showSearchBox, 'fixed': showFixed}">
    <div class="toolbar-wrapper">
      <div class="search-form">
        <div class="search-form-box">
          <i class="icon-search"></i>
          <div class="search-form-input">
            <form action="" v-on:submit.stop.prevent="search">
              <input type="search" name="txtSearch" class="txtSearch" placeholder="优质茶生活、茶文化高端礼品" autocomplete="off" @click.stop.prevent="openSmartSearch" v-model="keyword" v-on:input="changeText">
            </form>
          </div>
          <!-- <i class="removeText" v-show="keyword" @click.stop.prevent="clearText"></i> -->
        </div>
      </div>
      <div class="ext-tools">
        <span v-show="showLogin"><a href="/wxservice/baseInfo">登录</a></span>
        <span v-show="showDiscard" @click.stop.prevent="hideDialog"><span class="button">取消</span></span>
        <span v-show="showSearchBtn"><span class="button" :class="{'blue': !showFixed}" @click.stop.prevent="search">搜索</span></span>
        <span v-show="hasLogin && !typing"><router-link to="/my"><i class="icon-user2"></i></router-link></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
        isLogin: this.$store.getters.checkLogined,
        typing: false
      };
    },
    computed: {
      showSearchBox() {
        return this.$store.state.searchDialog;
      },
      showSearchBtn() {
        this.showSearch = (this.keyword !== '');
        if (this.showSearch) {
          this.showDiscard = this.showLogin = false;
        } else if (!this.isLogin && !this.showLogin) {
          this.showDiscard = true;
        }
        return this.showSearch;
      },
      hasLogin() {
        this.showLogin = !this.isLogin;
        return this.isLogin;
      }
    },
    deactivated() {
      this.hideDialog();
      this.keyword = '';
    },
    methods: {
      search() {
        this.$router.push({path: '/search', query: {keyword: this.keyword || ''}});
      },
      showLoginForm() {
        this.showLogin = !this.isLogin;
      },
      changeText() {
        if (!this.keyword.length) {
          this.typing = false;
          this.showDiscard = true;
          this.keyword = '';
        }
      },
      openSmartSearch() {
        this.$store.commit('SHOW_SEARCH');
        this.showDiscard = true;
        this.showLogin = this.showSearch = false;
        this.typing = true;
      },
      hideDialog() {
        this.typing = false;
        this.$store.commit('HIDE_SEARCH');
        this.showLoginForm();
        this.showDiscard = this.showSearch = false;
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
  .toolbar
    position: fixed
    margin: 0 auto
    top: 0
    left: 0
    right: 0
    z-index: 10
    height: 39px
    padding: 0 10px
    &.searchBox
      background: #fff
    &.fixed
      background: #b80d10
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
          .icon-search
            position: relative
            display: inline-block
            width: 12px
            height: 12px
            top: 6px
            left: 6px
            float: left
            color: #d5d4d4
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
            .txtSearch
              display: inline-block
              background: 0
              border: 0
              width: 100%
              line-height: 16px
              height: 16px
              margin-top: 6px
              vertical-align: middle
              font-size: 12px
              color: #666
              padding: 0 28px
              box-sizing: border-box
      .ext-tools
        flex: 0 0 60px
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
          .button
            background: rgba(7, 17, 27, 0.3)
            &.blue
              background: rgba(0, 187, 156, 0.87)
          .icon-user2
            font-size: 16px
</style>
