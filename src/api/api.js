/* jshint esnext: true */
import axios from 'axios';
import qs from 'qs';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = '';

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
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
  alert('网络异常, err=' + error);
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
  /** 获取所有商品列表 */
  GetGoods() {
    return doGet('/api/goods');
  },
  /** 查询单个商品详情 */
  GetGood(id) {
    return doGet('/api/good/' + id);
  },
  /** 获取所有商品分类 */
  GetCategories() {
    return doGet('/api/category');
  },

  /**
   * 用户登录
   */
  Login() {
    return doGet('/wxservice/baseInfo');
  },
  /**
   * 用户注册
   */
  Regist(params) {
    return doPost('/users/api/userRegist', params);
  },

  /**
   * 发送注册验证码
   */
   RegistVerifiCode(tellphone) {
     return doPost('/users/api/registVerifiCode', {tellphone: tellphone});
   },

  /**
   * 获取用户信息
   */
  UserInfo(id) {
    return doPost('/users/api/userInfo', {userId: id});
  },

  /**
   * 获取全国JSON数据
   */
   getAddressJson() {
     return doPost('/api/address');
   },

   /** 获取微信支付接口参数 */
   wxpay(params) {
    return doGet('/wxservice/wx/pay', params);
   }
};