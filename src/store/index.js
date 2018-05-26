/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
import cart from './modules/cart';
import loading from './modules/loading';
import { save, load, loadCookie, parseJson } from '../common/js/store';
Vue.use(Vuex);

const ADDRESS_LIST = 'addresses';
const USER_AMOUNT = 'userAmount';
const COUPON_AMOUNT = 'couponAmount';
const USER_PROFILE = 'userProfile';
const PAY_REMARK = 'remark';
const KILL_PRODUCT = 'killProducts';
const SEARCH_HISTORY = 'searchhistory';
const USED_DISCOUNT = 'USED_DISCOUNT';
const HISTORY_SIZE = 10;
const ANONYMOUS = 'anonymous';
const DEFAULT_USER = '{"activateTime":0,"createAt":1500652800000,"nickName":"🐳 Alpha🐯","openid":"oimf-jrjcbSAtz59WOc_bkzbJHWA","sex":"1","status":0,"type":0,"userId":38, "icon": "http://thirdwx.qlogo.cn/mmopen/vi_32/Qh7KvJCbGynQiaSxvup9KP0SHmRnua0kJYzKWPRYGPvCwpDjZf8JiahrodQZNwbRjh1b4oRicOABr73DjGSrZ6vAA/132"}';

// states
export const state = {
  showFooter: true,
  showTop: false,
  cartAmount: load('cartAmount', 0),
  products: load('products', {}),
  searchDialog: false,
  showSidebar: false,
  showSidebarMask: false,
  userInfo: parseJson(loadCookie('wxuser', DEFAULT_USER), {}),
  addressList: load(ADDRESS_LIST, []),
  toastList: [],
  userProfile: load(USER_PROFILE, {}),
  couponAmount: load(COUPON_AMOUNT, 0),  // 优惠券账户余额
  userAmount: load(USER_AMOUNT, 0),     // 用户账户余额
  payRemark: load(PAY_REMARK, '工作日收货'),
  killProducts: load(KILL_PRODUCT, []),  // 已参与的秒杀列表
  searchHistory: load(SEARCH_HISTORY, []),
  usedDiscount: load(USED_DISCOUNT, []),   // 已使用的折扣券
  anonymous: load(ANONYMOUS, '')
};

// getters
export const getters = {
  isShowTop: state => state.showTop,
  cartProducts: state => state.cart.added,
  addedProducts: state => state.products,
  showSearchBox: state => state.searchDialog,
  getUserInfo: state => state.userInfo,
  getAddressList: state => state.addressList,
  getDefaultAddress: state => {
    let address = state.addressList.find(addr => addr.default);
    return address || {};
  },
  getPayGoods: state => state.cart.payGoods,
  showMsg (state) {
    return state.toastList.length > 0;
  },
  messageText (state) {
    return state.toastList.length > 0 ? state.toastList[0].text : null;
  },
  checkLogined (state) {
    state.userInfo = parseJson(loadCookie('wxuser', DEFAULT_USER), {});
    return typeof state.userInfo.openid !== 'undefined';
  },
  getFooterState: state => state.showFooter,
  getUserAmount: state => state.userAmount,
  getCouponAmount: state => state.couponAmount,
  getUserProfile: state => state.userProfile,
  getPayRemark: state => state.payRemark,
  getKilledProduct: state => state.killProducts,
  loadSearchHistory: state => state.searchHistory,
  loadUsedDiscount: state => state.usedDiscount,
  getAnonymous: state => state.anonymous
};

