/* jshint esnext: true */
import * as types from '../mutation-types';

// initial state
const state = {
  added: [],
  checkoutStatus: null
};

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
};

// actions
const actions = {
  checkout ({ commit, state }, products) {
    // const savedCartItems = [...state.added];
    commit(types.CHECKOUT_REQUEST);
  }
};

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, { product }) {
    state.lastCheckout = null;
    let record = state.added.find(p => p.id === product.id);
    if (!record) {
      state.added.push({
        id: product.id,
        name: product.name,
        icon: product.icon,
        src: product.src,
        info: product.info,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        count: product.count
      });
    } else {
      record.count++;
    }
  },

  [types.CHECKOUT_REQUEST] (state) {
    // clear cart
    state.added = [];
    state.checkoutStatus = null;
  },

  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful';
  },

  [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
    // rollback to the cart saved before sending the request
    state.added = savedCartItems;
    state.checkoutStatus = 'failed';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
