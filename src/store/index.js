/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
// import cart from './modules/cart';
import loading from './modules/loading';
import user from './modules/user';
import { save, load, loadCookie, parseJson, saveSession, loadSession } from '@/common/js/store';
import api from '@/api/api';
Vue.use(Vuex);

const ADDRESS_LIST = 'addresses';
const USER_AMOUNT = 'userAmount';
const COUPON_AMOUNT = 'couponAmount';
const PAY_REMARK = 'remark';
const KILL_PRODUCT = 'killProducts';
const SEARCH_HISTORY = 'searchhistory';
const USED_DISCOUNT = 'USED_DISCOUNT';
const HISTORY_SIZE = 20;
const CART_AMOUNT = 'cartAmount';
const APP_CACHE = 'APP_CACHE';
const ANONYMOUS = 'anonymous';
const SKU = 'sku';
const SELECTED_SKU = 'selected_sku';
const SNS_OPEN_ID = 'openid';
const REFERER_UID = 'referer_uid';
const EXCHANGED_GOODS = 'exchanged';

// states
export const state = {
  showFooter: true,
  showTop: false,
  cartAmount: load(CART_AMOUNT, 0),
  searchDialog: false,
  showSidebar: false,
  showSidebarMask: false,
  addressList: load(ADDRESS_LIST, []),
  toastList: [],
  couponAmount: load(COUPON_AMOUNT, 0),  // 优惠券账户余额
  userAmount: load(USER_AMOUNT, 0),     // 用户账户余额
  payRemark: load(PAY_REMARK, '工作日收货'),
  killProducts: load(KILL_PRODUCT, []),  // 已参与的秒杀列表
  searchHistory: load(SEARCH_HISTORY, []),
  usedDiscount: load(USED_DISCOUNT, []),   // 已使用的折扣券
  appCache: load(APP_CACHE, {}),  // 应用缓存
  sku: {},
  selectedSku: load(SELECTED_SKU, []),  // 已选择的SKU
  showSkuWindow: false,
  openId: loadCookie(SNS_OPEN_ID, ''),
  refererUid: loadSession(REFERER_UID, ''),
  exchangedGoods: loadSession(EXCHANGED_GOODS, []) || []  // 卡券兑换的商品
};

// getters
export const getters = {
  isShowTop: state => state.showTop,
  addedProducts: state => state.products,
  showSearchBox: state => state.searchDialog,
  getAddressList: state => state.addressList,
  getDefaultAddress: state => {
    let address = state.addressList.find(addr => addr.defaultStatus == 1);
    return address || {};
  },
  showMsg (state) {
    return state.toastList.length > 0;
  },
  messageText (state) {
    return state.toastList.length > 0 ? state.toastList[0].text : null;
  },
  messageType (state) {
    return state.toastList.length > 0 ? state.toastList[0].icon : '';
  },
  checkLogined (state) {
    return typeof state.user.id !== 'undefined';
  },
  getFooterState: state => state.showFooter,
  getUserAmount: state => state.userAmount,
  getCouponAmount: state => state.couponAmount,
  getPayRemark: state => state.payRemark,
  getKilledProduct: state => state.killProducts,
  loadSearchHistory: state => state.searchHistory,
  loadUsedDiscount: state => state.usedDiscount,
  getCartAmount (state) {
   if (state.cartAmount <= 0) {
    return 0;
   } else {
    return state.cartAmount;
   }
  },
  loadAppCache: state => state.appCache,
  getSku: state => state.sku,
  getSkuWindowVisible: state => state.showSkuWindow,
  getSelectedSku: state => state.selectedSku,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.id,
  userInfo: state => state.user.userInfo,
  userProfile: state => state.user.profile,
  getOpenId (state) {
    if (state.openId) {
      return state.openId;
    } else {
      return loadCookie(SNS_OPEN_ID, '');
    }
  },
  getRefererUid: state => state.refererUid,
  getExchangedGoods: state => state.exchangedGoods
};