// actions
export const actions = {
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
    commit(types.ADD_TO_CART, {
      product: product
    });
  },
  clearCart({ commit }) {
    commit(types.CLEAR_CART);
  },
  removeSameTypeGoods({commit}, goods) {
    commit(types.REMOVE_SAMETYPE_GOODS, goods);
  },
  removeCartItems({ commit }, products) {
    if (!products || products.length === 0) {
      return;
    }

    let amount = state.cartAmount;
    let goods = state.products;
    let added = state.cart.added;
    products.forEach((p) => {
      for (let i = 0; i < added.length; i++) {
        let item = added[i];
        if (item.id === p.id) {
          added.splice(i, 1);
          amount -= item.count;
          delete goods['p' + p.id];
        }
      }
    });
    state.cartAmount = amount <= 0 ? 0 : amount;
    state.products = goods;
    state.cart.added = added;
    save('cartAdded', state.cart.added);
    save('cartAmount', state.cartAmount);
    save('products', state.products);
  },
  addPayGoods({commit}, products) {
    if (!products || products.length === 0) {
      return;
    }
    commit(types.ADD_PAYGOODS, {
      goods: products
    });
  },
  clearPayGoods({commit}) {
    commit(types.CLEAR_PAYGOODS);
  },
  openToast (context, payload) {
    context.commit(types.SHOW_TOAST, payload);
    setTimeout(() => {
      context.commit(types.HIDE_TOAST);
    }, 3000);
  },
  closeToast (context) {
    context.commit(types.HIDE_TOAST);
  },
  updateCouponAmount(context, amount) {
    context.commit(types.UPDATE_COUPON_AMOUNT, amount);
  },
  updateUserProfile(context, profile) {
    context.commit(types.USER_PROFILE, profile);
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
  setAnonymous() {
    let anon = state.anonymous;
    let uid = state.userInfo && state.userInfo.userId;
    if (!anon && !uid) {
      let now = +new Date();
      let rand = Math.round(Math.random() * 1000);
      let unlogin = 'u' + now + rand;
      state.anonymous = unlogin;
      save(ANONYMOUS, state.anonymous);
    }
  }
};

const prefix = 'p';
// mutations
export const mutations = {
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
  [types.ADD_QUANTITY](state, id) {
    if (id.indexOf('_') === -1) {
      state.cartAmount++;
    }

    let sid = prefix + id;
    let product = state.products[sid];
    if (!product) {
      state.products[sid] = 1;
    } else {
      state.products[sid]++;
    }
    save('products', state.products);
    save('cartAmount', state.cartAmount);
  },
  [types.REDUCE_QUANTITY](state, id) {
    if (id.indexOf('_') === -1 && state.cartAmount > 0) {
      state.cartAmount--;
    }

    let sid = prefix + id;
    let product = state.products[sid];
    if (product) {
      product--;
      if (product <= 0) {
        delete state.products[sid];
        let arr = state.cart.added;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id || arr[i].extendId === id) {
            state.cart.added.splice(i, 1);
          }
        }
      } else {
        state.cart.added.forEach(p => {
          if (p.id === id || p.extendId === id) {
            p.count = product;
          }
        });
        state.products[sid] = product;
      }
    }
    save('cartAdded', state.cart.added);
    save('products', state.products);
    save('cartAmount', state.cartAmount);
  },
  [types.CLEAR_CART](state) {
    state.cartAmount = 0;
    state.products = {};
    state.cart.added = [];
    save('products', state.products);
    save('cartAdded', state.cart.added);
    save('cartAmount', state.cartAmount);
  },
  [types.REMOVE_SAMETYPE_GOODS](state, goods) {
    let arr = state.cart.added;
    goods.forEach(good => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === good.id || arr[i].extendId === good.id) {
          state.cart.added.splice(i, 1);
        }
      }
      delete state.products[prefix + good.extendId];
    });
    save('cartAdded', state.cart.added);
    save('products', state.products);
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
      }
    }
    save(ADDRESS_LIST, addressList);
  },
  [types.ADD_PAYGOODS](state, {goods}) {
    state.cart.payGoods = goods;
    save('payGoods', state.cart.payGoods);
  },
  [types.CLEAR_PAYGOODS](state) {
    let goods = state.cart.payGoods;
    let cartGoods = state.cart.added;
    let goodCount = state.products;
    goods.forEach(good => {
      for (let i = 0; i < cartGoods.length; i++) {
        if (cartGoods[i].id === good.id) {
          cartGoods.splice(i, 1);
          if (!good.extendId) {
            delete goodCount['p' + good.id];
          } else {
            delete goodCount['p' + good.extendId];
          }
          state.cartAmount -= good.count;
        }
      }
    });
    state.cart.added = cartGoods;
    state.cart.payGoods = [];
    save('cartAdded', state.cart.added);
    save('payGoods', state.cart.payGoods);
    state.products = goodCount;
    save('products', state.products);
    save('cartAmount', state.cartAmount);
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
    state.toastList.push({text: payload || '加载中...'});
  },
  [types.HIDE_TOAST] (state) {
    state.toastList.shift();
  },
  [types.UPDATE_COUPON_AMOUNT] (state, amount) {
    state.couponAmount = amount;
    save(COUPON_AMOUNT, state.couponAmount);
  },
  [types.USER_PROFILE] (state, profile) {
    state.userProfile = profile;
    save(USER_PROFILE, profile);
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
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    cart,
    loading
  }
});
