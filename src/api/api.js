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
   cmsCtx: '/cms',
   webCtx: '/yihu',
   psCtx: '/ps/download/',
   defaultImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAMFBMVEX///+qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpufk+pAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAABv0lEQVRoge2YP1ICMRSH2R0UYZiRwlI5glfAylZP4G5twxGwt0BPgKVDs44XAFsbqW32CFTCiEAkhF3235DJyxud0d9XZRLyTXjJe9ndUgkAAAAAAAAAAADgx3DfhI5nI2Fd6xNfRsJDvVAYCt/7uwlNhQ+aXwQQ/hmhc/14xiq8EmLWYBTuyYx4yoydN+jCphRO0kNl8UIXelI4Tw+dqLJAE3alcJkOYqCCwCasrHpmZGE7/5dbsuvOalOmyQEnlF2fVOG+nD1MDlRVcb2hHuzOqtSnQugp4ZQqdG9fL5P97nhT/32m4hBfXh89HmE3Ei557pSyxa1XKGwmfEsO4YBFeBSfm4rNRR8LnXAYNVsswnpcEFXaWQsDsdi0aikfNYYyeX3VbAuOFa6yWYzWrTjtrITra0oFMfvMSBOuN1YFscchdNXG+tFarYXHaq4M4imLMFBzZRAHHMKDzdxFNu2owvjk+aULDuG2/I0yaUcUbvdhUsv5CEJn+zo173AIC1ZlJyxYlZWwvNtnLsylhq1Q94ZrKqxqfMZCj1l4P2YW9nU+U6F2gaZCPb8rZP8qwv7dBgAAAAAAAAAAAP+Lb4Qtq0R4e5WOAAAAAElFTkSuQmCC'
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
   * 用户登录
   */
  Login() {
    return doGet('/wxservice/baseInfo');
  },

  /**
   * 加入收藏
   */
  mark(params) {
    return doPost(this.CONFIG.cmsCtx + '/user/collect', params);
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
    return doPut(this.CONFIG.cmsCtx + '/order/cancel', params);
  },

  /**
   * 查询订单列表
   */
  getOrders(params) {
    return doGet(this.CONFIG.cmsCtx + '/order/list', params);
  },

  /**
   * 查询订单列表
   */
  getOrderDetail(id) {
    return doGet(this.CONFIG.cmsCtx + '/order/' + id);
  },

  /** 获取微信支付接口参数 */
  wxpay(params) {
    return doPost('/wxservice/wx/pay', params);
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
  }
};
