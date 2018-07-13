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
import signature from '@/components/common/signature';
import notfound from '@/components/common/404';
import info from '@/components/common/info';
import visitlist from '@/components/sharepay/visitlist';
import yourfriends from '@/components/user/your_friends';
import yourbuyers from '@/components/user/your_buyers';
// import citychoose from '@/components/my/citychoose';

import '@/common/stylus/index.styl';

Vue.use(Router);
export default new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '*', redirect: '/home'},
    {path: '/home', component: home},
    {path: '/category', component: category},
    {path: '/search', component: search, name: 'search'},
    {path: '/good/:id', component: goodDetail, name: 'good'},
    {path: '/good/:id/comments', component: goodComment, name: 'goodComment'},
    {path: '/cart', component: shopcart},
    {path: '/pay', component: pay, name: 'pay'},
    {path: '/pay/deposit', component: deposit, name: 'deposit'},
    {path: '/pay/remark', component: remark},
    {path: '/address', component: addressList, name: 'addresslist'},
    {path: '/address/add', component: addAddress, name: 'addaddress'},
    {path: '/address/:id/edit', component: editAddress, name: 'address'},
    {path: '/order', component: order, name: 'order'},
    {path: '/order/:id', component: orderdetail, name: 'orderdetail'},
    {path: '/order/refund/:id', component: refund, name: 'refund'},
    {path: '/order/express/:expressCode/:expressNo', component: expresslog, name: 'expresslog'},
    {path: '/order/:id/address', component: fillAddress, name: 'filladdress'},
    {path: '/auction', component: auction, name: 'auction'},
    {path: '/auction/:id/detail', component: auctiondetail, name: 'auctiondetail'},
    {path: '/auction/list/:id', component: auctionList, name: 'auctionList'},
    {path: '/auction/:id/bidlist', component: bidlist, name: 'bidlist'},
    {path: '/myauction', component: myauction, name: 'myauction'},
    {path: '/coupon', component: coupon, name: 'coupon'},
    {path: '/getcoupon', component: getcoupon, name: 'getcoupon'},
    {path: '/coupon/history', component: couponhistory, name: 'couponHistory'},
    {path: '/coupon/new', component: newcoupon, name: 'newcoupon'},
    {path: '/discount/ticket', component: usecoupon, name: 'usecoupon'},
    {path: '/footprint', component: footprint, name: 'footprint'},
    {path: '/follow', component: follow, name: 'follow'},
    {path: '/seckill', component: seckill, name: 'seckill'},
    {path: '/seckill/:id/detail', component: seckillDetail, name: 'seckillDetail'},
    {path: '/myseckill', component: myseckill, name: 'myseckill'},
    {path: '/groupbuy', component: groupbuy, name: 'groupbuy'},
    {path: '/groupbuy/:id/detail', component: groupbuyDetail, name: 'groupbuyDetail'},
    {path: '/mygroupbuy', component: mygroupbuy, name: 'mygroupbuy'},
    {path: '/personInfo', component: personInfo},
    {path: '/wallet', component: wallet},
    {path: '/cashdetail', component: cashdetail},
    {path: '/myrecommend', component: myrecommend, name: 'myrecommend'},
    {path: '/recommend/:id', component: recommend, name: 'recommend'},
    // {path: '/address/citychoose', component: citychoose, name: 'citychoose'},
    {path: '/cashback', component: cashback},
    {path: '/cashbackdetail', component: cashbackdetail},
    {path: '/bindphone', component: bindphone, name: 'bindphone'},
    {path: '/articles', component: articles, name: 'articles'},
    {path: '/article/:id', component: articledetail, name: 'articledetail'},
    {path: '/stat', component: stat, name: 'stat'},
    {path: '/uvdetail', component: uvdetail, name: 'uvdetail'},
    {path: '/firstpurchase', component: firstpurchase, name: 'firstpurchase'},
    {path: '/firstpurchase/:id', component: firstdetail, name: 'firstdetail'},
    {path: '/sharepay', component: sharepayList, name: 'sharepay'},
    {path: '/sharepay/uvlog', component: visitlist, name: 'visitlist'},
    {path: '/myshare', component: myshare, name: 'myshare'},
    {path: '/sharepay/:id', component: sharedetail, name: 'sharedetail'},
    {path: '/tuan', component: tuanList, name: 'tuan'},
    {path: '/mytuan', component: mytuan, name: 'mytuan'},
    {path: '/tuan/:id', component: tuandetail, name: 'tuandetail'},
    {path: '/sharetuan/:id', component: sharetuan, name: 'sharetuan'},
    {path: '/signature', component: signature, name: 'signature'},
    {path: '/404', component: notfound, name: 'notfound'},
    {path: '/info', component: info, name: 'info'},
    {path: '/friends', component: yourfriends, name: 'yourfriends'},
    {path: '/buyers', component: yourbuyers, name: 'yourbuyers'},
    {path: '/my', component: my}
  ]
  // ,scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //       return savedPosition;
  //   } else {
  //       return {x: 0, y: 0};
  //   }
  // }
});
