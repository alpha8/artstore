<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <fixedfoot :items="items"></fixedfoot>
    <loading :show="loading.show" :text="loading.text"></loading>
    <toast v-show="toast.show" :text="toast.text"></toast>
    <gohome></gohome>
    <task></task>
  </div>
</template>

<script type="text/ecmascript-6">
import fixedfoot from '@/components/fixedtoolbar/fixedfoot';
import loading from '@/components/common/loading';
import toast from '@/components/common/toast';
import task from '@/components/common/task';
import gohome from '@/components/fixedtoolbar/gohome';
import {fixFontSize} from '@/common/js/util';

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
        text: '商品分类',
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
  created() {
    let ios = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    if (!ios) {
      fixFontSize();
    }
  },
  components: {
    fixedfoot, loading, toast, gohome, task
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
