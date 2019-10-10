<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <fixedfoot :items="items"></fixedfoot>
    <loading :show="loading.show" :text="loading.text"></loading>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
    <sku></sku>
  </div>
</template>

<script type="text/ecmascript-6">
import fixedfoot from '@/components/fixedtoolbar/fixedfoot';
import loading from '@/components/common/loading';
import toast from '@/components/common/toast';
import sku from '@/components/good-detail/sku';
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
        text: this.$store.getters.messageText,
        icon: this.$store.getters.messageType || ''
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
    fixedfoot, loading, sku, toast
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
