/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types';
import cart from './modules/cart';

Vue.use(Vuex);

// actions
export const actions = {
  addToCart({ commit }, product) {
    commit(types.ADD_TO_CART, {
      product: product
    });
  }
};

// getters
export const getters = {
  cartProducts: state => state.cart.added,
  addedProducts: state => state.products
};

// states
export const state = {
  loading: false,
  showFooter: true,
  cartAmount: 0,
  products: {}
};

const prefix = 'p';
// mutations
export const mutations = {
  [types.SHOW_LOADING](state) {
    state.loading = true;
  },
  [types.HIDE_LOADING](state) {
    state.loading = false;
  },
  [types.SHOW_FOOTER](state) {
    state.showFooter = true;
  },
  [types.HIDE_FOOTER](state) {
    state.showFooter = false;
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
  },
  [types.CLEAR_CART](state) {
    state.cartAmount = 0;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    cart
  }
});
