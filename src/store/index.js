/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
import cart from './modules/cart';
import loading from './modules/loading';
import { save, load } from '../common/js/store';

Vue.use(Vuex);

// states
export const state = {
  showFooter: true,
  cartAmount: load('cartAmount', 0),
  products: load('products', {}),
  searchDialog: false,
  showSidebar: false,
  showSidebarMask: false
};

// getters
export const getters = {
  cartProducts: state => state.cart.added,
  addedProducts: state => state.products,
  showSearchBox: state => state.searchDialog
};

// actions
export const actions = {
  addToCart({ commit }, product) {
    commit(types.ADD_TO_CART, {
      product: product
    });
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
