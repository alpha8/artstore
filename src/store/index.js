/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
import cart from './modules/cart';
import loading from './modules/loading';
import { save, load, loadCookie } from '../common/js/store';

Vue.use(Vuex);

const ADDRESS_LIST = 'addresses';

// states
export const state = {
  showFooter: true,
  cartAmount: load('cartAmount', 0),
  products: load('products', {}),
  searchDialog: false,
  showSidebar: false,
  showSidebarMask: false,
  userInfo: JSON.parse(loadCookie('wxuser', '{}')),
  defaultAddress: JSON.parse(load('defaultAddress', '{}')),
  addressList: load(ADDRESS_LIST, [])
};

// getters
export const getters = {
  cartProducts: state => state.cart.added,
  addedProducts: state => state.products,
  showSearchBox: state => state.searchDialog,
  getUserInfo: state => state.userInfo,
  checkLogined: state => typeof state.userInfo.openid !== 'undefined',
  getDefaultAddress: state => state.defaultAddress,
  getAddressList: state => state.addressList
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
  updateAddress({ commit }, id, address) {
    commit(types.UPDATE_ADDRESS, {
      id: id,
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
    state.cartAmount = amount;
    state.products = goods;
    state.cart.added = added;
    save('cartAdded', state.cart.added);
    save('cartAmount', state.cartAmount);
    save('products', state.products);
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
      state.products[sid]--;
    }
    save('products', state.products);
    save('cartAmount', state.cartAmount);
  },
  [types.CLEAR_CART](state) {
    state.cartAmount = 0;
    save('cartAmount', state.cartAmount);
  },
  [types.SET_ADDRESS](state, { address }) {
    state.defaultAddress = address;
    save('defaultAddress', address);
  },
  [types.ADD_ADDRESS](state, { address }) {
    if (!address.id) {
      address.id = +new Date();
    }
    state.addressList.push(address);
    save(ADDRESS_LIST, address);
  },
  [types.UPDATE_ADDRESS](state, { id, address }) {
    if (!id) {
      return;
    }
    let addressList = state.addressList;
    for (let i = 0; i < addressList.length; i++) {
      let oldAddress = addressList[i];
      if (oldAddress.id === id) {
        addressList.splice(i, 1);
        addressList.push(address);
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