// actions
export const actions = {
  setExchangedGoods({commit}, goods) {
    commit(types.ADD_EXCHANGED_GOODS, goods);
  },
  setRefererUid({commit}, uid) {
    commit(types.SET_REFERER_UID, uid);
  },
  showSkuWin({commit}) {
    commit(types.SHOW_SKU_WINDOW);
  },
  hideSkuWin({commit}) {
    commit(types.HIDE_SKU_WINDOW);
  },
  addSku({commit}, sku) {
    commit(types.SAVE_SKU, {
      sku: sku
    });
  },
  // { id: 'GOODS_ID', spec: [{key: '颜色', value: '蓝'}, {key: '容量', value: '32G'}, {key: '尺寸', value: 'XL'}], checkedSpec: ['黄', '32G', 'XL'], count: 10}
  addSkuSpec({commit}, sku) {
    commit(types.ADD_SKU_SPEC, {sku: sku});
  },
  removeSkuSpec({commit}, sku) {
    commit(types.REMOVE_SKU_SPEC, {sku: sku});
  },
  reloadUserInfo({commit}) {
    state.userInfo = parseJson({});
  },
  setDefaultAddress({ commit }, address) {
    commit(types.SET_ADDRESS, {
      address: address
    });
  },
  addAddress({ commit }, address) {
    commit(types.ADD_ADDRESS, {
      address: address
    });
  },
  updateAddress({ commit }, address) {
    commit(types.UPDATE_ADDRESS, {
      address: address
    });
  },
  removeAddress({ commit }, id) {
    commit(types.REMOVE_ADDRESS, id);
  },
  addToCart({ commit }, product) {
    return new Promise((resolve, reject) => {
      api.addToCart(product).then(response => {
        if (response.code == 200) {
          commit(types.ADD_CART_AMOUNT, product.quantity);
          resolve(response);
        } else {
          reject(response.message);
        }
      }).catch(error => {
        reject(error);
      });
    });
  },
  openToast (context, payload) {
    context.commit(types.SHOW_TOAST, payload);  
    setTimeout(() => {
      context.commit(types.HIDE_TOAST);
    }, 1500);
  },
  closeToast (context) {
    context.commit(types.HIDE_TOAST);
  },
  updateCouponAmount(context, amount) {
    context.commit(types.UPDATE_COUPON_AMOUNT, amount);
  },
  addKillProduct(context, seckillId) {
    context.commit(types.ADD_SECKILL, seckillId);
  },
  removeKillProduct(context, seckillId) {
    context.commit(types.REMOVE_SECKILL, seckillId);
  },
  addSearchHistory(context, keyword) {
    if (keyword) {
      context.commit(types.ADD_SEARCH_HISTORY, keyword);
    }
  },
  clearSearchHistory(context) {
    context.commit(types.CLEAN_SEARCH_HISTORY);
  },
  addUsedDiscount(context, discount) {
    context.commit(types.ADD_USED_DISCOUNT, discount);
  },
  cleanUsedDiscount(context) {
    context.commit(types.CLEAN_USED_DISCOUNT);
  },
  /** Cache Pattern: {'home': {}} */
  updateAppCache(context, cache) {
    context.commit(types.UPDATE_APP_CACHE, cache);
  },
  cleanAppCache(context, cacheKey) {
    context.commit(types.CLEAN_APP_CACHE, cacheKey);
  },
  updateCartAmount(context, amount) {
    context.commit(types.UPDATE_CART_AMOUNT, amount);
  }
};

