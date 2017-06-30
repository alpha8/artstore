<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <fixedfoot :items="items"></fixedfoot>
    <loading :show="loading.show" :text="loading.text"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
import fixedfoot from '@/components/fixedtoolbar/fixedfoot';
import loading from '@/components/common/loading';
import toast from '@/components/common/toast';

export default {
  data () {
    return {
      items: [{
        icon: 'icon-recommend',
        text: '选购',
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
    loading() {
      return {
        show: this.$store.getters.isLoading,
        text: this.$store.getters.loadingText
      };
    }
  },
  components: {
    fixedfoot, loading, toast
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
