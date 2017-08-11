/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
import cart from './modules/cart';
import loading from './modules/loading';
import { save, load, loadCookie } from '../common/js/store';
Vue.use(Vuex);

const ADDRESS_LIST = 'addresses';
const USER_AMOUNT = 'userAmount';
const COUPON_AMOUNT = 'couponAmount';
const PAY_REMARK = 'remark';

// states
export const state = {
  showFooter: true,
  cartAmount: load('cartAmount', 0),
  products: load('products', {}),
  searchDialog: false,
  showSidebar: false,
  showSidebarMask: false,
  userInfo: JSON.parse(loadCookie('wxuser', '{"activateTime":0,"createAt":1500652800000,"icon":"http://wx.qlogo.cn/mmhead/jRoggJ2RF3D7sZjekK8gksnaoHhXlklibA2licFtLibTUeee8IiahAKwjQ/0","nickName":"🐳 Alpha🐯","openid":"oimf-jrjcbSAtz59WOc_bkzbJHWA","sex":"1","status":0,"type":0,"userId":38}')),
  addressList: load(ADDRESS_LIST, []),
  toastList: [],
  couponAmount: load(COUPON_AMOUNT, 0),  // 优惠券账户余额
  userAmount: load(USER_AMOUNT, 0),     // 用户账户余额
  payRemark: load(PAY_REMARK, '工作日收货')
};

// getters
export const getters = {
  cartProducts: state => state.cart.added,
  addedProducts: state => state.products,
  showSearchBox: state => state.searchDialog,
  getUserInfo: state => state.userInfo,
  checkLogined: state => typeof state.userInfo.openid !== 'undefined',
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
  getFooterState: state => state.showFooter,
  getUserAmount: state => state.userAmount,
  getCouponAmount: state => state.couponAmount,
  getPayRemark: state => state.payRemark
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
    state.cartAmount++;

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
    if (state.cartAmount > 0) {
      state.cartAmount--;
    }

    let sid = prefix + id;
    let product = state.products[sid];
    if (product) {
      product--;
      state.cart.added.forEach(p => {
        if (p.id === id) {
          p.count = product;
        }
      });
      state.products[sid] = product;
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
          delete goodCount['p' + good.id];
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
  [types.PAY_REMARK] (state, remark) {
    state.payRemark = remark;
    save(PAY_REMARK, state.payRemark);
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