// mutations
export const mutations = {
  [types.ADD_EXCHANGED_GOODS](state, goods) {
    state.exchangedGoods = goods;
    saveSession(EXCHANGED_GOODS, goods);
  },
  [types.HIDE_SKU_WINDOW](state) {
    state.showSkuWindow = false;
  },
  [types.SHOW_SKU_WINDOW](state) {
    state.showSkuWindow = true;
  },
  [types.SAVE_SKU](state, { sku }) {
    state.sku = sku;
  },
  [types.ADD_SKU_SPEC](state, { sku }) {
    let maxSize = 10;
    var skuList = state.selectedSku;
    if (skuList.length > maxSize) {
      skuList.splice(maxSize - 1, skuList.length - maxSize);
    }
    for (var i = 0; i < skuList.length; i++) {
      let o = skuList[i];
      if (o.id == sku.id) {
        skuList.splice(i, 1);
      }
    }
    skuList.unshift(sku);
    state.selectedSku = skuList;
    save(SELECTED_SKU, skuList);
  },
  [types.REMOVE_SKU_SPEC](state, sku) {
    let idx = state.selectedSku.findIndex(o => o.id == sku.id);
    if (idx != -1) {
      state.selectedSku.splice(idx, 1);
    }
    save(SELECTED_SKU, state.selectedSku);
  },
  [types.SHOW_SIDEBAR](state) {
    state.showSidebar = true;
    state.showSidebarMask = true;
  },
  [types.HIDE_SIDEBAR](state) {
    state.showSidebar = false;
    setTimeout(() => {
      state.showSidebarMask = false;
    }, 500);
  },
  [types.SHOW_FOOTER](state) {
    state.showFooter = true;
  },
  [types.HIDE_FOOTER](state) {
    state.showFooter = false;
  },
  [types.SHOW_SEARCH](state) {
    state.searchDialog = true;
  },
  [types.HIDE_SEARCH](state) {
    state.searchDialog = false;
  },
  [types.SET_ADDRESS](state, { address }) {
    state.addressList = address;
    save(ADDRESS_LIST, state.addressList);
  },
  [types.ADD_ADDRESS](state, { address }) {
    if (!address.id) {
      address.id = +new Date();
    }
    state.addressList.push(address);
    save(ADDRESS_LIST, state.addressList);
  },
  [types.UPDATE_ADDRESS](state, { address }) {
    let addressList = state.addressList;
    for (let i = 0; i < addressList.length; i++) {
      let oldAddress = addressList[i];
      if (oldAddress.id === address.id) {
        oldAddress = address;
      }
    }
    save(ADDRESS_LIST, addressList);
  },
  [types.REMOVE_ADDRESS](state, id) {
    if (!id) {
      return;
    }
    let addressList = state.addressList;
    for (let i = 0; i < addressList.length; i++) {
      let address = addressList[i];
      if (address.id === id) {
        addressList.splice(i, 1);
        i--;
      }
    }
    save(ADDRESS_LIST, addressList);
  },
  [types.ADD_SEARCH_HISTORY] (state, keyword) {
    let exist = state.searchHistory.find(item => item === keyword);
    if (!exist) {
      state.searchHistory.unshift(keyword);
      save(SEARCH_HISTORY, state.searchHistory);
    }
    if (state.searchHistory.length > HISTORY_SIZE) {
      state.searchHistory.pop();
    }
  },
  [types.CLEAN_SEARCH_HISTORY] (state) {
    state.searchHistory.splice(0, state.searchHistory.length);
    save(SEARCH_HISTORY, state.searchHistory);
  },
  [types.SHOW_TOAST] (state, payload) {
    if (typeof payload == 'string') {
      state.toastList.push({text: payload || '加载中...'});
    } else {
      state.toastList.push({text: payload.message || '加载中...', icon: payload.icon});
    }
  },
  [types.HIDE_TOAST] (state) {
    state.toastList.shift();
  },
  [types.UPDATE_COUPON_AMOUNT] (state, amount) {
    state.couponAmount = amount;
    save(COUPON_AMOUNT, state.couponAmount);
  },
  [types.PAY_REMARK] (state, remark) {
    state.payRemark = remark;
    save(PAY_REMARK, state.payRemark);
  },
  [types.HIDE_TOP] (state) {
    state.showTop = false;
  },
  [types.SHOW_TOP] (state) {
    state.showTop = true;
  },
  [types.ADD_SECKILL] (state, seckillId) {
    state.killProducts.push(seckillId);
    save(KILL_PRODUCT, state.killProducts);
  },
  [types.REMOVE_SECKILL] (state, seckillId) {
    let killList = state.killProducts;
    for (let i = 0; i < killList.length; i++) {
      if (killList[i] === seckillId) {
        killList.splice(i, 1);
        i--;
      }
    }
    state.killProducts = killList;
    save(KILL_PRODUCT, killList);
  },
  [types.ADD_USED_DISCOUNT] (state, list) {
    state.usedDiscount = list;
    save(USED_DISCOUNT, state.usedDiscount);
  },
  [types.CLEAN_USED_DISCOUNT] (state) {
    state.usedDiscount = [];
    save(USED_DISCOUNT, state.usedDiscount);
  },
  [types.UPDATE_APP_CACHE] (state, cache) {
    let appCache = state.appCache;
    if (cache) {
      for (var key in cache) {
        appCache[key] = cache[key] || {};
      }
    }
    state.appCache = appCache;
    save(APP_CACHE, state.appCache);
  },
  [types.CLEAN_APP_CACHE] (state, cacheKey) {
    let appCache = state.appCache;
    if (appCache && cacheKey) {
      let val = appCache[cacheKey];
      if (val) {
        delete appCache[cacheKey];
      }
    } else {
      appCache = {};
    }
    state.appCache = appCache;
    save(APP_CACHE, state.appCache);
  },
  [types.ADD_CART_AMOUNT] (state, amount) {
    state.cartAmount = Number(state.cartAmount) + Number(amount);
    save(CART_AMOUNT, state.cartAmount);
  },
  [types.UPDATE_CART_AMOUNT] (state, amount) {
    state.cartAmount = amount;
    save(CART_AMOUNT, state.cartAmount);
  },
  [types.SET_REFERER_UID] (state, uid) {
    state.refererUid = uid;
    saveSession(REFERER_UID, state.refererUid);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    loading,
    user
  }
});
