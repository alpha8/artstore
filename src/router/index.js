/* jshint esnext: true */
import Vue from 'vue';
import Router from 'vue-router';
// import goods from '@/components/goods/goodsv2';
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
import order from '@/components/order/order';
import orderdetail from '@/components/order/orderdetail';
import expresslog from '@/components/order/expresslog';
import auction from '@/components/auction/auction';
import auctionList from '@/components/auction/auctionList';
import coupon from '@/components/coupon/coupon';
import getcoupon from '@/components/coupon/getcoupon';
import couponhistory from '@/components/coupon/coupon-history';
import footprint from '@/components/footprint/footprint';
import follow from '@/components/follow/follow';
import personInfo from '@/components/my/personInfo';
import wallet from '@/components/my/wallet';
import cashdetail from '@/components/my/cashdetail';
import seckill from '@/components/seckill/seckill';
import seckillDetail from '@/components/seckill/seckilldetail';
import myseckill from '@/components/seckill/myseckill';

import '@/common/stylus/index.styl';

Vue.use(Router);
export default new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '*', redirect: '/home'},
    {path: '/home', component: home},
    {path: '/category', component: category},
    {path: '/search', component: search},
    {path: '/good/:id', component: goodDetail, name: 'good'},
    {path: '/cart', component: shopcart},
    {path: '/pay', component: pay, name: 'pay'},
    {path: '/pay/remark', component: remark},
    {path: '/address', component: addressList},
    {path: '/addAddress', component: addAddress},
    {path: '/editAddress/:id', component: editAddress, name: 'address'},
    {path: '/order', component: order},
    {path: '/order/detail/:id', component: orderdetail, name: 'orderdetail'},
    {path: '/order/express/:expressCode/:expressNo', component: expresslog, name: 'expresslog'},
    {path: '/auction', component: auction, name: 'auction'},
    {path: '/auction/list/:id', component: auctionList, name: 'auctionList'},
    {path: '/coupon', component: coupon, name: 'coupon'},
    {path: '/getcoupon', component: getcoupon, name: 'getcoupon'},
    {path: '/coupon/history', component: couponhistory, name: 'couponHistory'},
    {path: '/footprint', component: footprint, name: 'footprint'},
    {path: '/follow', component: follow, name: 'follow'},
    {path: '/seckill', component: seckill, name: 'seckill'},
    {path: '/seckill/:id/detail', component: seckillDetail, name: 'seckillDetail'},
    {path: '/myseckill', component: myseckill, name: 'myseckill'},
    {path: '/personInfo', component: personInfo},
    {path: '/wallet', component: wallet},
    {path: '/cashdetail', component: cashdetail},
    {path: '/my', component: my}
  ]
});
