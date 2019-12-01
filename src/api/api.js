/* jshint esnext: true */
import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '../store';
import {getToken, setToken, removeToken} from '@/common/js/auth';

// axios 配置
axios.defaults.timeout = 90000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.baseURL = '';

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // if (config.method === 'post') {
  //   config.data = JSON.stringify(config.data);
  // }
  return config;
}, (error) => {
  console.log('错误的传参');
  return Promise.reject(error);
});

// 返回状态判断
axios.interceptors.response.use((response) => {
  const res = response.data;
  if (res && res.code == undefined) {
    return response;
  }
  // 401:未登录;
  if (res.code === 401 || res.code === 403) {
    MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    });
  }
  return response;
}, (error) => {  
  console.log('网络异常, err=' + error);
  return Promise.reject(error);
});

export function doPost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function doGet(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function doDelete(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    }).then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function doPut(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default {
  CONFIG: {
    APPNAME: '未来科技电商平台',
    NICKNAME: '未来科技',
    ctx: 'http://localhost:8088',
    defaultImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAMFBMVEX///+qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpufk+pAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAABv0lEQVRoge2YP1ICMRSH2R0UYZiRwlI5glfAylZP4G5twxGwt0BPgKVDs44XAFsbqW32CFTCiEAkhF3235DJyxud0d9XZRLyTXjJe9ndUgkAAAAAAAAAAADgx3DfhI5nI2Fd6xNfRsJDvVAYCt/7uwlNhQ+aXwQQ/hmhc/14xiq8EmLWYBTuyYx4yoydN+jCphRO0kNl8UIXelI4Tw+dqLJAE3alcJkOYqCCwCasrHpmZGE7/5dbsuvOalOmyQEnlF2fVOG+nD1MDlRVcb2hHuzOqtSnQugp4ZQqdG9fL5P97nhT/32m4hBfXh89HmE3Ei557pSyxa1XKGwmfEsO4YBFeBSfm4rNRR8LnXAYNVsswnpcEFXaWQsDsdi0aikfNYYyeX3VbAuOFa6yWYzWrTjtrITra0oFMfvMSBOuN1YFscchdNXG+tFarYXHaq4M4imLMFBzZRAHHMKDzdxFNu2owvjk+aULDuG2/I0yaUcUbvdhUsv5CEJn+zo173AIC1ZlJyxYlZWwvNtnLsylhq1Q94ZrKqxqfMZCj1l4P2YW9nU+U6F2gaZCPb8rZP8qwv7dBgAAAAAAAAAAAP+Lb4Qtq0R4e5WOAAAAAElFTkSuQmCC',
    usericon: 'http://imgcdn.win-berry.com/1568716692050.png?imageView2/2/w/750/h/500',
    userAvatar: 'http://imgcdn.win-berry.com/1568716692050.png?imageView2/2/w/750/h/500',
    logo: 'http://imgcdn.win-berry.com/1570705317649.png',
    qrcode: 'http://imgcdn.win-berry.com/1571967335579.jpg?imageView2/2/w/500/h/500',
    profiles: 'dev'
  },

  /**
   * 加入购物车
   */
  addToCart(data) {
    return doPost(this.CONFIG.ctx + '/cart/add', data);
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    return doGet(this.CONFIG.ctx + '/cart/list');
  },

  /**
   * 更新购物车商品SKU规格
   */
  updateCartSpec(data) {
    return doPost(this.CONFIG.ctx + '/cart/update/attr', data);
  },

  /**
   * 更新购物车商品数量
   */
  updateCartQty(params) {
    return doGet(this.CONFIG.ctx + '/cart/update/quantity', params);
  },

  /**
   * 获取某个商品的SKU列表
   */
  getProductSkuSpecs(productId) {
    return doGet(this.CONFIG.ctx + '/cart/getProduct/' + productId);
  },

  /**
   * 删除购物车中某个商品
   */
  deleteCartProducts(params) {
    return doPost(this.CONFIG.ctx + '/cart/delete', params);
  },

  /**
   * 生成确认单
   */
  cartToOrder(data) {
    return doPost(this.CONFIG.ctx + '/cart/cartToOrder', data);
  },

  /**
   * 立即购买
   */
  addToConfirmOrder(data) {
    return doPost(this.CONFIG.ctx + '/cart/addToConfirmOrder', data);
  },

  /**
   * 清空购物车
   */
  clearCart() {
    return doPost(this.CONFIG.ctx + '/cart/clear');
  },

  /**
   * 获取某个用户购物车中商品的促销信息
   */
  getCartPromotion() {  
    return doPost(this.CONFIG.ctx + '/cart/list/promotion');
  },

  /**
   * 添加会员商品收藏
   */
  addProductCollect(data) {  
    return doPost(this.CONFIG.ctx + '/member/collection/addProduct', data);
  },

  /**
   * 批量添加会员商品收藏
   */
  batchCollect(data) {  
    return doPost(this.CONFIG.ctx + '/member/collection/batchcollect', data);
  },

  /**
   * 删除会员商品收藏
   */
  removeProductCollect(memberId, productId) {  
    return doPost(`${this.CONFIG.ctx}/member/collection/deleteProduct?memberId=${memberId}&productId=${productId}`);
  },

  /**
   * 显示会员商品收藏列表
   */
  getProductCollect(memberId) {  
    return doGet(this.CONFIG.ctx + '/member/collection/listProduct/' + memberId);
  },

  /**
   * 显示会员商品收藏列表
   */
  existCollect(memberId, productId) {  
    return doGet(`${this.CONFIG.ctx}/member/collection/exist/${memberId}/${productId}`);
  },

  /**
    * 微信公众号签名
    */
  apiSign(url) {
    return doGet(this.CONFIG.ctx + '/weixin/apiSign?url=' + url);
  },

  /**
   * 根据购物车生成确认订单
   * @return {[type]} [description]
   */
  generateConfirmOrder() {
    return doPost(this.CONFIG.ctx + '/order/generateConfirmOrder');
  },

  /**
   * 创建支付订单
   * @return {[type]} [description]
   */
  generateOrder(data) {
    return doPost(this.CONFIG.ctx + '/order/generateOrder', data);
  },

  /**
   * 直接调用微信统一下单接口，用于改价后重新生成订单
   * @return {[type]} [description]
   */
  unifiedOrder(data) {
    return doPost(this.CONFIG.ctx + '/order/wx/unifiedOrder', data);
  },

  /**
   * 重试发送微信支付
   * @param  {[type]} prepayId [description]
   * @return {[type]}          [description]
   */
  wxpaySign(prepayId) {
    return doGet(this.CONFIG.ctx + '/order/wxpaySign?prepayId=' + prepayId);
  },

  /**
    * 申请退款
    */
  refund(params) {
    return doPost(this.CONFIG.ctx + '/order/user/refund', params);
  },

  /**
    * 取消退款申请
    */
  cancelRefund(params) {
    return doPost(this.CONFIG.ctx + '/order/user/cancelRefund', params);
  },

  /**
    * 设置订单收货地址(用于拍卖业务)
    */
  updateOrderAddress(params) {
    return doPost(this.CONFIG.ctx + '/order/address', params);
  },

  /** 获取所有商品列表 */
  GetGoods(params) {
    return doGet(this.CONFIG.ctx + '/product/list', params);
  },
  /** 查询单个商品详情 */
  GetGoodDetail(id) {
    return doGet(this.CONFIG.ctx + '/product/detail/' + id);
  },
  /** 获取所有商品分类 */
  GetCategories() {
    return doGet(this.CONFIG.ctx + '/home/list/withChildren');
  },

  /**
   * 获取用户足迹
   */
  getFootprint(params) {
    return doGet(this.CONFIG.ctx + '/member/readHistory/list', params);
  },

  /**
   * 删除用户足迹
   */
  removeFootprint(data) {
    return doPost(this.CONFIG.ctx + '/member/readHistory/delete', data);
  },

  /**
   * 创建订单
   */
  createOrder(params) {
    return doPost(this.CONFIG.ctx + '/order', params);
  },

  /**
   * 取消订单
   */
  cancelOrder(id) {
    return doPost(this.CONFIG.ctx + '/order/cancelOrder?orderId=' + id);
  },

  /**
   * 查询订单列表
   */
  getOrders(params) {
    return doGet(this.CONFIG.ctx + '/order/list', params);
  },

  /**
   * 查询单个订单详情
   */
  getOrderDetail(orderSn) {
    return doGet(this.CONFIG.ctx + '/order/' + orderSn);
  },

  /**
   * 确认收货
   */
  confirmDelivery(id) {
    return doPut(this.CONFIG.ctx + '/order/received/' + id);
  },

  /**
   * 领取优惠券
   */
  takeCoupon(couponId) {
    return doPost(this.CONFIG.ctx + '/member/coupon/add/' + couponId);
  },

  /**
   * 获取所有的优惠券列表
   */
  getAllCoupons() {
    return doGet(this.CONFIG.ctx + '/member/coupon/alllist');
  },

  /**
   * 获取当前用户的优惠券列表
   */
  getCoupons() {
    return doGet(this.CONFIG.ctx + '/member/coupon/list');
  },

  /**
   * 获取购物车相关优惠券
   */
  getCartCoupons(type) {
    return doGet(this.CONFIG.ctx + '/member/coupon/list/cart/' + type);
  },

   /**
    * 获取用户收货地址列表
    */
  getAddressList() {
    return doGet(this.CONFIG.ctx + '/member/address/list');
  },

   /**
    * 新增收货地址
    */
  addAddress(address) {
    return doPost(this.CONFIG.ctx + '/member/address/add', address);
  },

   /**
    * 更新收货地址
    */
  updateAddress(id, address) {
    return doPost(this.CONFIG.ctx + '/member/address/update/' + id, address);
  },

   /**
    * 删除收货地址
    */
  removeAddress(id) {
    return doPost(this.CONFIG.ctx + '/member/address/delete/' + id);
  },

   /**
    * 查询收货地址
    */
  getAddress(id) {
    return doGet(this.CONFIG.ctx + '/user/address' + id);
  },

   /**
    * 优惠券充值
    */
  depositCoupon(params) {
    return doPost(this.CONFIG.ctx + '/user/wallet/recharge', params);
  },

   /**
    * 优惠券账户余额
    */
  getCouponAmount(userId) {
    return doGet(this.CONFIG.ctx + '/user/wallet?userId=' + userId);
  },

   /**
    * 发送手机验证码
    */
  getVerifyCode(tel) {
    return doGet(this.CONFIG.ctx + '/sso/getAuthCode?telephone=' + tel);
  },

  /**
   * 用户注册或登录
   */
  ssoLogin(data) {
    return doPost(this.CONFIG.ctx + '/sso/login', data);
  },

  /**
   * 获取当前登录的用户信息
   */
  getInfo() {
    return doGet(this.CONFIG.ctx + '/sso/info');
  },

  /**
   * 注销或登出
   */
  logout() {
    return doPost(this.CONFIG.ctx + '/sso/logout');
  },

  /**
   * 刷新token
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  refreshToken() {
    return doGet(this.CONFIG.ctx + '/sso/token/refresh');
  },

   /**
    * 秒杀列表
    */
  getSeckills(params) {
    return doGet(this.CONFIG.ctx + '/seckill/list', params);
  },

   /**
    * 秒杀单品详情
    */
  getSeckillDetail(id, params) {
    return doGet(this.CONFIG.ctx + '/seckill/' + id + '/detail', params);
  },

   /**
    * 秒杀单品详情及用户是否参与秒杀
    */
  getSeckillDetailAndUser(id, userId, params) {
    return doGet(`${this.CONFIG.ctx}/seckill/${id}/detail/${userId}`, params);
  },

   /**
    * 获取秒杀URL
    */
  getSeckillUrl(seckillId) {
    return doPost(this.CONFIG.ctx + '/seckill/' + seckillId + '/exposer');
  },

   /**
    * 执行秒杀
    */
  killGoods(seckillId, md5, userLevel) {
    return doPost(this.CONFIG.ctx + '/seckill/' + seckillId + '/' + md5 + '/execution/v2?userLevel=' + userLevel);
  },

   /**
    * 秒杀成功列表
    */
  getSuccessSeckills(params) {
    return doGet(this.CONFIG.ctx + '/seckill/successkilled/list', params);
  },

  /**
   * 取消秒杀订单
   */
  cancelSeckillOrder(params) {
    return doPost(this.CONFIG.ctx + '/seckill/' + params.seckillId + '/cancel', params);
  },

  /**
   * 结束秒杀订单
   */
  finishSeckill(seckillId, orderNo) {
    return doPost(`${this.CONFIG.ctx}/seckill/${seckillId}/finish/v2?orderNo=${orderNo}`);
  },

   /**
    * 当前时间
    */
  getServerTime() {
    return doGet(this.CONFIG.ctx + '/seckill/time/now');
  },

   /**
    * 预售提醒
    * type;  //0,秒杀，1：拍卖
    */
  reservedNotify(params) {
    return doPost(this.CONFIG.ctx + '/artwork/attention', params);
  },

   /**
    * 到货提醒
    */
  arrivalNotify(params) {
    return doPost(this.CONFIG.ctx + '/artwork/book', params);
  },

   /**
    * 查询指定活动
    */
  getQrcode(id) {
    return doGet(this.CONFIG.ctx + '/qrcode/' + id);
  },

   /**
    * 查询二维码领取优惠券活动
    */
  resolveQrcode(id) {
    return doGet(this.CONFIG.ctx + '/qrcode/resolve?id=' + id);
  },

   /**
    * 查询专属活动列表
    */
  getCouponList(params) {
    return doGet(this.CONFIG.ctx + '/qrcode/list', params);
  },

   /**
    * 查询专属活动列表
    */
  generateQrcode(params) {
    return doPost(this.CONFIG.ctx + '/qrcode/group2', params);
  },

   /**
    * 二维码领取
    */
  receiveQrcode(params) {
    return doGet(this.CONFIG.ctx + '/coupon/receive', params);
  },

  /**
   * 查询首页栏目列表数据
   */
  getHomeList(params) {
    return doGet(this.CONFIG.ctx + '/home/content', params);
  },

  /**
   * 获取推荐的商品列表
   */
  getRecommendProducts(params) {
    return doGet(this.CONFIG.ctx + '/home/recommendProductList', params);
  },

  /**
   * 奖金提现
   */
  withdraw(params) {
    return doPost(this.CONFIG.ctx + '/sendRedPack', params);
  },

  /**
   * 奖金提现记录
   */
  withdrawLog(params) {
    return doGet(this.CONFIG.ctx + '/redPack/list', params);
  },

  /**
   * 发货日志
   */
  getDeliveryLog(params) {
    return doGet(this.CONFIG.ctx + '/deliverlog/list', params);
  },

  /** 查询物流信息 */
  getExpressLog(params) {
    return doGet(this.CONFIG.ctx + '/express/query', params);
  },

  /**
   * 查询当前用户的所有的订单状态
   */
  getTodoOrderStats(params) {
    return doGet(this.CONFIG.ctx + '/order/todo', params);
  },

  /**
   * 卡片兑换
   */
  exchangeCard(params) {
    return doPost(this.CONFIG.ctx + '/card/exchange', params);
  },

  /** 查询用户积分明细 */
  getIntegrationLog(params) {
    return doGet(this.CONFIG.ctx + '/sso/integration/log', params);
  },

  /** 我的卡券 */
  getMyCards(params) {
    return doGet(this.CONFIG.ctx + '/card/list', params);
  }
};
