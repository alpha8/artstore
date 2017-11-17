/* jshint esnext: true */
import axios from 'axios';

// axios 配置
axios.defaults.timeout = 3000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.baseURL = '';

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log('错误的传参');
  return Promise.reject(error);
});

// 返回状态判断
axios.interceptors.response.use((res) => {
  return res;
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
   cmsCtx: 'http://www.yihuyixi.com/cms',
   wxCtx: 'http://www.yihuyixi.com/wxservice',
   webCtx: 'http://www.yihuyixi.com/yihu',
   auctionCtx: 'http://www.yihuyixi.com/cmsAuction',
   seckillCtx: 'http://www.yihuyixi.com/goodsKill',
   psCtx: 'http://www.yihuyixi.com/ps/download/',
   defaultImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAMFBMVEX///+qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpufk+pAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAABv0lEQVRoge2YP1ICMRSH2R0UYZiRwlI5glfAylZP4G5twxGwt0BPgKVDs44XAFsbqW32CFTCiEAkhF3235DJyxud0d9XZRLyTXjJe9ndUgkAAAAAAAAAAADgx3DfhI5nI2Fd6xNfRsJDvVAYCt/7uwlNhQ+aXwQQ/hmhc/14xiq8EmLWYBTuyYx4yoydN+jCphRO0kNl8UIXelI4Tw+dqLJAE3alcJkOYqCCwCasrHpmZGE7/5dbsuvOalOmyQEnlF2fVOG+nD1MDlRVcb2hHuzOqtSnQugp4ZQqdG9fL5P97nhT/32m4hBfXh89HmE3Ei557pSyxa1XKGwmfEsO4YBFeBSfm4rNRR8LnXAYNVsswnpcEFXaWQsDsdi0aikfNYYyeX3VbAuOFa6yWYzWrTjtrITra0oFMfvMSBOuN1YFscchdNXG+tFarYXHaq4M4imLMFBzZRAHHMKDzdxFNu2owvjk+aULDuG2/I0yaUcUbvdhUsv5CEJn+zo173AIC1ZlJyxYlZWwvNtnLsylhq1Q94ZrKqxqfMZCj1l4P2YW9nU+U6F2gaZCPb8rZP8qwv7dBgAAAAAAAAAAAP+Lb4Qtq0R4e5WOAAAAAElFTkSuQmCC'
  },

  /**
   * 微信登录
   */
  Login() {
    return doGet(this.CONFIG.wxCtx + '/baseInfo');
  },

  /** 获取微信支付接口参数 */
  wxpay(params) {
    return doPost(this.CONFIG.wxCtx + '/wx/pay', params);
  },

  /**
    * 微信公众号签名
    */
  wxsignature(url) {
    return doGet(this.CONFIG.wxCtx + '/wx/sign?url=' + url);
  },

  /**
    * 跟踪物流
    */
  trackingGoods(expressNo, expressCode) {
    return doGet(this.CONFIG.wxCtx + '/order/express?expressNo=' + expressNo + '&expressCode=' + expressCode);
  },

  /**
    * 申请退款
    */
  refund(params) {
    return doPost(this.CONFIG.cmsCtx + '/order/user/refund', params);
  },

  /**
    * 取消退款申请
    */
  cancelRefund(params) {
    return doPost(this.CONFIG.cmsCtx + '/order/user/cancelRefund', params);
  },

  /**
    * 设置订单收货地址(用于拍卖业务)
    */
  updateOrderAddress(params) {
    return doPost(this.CONFIG.cmsCtx + '/order/address', params);
  },

  /** 获取所有商品列表 */
  GetGoods(params) {
    return doGet(this.CONFIG.cmsCtx + '/artwork/list', params);
  },
  /** 查询单个商品详情 */
  GetGood(id) {
    return doGet(this.CONFIG.webCtx + '/artwork/' + id);
  },
  /** 获取所有商品分类 */
  GetCategories() {
    return doGet(this.CONFIG.cmsCtx + '/datadic/childrens?parentPath=cms/basedata/tea/type');
  },
  /** 获取商品分类统计值 */
  getTeaTotal() {
    return doGet(this.CONFIG.webCtx + '/service/tea/total');
  },
  /** 查询数据字典配置值 */
  GetConfigList(parent) {
    return doGet(this.CONFIG.cmsCtx + '/datadic/childrens?parentPath=' + (parent || ''));
  },

  /**
   * 加入收藏
   */
  mark(params) {
    return doPost(this.CONFIG.cmsCtx + '/user/collect', params);
  },

  /**
   * 取消收藏
   */
  unmark(params) {
    return doDelete(this.CONFIG.cmsCtx + '/user/collect', params);
  },

  /**
   * 获取用户商品收藏
   */
  getUserCollect(params) {
    return doGet(this.CONFIG.webCtx + '/user/artwork/collects', params);
  },

  /**
   * 删除指定商品收藏
   */
  removeCollect(params) {
    return doDelete(this.CONFIG.webCtx + '/user/collect', params);
  },

  /**
   * 获取用户足迹
   */
  getFootprint(params) {
    return doGet(this.CONFIG.webCtx + '/history/list', params);
  },

  /**
   * 删除用户足迹
   */
  removeFootprint(oid) {
    return doDelete(this.CONFIG.webCtx + '/history?id=' + oid);
  },

  /**
   * 清空用户足迹
   */
  clearFootprint(userId) {
    return doDelete(this.CONFIG.webCtx + '/history/clear?userId=' + userId);
  },

  /**
   * 创建订单
   */
  createOrder(params) {
    return doPost(this.CONFIG.cmsCtx + '/order', params);
  },

  /**
   * 取消订单
   */
  cancelOrder(params) {
    return doPost(this.CONFIG.cmsCtx + '/order/cancel', params);
  },

  /**
   * 查询订单列表
   */
  getOrders(params) {
    return doGet(this.CONFIG.cmsCtx + '/order/list', params);
  },

  /**
   * 查询单个订单详情
   */
  getOrderDetail(params) {
    return doGet(this.CONFIG.cmsCtx + '/order', params);
  },

  /**
   * 确认收货
   */
  confirmDelivery(params) {
    return doPost(this.CONFIG.cmsCtx + '/order/received', params);
  },

   /**
    * 获取用户收货地址列表
    */
  getAddressList(userId) {
    return doGet(this.CONFIG.cmsCtx + '/user/addressList?userId=' + userId);
  },

   /**
    * 新增收货地址
    */
  addAddress(address) {
    return doPost(this.CONFIG.cmsCtx + '/user/address', address);
  },

   /**
    * 更新收货地址
    */
  updateAddress(address) {
    return doPut(this.CONFIG.cmsCtx + '/user/address', address);
  },

   /**
    * 删除收货地址
    */
  removeAddress(address) {
    return doDelete(this.CONFIG.cmsCtx + '/user/address', address);
  },

   /**
    * 查询优惠券明细
    */
  getCoupons(userId) {
    return doGet(this.CONFIG.cmsCtx + '/coupon/list?userId=' + userId);
  },

   /**
    * 优惠券充值
    */
  depositCoupon(params) {
    return doPost(this.CONFIG.cmsCtx + '/user/wallet/recharge', params);
  },

   /**
    * 优惠券账户余额
    */
  getCouponAmount(userId) {
    return doGet(this.CONFIG.cmsCtx + '/user/wallet?userId=' + userId);
  },

   /**
    * 发送手机验证码
    */
  getVerifyCode(mobile) {
    return doGet(this.CONFIG.webCtx + '/user/code?mobileNumber=' + mobile);
  },

   /**
    * 验证手机验证码
    */
  verifyCode(mobile, code) {
    return doGet(this.CONFIG.webCtx + '/user/verificationCodeByMobile?mobileNumber=' + mobile + '&code=' + code);
  },

   /**
    * 获取用户基础数据
    */
  getUserProfile(userId) {
    return doGet(this.CONFIG.cmsCtx + '/user/profile?userId=' + userId);
  },

   /**
    * 秒杀列表
    */
  getSeckills(params) {
    return doGet(this.CONFIG.seckillCtx + '/seckill/list', params);
  },

   /**
    * 秒杀单品详情
    */
  getSeckillDetail(id) {
    return doGet(this.CONFIG.seckillCtx + '/seckill/' + id + '/detail');
  },

   /**
    * 获取秒杀URL
    */
  getSeckillUrl(seckillId) {
    return doPost(this.CONFIG.seckillCtx + '/seckill/' + seckillId + '/exposer');
  },

   /**
    * 执行秒杀
    */
  killGoods(seckillId, md5) {
    return doPost(this.CONFIG.seckillCtx + '/seckill/' + seckillId + '/' + md5 + '/execution');
  },

   /**
    * 秒杀成功列表
    */
  getSuccessSeckills(params) {
    return doGet(this.CONFIG.seckillCtx + '/seckill/successkilled/list', params);
  },

  /**
   * 取消秒杀订单
   */
  cancelSeckillOrder(params) {
    return doPost(this.CONFIG.seckillCtx + '/seckill/' + params.seckillId + '/cancel', params);
  },

  /**
   * 结束秒杀订单
   */
  finishSeckill(seckillId) {
    return doPost(this.CONFIG.seckillCtx + '/seckill/' + seckillId + '/finish');
  },

   /**
    * 当前时间
    */
  getServerTime() {
    return doGet(this.CONFIG.seckillCtx + '/seckill/time/now');
  },

   /**
    * 预售提醒
    * type;  //0,秒杀，1：拍卖
    */
  reservedNotify(params) {
    return doPost(this.CONFIG.cmsCtx + '/artwork/attention', params);
  },

   /**
    * 查询指定代理商活动
    */
  getQrcode(id) {
    return doGet(this.CONFIG.cmsCtx + '/qrcode/list?provideId=' + id);
  },

   /**
    * 查询二维码领取优惠券活动
    */
  resolveQrcode(id) {
    return doGet(this.CONFIG.cmsCtx + '/qrcode/resolve?id=' + id);
  },

   /**
    * 二维码领取
    */
  receiveQrcode(params) {
    return doGet(this.CONFIG.cmsCtx + '/coupon/receive', params);
  },

   /**
    * 团购列表
    */
  getGroupbuys(params) {
    return doGet(this.CONFIG.cmsCtx + '/groupBuy/list', params);
  },

   /**
    * 团购单品详情
    */
  getGroupbuyDetail(id) {
    return doGet(this.CONFIG.cmsCtx + '/groupBuy/' + id);
  },

   /**
    * 查询商品评论列表
    */
  getProductComments(params) {
    return doGet(this.CONFIG.cmsCtx + '/comment/list', params);
  },

   /**
    * 获取拍卖列表
    */
  getAuctions(params) {
    return doGet(this.CONFIG.auctionCtx + '/auctionList', params);
  },

   /**
    * 查询指定用户参与的所有拍卖
    */
  getAuctionsByUID(params) {
    return doGet(this.CONFIG.auctionCtx + '/auctionListByUserNameId', params);
  },

   /**
    * 获取单个拍品
    */
  getAuction(id) {
    return doGet(this.CONFIG.auctionCtx + '/auction/' + id);
  },

   /**
    * 出价
    */
  bidPrice(params) {
    return doPost(this.CONFIG.auctionCtx + '/auctionProductPriceRecord', params);
  },

   /**
    * 获取出价列表
    */
  getBidPrices(params) {
    return doGet(this.CONFIG.auctionCtx + '/auctionProductPriceRecordList', params);
  }
};
