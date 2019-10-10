// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* jshint esnext: true */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAwesomeSwiper from 'vue-awesome-swiper';
Vue.use(VueAxios, axios);
Vue.use(VueAwesomeSwiper);

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload);

import App from './App';
import router from './router';
import store from './store';
import { getToken } from '@/common/js/auth';
import { currency } from '@/common/js/util';

import '@/components/common/styles/base.less';
import infiniteScroll from '@/components/common/infiniteScroll';
import * as flexbox from '@/components/common/flexbox';
const modules = {
  infiniteScroll,
  ...flexbox
};
Object.keys(modules).forEach((key) => {
  Vue.component(modules[key].name, modules[key]);
});
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
Vue.use(ElementUI, { locale });

Vue.filter('currency', currency);
Vue.config.productionTip = false;
import wx from 'weixin-js-sdk';

/** 全局守卫 */
const blackList = ['/my', '/cart']; // 重定向黑名单
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (!store.getters.name) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next();
        }).catch((err) => {
          console.error(err);
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' });
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (blackList.indexOf(to.path) !== -1) {
      next('/login');
    } else {
      next();
    }
  }
});
/* router.beforeEach((to, from, next) => {
  let shareData = {
    title: '',
    desc: '',
    link: 'http://' + location.host + location.pathname,
    imgUrl: ''
  };
  wx.onMenuShareTimeline(shareData);
  wx.onMenuShareAppMessage(shareData);
  next();
}); */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
