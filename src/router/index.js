/* jshint esnext: true */
import Vue from 'vue';
import Router from 'vue-router';
import '@/common/stylus/index.styl';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {path: '', redirect: '/home', meta: {keepAlive: true}},
    {path: '/home', component: () => import('@/components/home/home'), name: 'home', meta: {keepAlive: true}},
    {path: '/category', component: () => import('@/components/category/category'), meta: {keepAlive: true}},
    {path: '/search', component: () => import('@/components/search/search'), name: 'search', meta: {keepAlive: true}},
    {path: '/good/:id', component: () => import('@/components/good-detail/good-detailv2'), name: 'good', meta: {keepAlive: false}},
    {path: '/cart', component: () => import('@/components/cart/shopcart'), meta: {keepAlive: true}},
    {path: '/pay', component: () => import('@/components/cart/pay'), name: 'pay', meta: {keepAlive: true}},
    {path: '/pay/deposit', component: () => import('@/components/cart/deposit'), name: 'deposit', meta: {keepAlive: true}},
    {path: '/pay/remark', component: () => import('@/components/cart/remark'), meta: {keepAlive: true}},
    {path: '/address', component: () => import('@/components/my/addressList'), name: 'addresslist', meta: {keepAlive: true}},
    {path: '/address/add', component: () => import('@/components/my/addAddress'), name: 'addaddress', meta: {keepAlive: true}},
    {path: '/address/:id/edit', component: () => import('@/components/my/editAddress'), name: 'address', meta: {keepAlive: true}},
    {path: '/order', component: () => import('@/components/order/order'), name: 'order', meta: {keepAlive: true}},
    {path: '/order/:id', component: () => import('@/components/order/orderdetail'), name: 'orderdetail', meta: {keepAlive: true}},
    {path: '/order/refund/:id', component: () => import('@/components/order/refund'), name: 'refund', meta: {keepAlive: true}},
    {path: '/order/express/:no', component: () => import('@/components/order/expresslog'), name: 'expresslog', meta: {keepAlive: true}},
    {path: '/order/:id/address', component: () => import('@/components/my/fillAddress'), name: 'filladdress', meta: {keepAlive: true}},
    {path: '/coupons', component: () => import('@/components/coupon/coupons'), name: 'coupons', meta: {keepAlive: true}},
    {path: '/coupon', component: () => import('@/components/coupon/coupon'), name: 'coupon', meta: {keepAlive: true}},
    {path: '/getcoupon', component: () => import('@/components/coupon/getcoupon2'), name: 'getcoupon', meta: {keepAlive: true}},
    {path: '/coupon/history', component: () => import('@/components/coupon/coupon-history'), name: 'couponHistory', meta: {keepAlive: true}},
    {path: '/discount/ticket', component: () => import('@/components/coupon/usecoupon'), name: 'usecoupon', meta: {keepAlive: true}},
    {path: '/footprint', component: () => import('@/components/footprint/footprint'), name: 'footprint', meta: {keepAlive: true}},
    {path: '/follow', component: () => import('@/components/follow/follow'), name: 'follow', meta: {keepAlive: true}},
    {path: '/seckill', component: () => import('@/components/seckill/seckill'), name: 'seckill', meta: {keepAlive: true}},
    {path: '/seckill/:id/detail', component: () => import('@/components/seckill/seckilldetail'), name: 'seckillDetail', meta: {keepAlive: true}},
    {path: '/myseckill', component: () => import('@/components/seckill/myseckill'), name: 'myseckill', meta: {keepAlive: true}},
    {path: '/personInfo', component: () => import('@/components/my/personInfo'), meta: {keepAlive: true}},
    {path: '/wallet', component: () => import('@/components/my/wallet'), meta: {keepAlive: true}},
    {path: '/cashdetail', component: () => import('@/components/my/cashdetail'), meta: {keepAlive: true}},
    {path: '/cashback', component: () => import('@/components/my/cashback'), meta: {keepAlive: true}},
    {path: '/cashbackdetail', component: () => import('@/components/my/cashbackdetail'), meta: {keepAlive: true}},
    {path: '/offshelf', component: () => import('@/components/common/offshelf'), name: 'notfound', meta: {keepAlive: true}},
    {path: '/info', component: () => import('@/components/common/info'), name: 'info', meta: {keepAlive: true}},
    {path: '/withdraw', component: () => import('@/components/my/withdraw'), name: 'withdraw', meta: {keepAlive: true}},
    {path: '/withdrawdetail', component: () => import('@/components/my/withdrawdetail'), name: 'withdrawdetail', meta: {keepAlive: true}},
    {path: '/promocode', component: () => import('@/components/user/promocode'), name: 'promocode', meta: {keepAlive: true}},
    {path: '/login', component: () => import('@/components/my/login'), name: 'login', meta: {keepAlive: true}},
    {path: '/my', component: () => import('@/components/my/my'), name: 'my', meta: {keepAlive: true}},
    {path: '/404', component: () => import('@/components/common/404'), name: '404', meta: {keepAlive: true}},
    {path: '/service', component: () => import('@/components/my/service'), name: 'service', meta: {keepAlive: true}},
    {path: '/guidecard', component: () => import('@/components/virtual/guidecard'), name: 'guidecard', meta: {keepAlive: true}},
    {path: '/exchangecard', component: () => import('@/components/user/exchangecard'), name: 'exchangecard', meta: {keepAlive: true}},
    {path: '/mycard', component: () => import('@/components/user/mycard'), name: 'mycard', meta: {keepAlive: true}},
    {path: '*', redirect: '/404'}
  ]
});
