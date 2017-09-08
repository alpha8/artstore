<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <fixedfoot :items="items"></fixedfoot>
    <loading :show="loading.show" :text="loading.text"></loading>
    <toast v-show="toast.show" :text="toast.text"></toast>
    <gohome></gohome>
  </div>
</template>

<script type="text/ecmascript-6">
import fixedfoot from '@/components/fixedtoolbar/fixedfoot';
import loading from '@/components/common/loading';
import toast from '@/components/common/toast';
import gohome from '@/components/fixedtoolbar/gohome';

export default {
  data () {
    return {
      items: [{
        icon: 'icon-home',
        text: '首页',
        active: true,
        link: '/home'
      }, {
        icon: 'icon-classify',
        text: '分类',
        active: false,
        link: '/category'
      }, {
        icon: 'icon-cart',
        text: '购物车',
        active: false,
        link: '/cart'
      }, {
        icon: 'icon-user2',
        text: '个人中心',
        active: false,
        link: '/my'
      }]
    };
  },
  computed: {
    toast() {
      return {
        show: this.$store.getters.showMsg,
        text: this.$store.getters.messageText
      };
    },
    loading() {
      return {
        show: this.$store.getters.isLoading,
        text: this.$store.getters.loadingText
      };
    }
  },
  components: {
    fixedfoot, loading, toast, gohome
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
