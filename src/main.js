// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* jshint esnext: true */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAwesomeSwiper from 'vue-awesome-swiper';

// import VueLazyload from 'vue-lazyload';
// Vue.use(VueLazyload);

// import AlloyFinger from 'alloyfinger/alloy_finger';
// import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
// Vue.use(AlloyFingerVue, {AlloyFinger});

import App from './App';
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
