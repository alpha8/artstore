/* jshint esnext: true */
import Vue from 'vue';
import Router from 'vue-router';
import goodDetail from '@/components/good-detail/good-detailv2';
import home from '@/components/home/home';
import shopcart from '@/components/cart/shopcart';
import pay from '@/components/cart/pay';
import remark from '@/components/cart/remark';
import category from '@/components/category/category';
import search from '@/components/search/search';
import my from '@/components/my/my';
import addressList from '@/components/my/addressList';
import addAddress from '@/components/my/addAddress';
import editAddress from '@/components/my/editAddress';
import fillAddress from '@/components/my/fillAddress';
import order from '@/components/order/order';
import orderdetail from '@/components/order/orderdetail';
import refund from '@/components/order/refund';
import expresslog from '@/components/order/expresslog';
import coupon from '@/components/coupon/coupon';
import getcoupon from '@/components/coupon/getcoupon2';
import couponhistory from '@/components/coupon/coupon-history';
import newcoupon from '@/components/coupon/newcoupon';
import usecoupon from '@/components/coupon/usecoupon';
import footprint from '@/components/footprint/footprint';
import follow from '@/components/follow/follow';
import personInfo from '@/components/my/personInfo';
import wallet from '@/components/my/wallet';
import cashdetail from '@/components/my/cashdetail';
import seckill from '@/components/seckill/seckill';
import seckillDetail from '@/components/seckill/seckilldetail';
import myseckill from '@/components/seckill/myseckill';
import cashback from '@/components/my/cashback';
import cashbackdetail from '@/components/my/cashbackdetail';
import deposit from '@/components/cart/deposit';
import notfound from '@/components/common/404';
import info from '@/components/common/info';
import withdraw from '@/components/my/withdraw';
import withdrawdetail from '@/components/my/withdrawdetail';
import promocode from '@/components/user/promocode';
import login from '@/components/my/login';

import '@/common/stylus/index.styl';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '*', redirect: '/home', meta: {keepAlive: true}},
    {path: '/home', component: home, name: 'home', meta: {keepAlive: true}},
    {path: '/category', component: category, meta: {keepAlive: true}},
    {path: '/search', component: search, name: 'search', meta: {keepAlive: true}},
    {path: '/good/:id', component: goodDetail, name: 'good', meta: {keepAlive: false}},
    {path: '/cart', component: shopcart, meta: {keepAlive: true}},
    {path: '/pay', component: pay, name: 'pay', meta: {keepAlive: true}},
    {path: '/pay/deposit', component: deposit, name: 'deposit', meta: {keepAlive: true}},
    {path: '/pay/remark', component: remark, meta: {keepAlive: true}},
    {path: '/address', component: addressList, name: 'addresslist', meta: {keepAlive: true}},
    {path: '/address/add', component: addAddress, name: 'addaddress', meta: {keepAlive: true}},
    {path: '/address/:id/edit', component: editAddress, name: 'address', meta: {keepAlive: true}},
    {path: '/order', component: order, name: 'order', meta: {keepAlive: true}},
    {path: '/order/:id', component: orderdetail, name: 'orderdetail', meta: {keepAlive: true}},
    {path: '/order/refund/:id', component: refund, name: 'refund', meta: {keepAlive: true}},
    {path: '/order/express/:expressCode/:expressNo', component: expresslog, name: 'expresslog', meta: {keepAlive: true}},
    {path: '/order/:id/address', component: fillAddress, name: 'filladdress', meta: {keepAlive: true}},
    {path: '/coupon', component: coupon, name: 'coupon', meta: {keepAlive: true}},
    {path: '/getcoupon', component: getcoupon, name: 'getcoupon', meta: {keepAlive: true}},
    {path: '/coupon/history', component: couponhistory, name: 'couponHistory', meta: {keepAlive: true}},
    {path: '/coupon/new', component: newcoupon, name: 'newcoupon', meta: {keepAlive: true}},
    {path: '/discount/ticket', component: usecoupon, name: 'usecoupon', meta: {keepAlive: true}},
    {path: '/footprint', component: footprint, name: 'footprint', meta: {keepAlive: true}},
    {path: '/follow', component: follow, name: 'follow', meta: {keepAlive: true}},
    {path: '/seckill', component: seckill, name: 'seckill', meta: {keepAlive: true}},
    {path: '/seckill/:id/detail', component: seckillDetail, name: 'seckillDetail', meta: {keepAlive: true}},
    {path: '/myseckill', component: myseckill, name: 'myseckill', meta: {keepAlive: true}},
    {path: '/personInfo', component: personInfo, meta: {keepAlive: true}},
    {path: '/wallet', component: wallet, meta: {keepAlive: true}},
    {path: '/cashdetail', component: cashdetail, meta: {keepAlive: true}},
    {path: '/cashback', component: cashback, meta: {keepAlive: true}},
    {path: '/cashbackdetail', component: cashbackdetail, meta: {keepAlive: true}},
    {path: '/404', component: notfound, name: 'notfound', meta: {keepAlive: true}},
    {path: '/info', component: info, name: 'info', meta: {keepAlive: true}},
    {path: '/withdraw', component: withdraw, name: 'withdraw', meta: {keepAlive: true}},
    {path: '/withdrawdetail', component: withdrawdetail, name: 'withdrawdetail', meta: {keepAlive: true}},
    {path: '/promocode', component: promocode, name: 'promocode', meta: {keepAlive: true}},
    {path: '/login', component: login, name: 'login', meta: {keepAlive: true}},
    {path: '/my', component: my, name: 'my', meta: {keepAlive: true}}
  ]
});
