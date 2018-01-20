// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* jshint esnext: true */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAwesomeSwiper from 'vue-awesome-swiper';

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload);

// import AlloyFinger from 'alloyfinger/alloy_finger';
// import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
// Vue.use(AlloyFingerVue, {AlloyFinger});

import App from './App';
// import App from '@/components/xmas/App';
import router from './router';
import store from './store';
import { currency } from '@/common/js/util';

import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

Vue.filter('currency', currency);
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueAwesomeSwiper);
Vue.use(MuseUI);

import wx from 'weixin-js-sdk';

/** 全局守卫 */
router.beforeEach((to, from, next) => {
  let shareData = {
    title: '[一虎一席茶席艺术平台] 一站式优品商城，品味脱凡',
    desc: '1200款精美茶器、300套茶席佳作、茶室专业配画、200款好茶老茶.【每年扩增100%】',
    link: 'http://' + location.host + location.pathname,
    imgUrl: 'http://www.yihuyixi.com/ps/download/5a60046ae4b0a5130574a5fc'
  };
  wx.onMenuShareTimeline(shareData);
  wx.onMenuShareAppMessage(shareData);
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
