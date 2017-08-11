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
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedheader from '@/components/fixedtoolbar/fixedheader';

  export default {
    data() {
      return {
        items: [
          { key: 'icon', text: '头像', type: 'image', link: '' },
          { key: 'nickName', text: '微信名称', link: '' },
          { key: 'sex', text: '性别', link: '' },
          { key: 'grade', text: '会员等级', link: '' }
        ],
        user: this.$store.getters.getUserInfo
      };
    },
    methods: {
      getValue(key) {
        if (!this.user) {
          return;
        }
        if (key === 'sex') {
          let gender = this.user[key] || '1';
          let value = '男';
          switch (gender) {
            case '1':
              value = '男';
              break;
            case '0':
              value = '女';
              break;
            default:
              value = gender;
          }
          return value;
        }
        if (key === 'grade') {
          return this.user.userId === 38 ? '金牌会员' : '普通会员';
        }
        return this.user[key] || '';
      },
      back() {
        this.$router.back();
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
    bottom: 50px
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
</style>
