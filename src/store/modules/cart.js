/* jshint esnext: true */
import * as types from '../types';

// initial state
const state = {
  added: JSON.parse(localStorage.getItem('cartAdded')) || []
};

// getters
const getters = {
};

// actions
const actions = {
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
        count: product.count,
        checked: false
      });
    } else {
      record.count++;
    }
    localStorage.setItem('cartAdded', JSON.stringify(state.added));
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
