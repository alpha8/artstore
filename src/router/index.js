/* jshint esnext: true */
import Vue from 'vue';
import Router from 'vue-router';
import goods from '@/components/goods/goodsv2';
import goodDetail from '@/components/good-detail/good-detailv2';
// import ratings from '@/components/ratings/ratings';
// import seller from '@/components/seller/seller';
import home from '@/components/home/home';
import shopcart from '@/components/cart/shopcart';

import '@/common/stylus/index.styl';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/home', component: home},
    {path: '/category', component: goods},
    {path: '/good/:id', component: goodDetail, name: 'good'},
    {path: '/cart', component: shopcart}
    // {path: '/ratings', component: ratings},
    // {path: '/seller', component: seller}
  ]
});
