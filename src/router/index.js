/* jshint esnext: true */
import Vue from 'vue';
import Router from 'vue-router';
// import goods from '@/components/goods/goodsv2';
import goodDetail from '@/components/good-detail/good-detailv2';
import goodComment from '@/components/good-detail/comments';
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
import auction from '@/components/auction/auctions';
import auctiondetail from '@/components/auction/auctiondetail';
import auctionList from '@/components/auction/auctionList';
import myauction from '@/components/auction/myauction';
import bidlist from '@/components/auction/bidlist';
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
import groupbuy from '@/components/groupbuy/groupbuy';
import groupbuyDetail from '@/components/groupbuy/groupbuydetail';
import mygroupbuy from '@/components/groupbuy/mygroupbuy';
import recommend from '@/components/my/recommend';
import myrecommend from '@/components/my/myrecommend';
import cashback from '@/components/my/cashback';
import cashbackdetail from '@/components/my/cashbackdetail';
import bindphone from '@/components/my/bindphone';
import deposit from '@/components/cart/deposit';
import articles from '@/components/article/articles';
import articledetail from '@/components/article/articledetail';
import stat from '@/components/stats/stat';
import uvdetail from '@/components/stats/uv_detail';
import firstpurchase from '@/components/firstpurchase/firstpurchase';
import firstdetail from '@/components/firstpurchase/firstdetail';
import sharepayList from '@/components/sharepay/sharelist';
import sharedetail from '@/components/sharepay/sharedetail';
import myshare from '@/components/sharepay/myshare';
import tuanList from '@/components/tuan/tuanlist';
import tuandetail from '@/components/tuan/tuandetail';
import sharetuan from '@/components/tuan/sharetuan';
import mytuan from '@/components/tuan/mytuan';
// import signature from '@/components/common/signature';
import notfound from '@/components/common/404';
import info from '@/components/common/info';
import visitlist from '@/components/sharepay/visitlist';
import yourfriends from '@/components/user/your_friends';
import yourbuyers from '@/components/user/your_buyers';
import yourorders from '@/components/user/your_orders';
import task from '@/components/common/task';
import wipbargain from '@/components/stats/wip_bargains';
import wiptuan from '@/components/stats/wip_tuans';
import withdraw from '@/components/my/withdraw';
import withdrawdetail from '@/components/my/withdrawdetail';
import mycoin from '@/components/coin/mycoin';
import promocode from '@/components/user/promocode';

// import citychoose from '@/components/my/citychoose';

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
    {path: '/good/:id/comments', component: goodComment, name: 'goodComment', meta: {keepAlive: true}},
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
    {path: '/auction', component: auction, name: 'auction', meta: {keepAlive: true}},
    {path: '/auction/:id/detail', component: auctiondetail, name: 'auctiondetail', meta: {keepAlive: true}},
    {path: '/auction/list/:id', component: auctionList, name: 'auctionList', meta: {keepAlive: true}},
    {path: '/auction/:id/bidlist', component: bidlist, name: 'bidlist', meta: {keepAlive: true}},
    {path: '/myauction', component: myauction, name: 'myauction', meta: {keepAlive: true}},
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
    {path: '/groupbuy', component: groupbuy, name: 'groupbuy', meta: {keepAlive: true}},
    {path: '/groupbuy/:id/detail', component: groupbuyDetail, name: 'groupbuyDetail', meta: {keepAlive: true}},
    {path: '/mygroupbuy', component: mygroupbuy, name: 'mygroupbuy', meta: {keepAlive: true}},
    {path: '/personInfo', component: personInfo, meta: {keepAlive: true}},
    {path: '/wallet', component: wallet, meta: {keepAlive: true}},
    {path: '/cashdetail', component: cashdetail, meta: {keepAlive: true}},
    {path: '/myrecommend', component: myrecommend, name: 'myrecommend', meta: {keepAlive: true}},
    {path: '/recommend/:id', component: recommend, name: 'recommend', meta: {keepAlive: true}},
    // {path: '/address/citychoose', component: citychoose, name: 'citychoose', meta: {keepAlive: true}},
    {path: '/cashback', component: cashback, meta: {keepAlive: true}},
    {path: '/cashbackdetail', component: cashbackdetail, meta: {keepAlive: true}},
    {path: '/bindphone', component: bindphone, name: 'bindphone', meta: {keepAlive: true}},
    {path: '/articles', component: articles, name: 'articles', meta: {keepAlive: true}},
    {path: '/article/:id', component: articledetail, name: 'articledetail', meta: {keepAlive: false}},
    {path: '/stat', component: stat, name: 'stat', meta: {keepAlive: true}},
    {path: '/uvdetail', component: uvdetail, name: 'uvdetail', meta: {keepAlive: true}},
    {path: '/firstpurchase', component: firstpurchase, name: 'firstpurchase', meta: {keepAlive: true}},
    {path: '/firstpurchase/:id', component: firstdetail, name: 'firstdetail', meta: {keepAlive: true}},
    {path: '/sharepay', component: sharepayList, name: 'sharepay', meta: {keepAlive: true}},
    {path: '/sharepay/uvlog', component: visitlist, name: 'visitlist', meta: {keepAlive: true}},
    {path: '/myshare', component: myshare, name: 'myshare', meta: {keepAlive: true}},
    {path: '/sharepay/:id', component: sharedetail, name: 'sharedetail', meta: {keepAlive: false}},
    {path: '/tuan', component: tuanList, name: 'tuan', meta: {keepAlive: true}},
    {path: '/mytuan', component: mytuan, name: 'mytuan', meta: {keepAlive: true}},
    {path: '/tuan/:id', component: tuandetail, name: 'tuandetail', meta: {keepAlive: true}},
    {path: '/sharetuan/:id', component: sharetuan, name: 'sharetuan', meta: {keepAlive: true}},
    // {path: '/signature', component: signature, name: 'signature', meta: {keepAlive: true}},
    {path: '/404', component: notfound, name: 'notfound', meta: {keepAlive: true}},
    {path: '/info', component: info, name: 'info', meta: {keepAlive: true}},
    {path: '/friends', component: yourfriends, name: 'yourfriends', meta: {keepAlive: true}},
    {path: '/buyers', component: yourbuyers, name: 'yourbuyers', meta: {keepAlive: true}},
    {path: '/buyers/:uid', component: yourorders, name: 'yourorders', meta: {keepAlive: true}},
    {path: '/task', component: task, name: 'task', meta: {keepAlive: true}},
    {path: '/wip_bargain', component: wipbargain, name: 'wipbargain', meta: {keepAlive: true}},
    {path: '/wip_tuan', component: wiptuan, name: 'wiptuan', meta: {keepAlive: true}},
    {path: '/withdraw', component: withdraw, name: 'withdraw', meta: {keepAlive: true}},
    {path: '/withdrawdetail', component: withdrawdetail, name: 'withdrawdetail', meta: {keepAlive: true}},
    {path: '/mycoin', component: mycoin, name: 'mycoin', meta: {keepAlive: true}},
    {path: '/promocode', component: promocode, name: 'promocode', meta: {keepAlive: true}},
    {path: '/my', component: my, meta: {keepAlive: true}}
  ]
});
