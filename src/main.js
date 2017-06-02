// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* jshint esnext: true */
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import { currency } from '@/common/js/util';

Vue.filter('currency', currency);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
