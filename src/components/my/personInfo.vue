<template>
  <div>
    <fixedheader title="个人信息"></fixedheader>
    <div class="person">
      <div class="person-wrap">
        <ul class="itemList">
          <li class="item border-1px" v-for="(item, index) in items" key="index" :class="{'avatar': item.type === 'image'}">
            <router-link :to="item.link" :class="{'more': item.link}">
              <span class="text">{{item.text}}</span>
              <span class="value" v-show="item.type === 'image'"><img :src="getValue(item.key)" width="55" height="55" /></span>
              <span class="value" v-show="item.type !== 'image'">{{getValue(item.key)}}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <div class="btns"><span class="btn-red" @click.stop.prevent="sync">同步微信昵称</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '@/api/api';
  import fixedheader from '@/components/fixedtoolbar/fixedheader';

  export default {
    data() {
      return {
        items: [
          { key: 'icon', text: '头像', type: 'image', link: '' },
          { key: 'nickName', text: '微信名称', link: '' },
          { key: 'sex', text: '性别', link: '' },
          { key: 'model', text: '用户类型', link: '' },
          { key: 'phone', text: '绑定手机号码', link: '/bindphone' }
        ],
        user: this.$store.getters.getUserInfo,
        userProfile: this.$store.getters.getUserProfile
      };
    },
    activated() {
      this.show();
      this.userProfile = this.$store.getters.getUserProfile;
    },
    deactivated() {
      this.hide();
    },
    methods: {
      getValue(key) {
        if (!this.user) {
          return;
        }
        if (key === 'sex') {
          let gender = this.user[key];
          let value = '男';
          switch (gender) {
            case '1':
              value = '男';
              break;
            case '2':
              value = '女';
              break;
            default:
              value = '';
              break;
          }
          return value;
        }
        let SUPPLIER = 2;
        let SYSUSER = 0;
        if (key === 'level') {
          // let userLevel = {'lv0': '普通用户', 'lv1': 'VIP一钻', 'lv2': 'VIP二钻', 'lv3': 'VIP三钻', 'lv4': 'VIP四钻', 'lv5': 'VIP五钻'};
          let agentLevel = {'lv0': '普通用户', 'lv1': '皇冠一星', 'lv2': '皇冠二星', 'lv3': '皇冠三星', 'lv4': '皇冠四星', 'lv5': '皇冠五星'};
          let level = this.userProfile.user && this.userProfile.user.level || 'lv1';
          // let model = this.userProfile.user && this.userProfile.user.model || 1;
          return agentLevel[level];
        }
        if (key === 'model') {
          let model = this.userProfile.user && this.userProfile.user.model || 0;
          if (model === SYSUSER) {
            return '系统用户';
          } else if (model === SUPPLIER) {
            return '代理商';
          }
          return '会员';
        } else if (key === 'phone') {
          return this.userProfile.user && this.userProfile.user.mobileNumber || '';
        }
        return this.user[key] || '';
      },
      sync() {
        this.$store.dispatch('openToast', '同步昵称');
        let redirect = 'http://' + location.host + location.pathname + '#/personInfo';
        window.location.href = `${api.CONFIG.wxCtx}/baseInfo?url=` + escape(redirect);
      },
      show() {
        this.$store.commit('HIDE_FOOTER');
      },
      hide() {
        this.$store.commit('SHOW_FOOTER');
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
  .person
    position: absolute
    top: 44px
    bottom: 47px
    width: 100%
    overflow: hidden
    .person-wrap
      position: relative
      width: 100%
      .itemList
        position: relative
        width: 100%
        padding: 0 10px
        box-sizing: border-box
        .item
          position: relative
          display: block
          font-size: 14px
          padding: 15px 15px 15px 10px
          border-1px(rgba(7, 17, 27, 0.1))
          &.avatar
            height: 60px
            line-height: 60px
            padding: 10px 15px 10px 10px
          >a, >div
            display: block
            &.more:after
              position: absolute
              display: block
              width: 8px
              height: 8px
              content: ""
              border-top: 1px solid #666
              border-left: 1px solid #666
              transform-origin: 50%
              transform: rotate(135deg)
              top: 50%
              right: 5px
              margin-top: -4px
          .text
            vertical-align: middle
          .value
            display: inline-block
            float: right
            text-align: right
            vertical-align: middle
            color: #999
            img
              border-radius: 5px
  .footer
    position: fixed
    bottom: 0
    width: 100%
    height: 47px
    overflow: hidden
    z-index: 2
    .btns
      margin: 0 auto
      height: 47px
      line-height: 47px
      font-size: 14px
      .btn-red
        color: #e1e1e1
        border-radius: 0
</style>
