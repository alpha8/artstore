/* jshint esnext: true */
import * as types from '../types';
import { save, load } from '../../common/js/store';

// initial state
const state = {
  added: load('cartAdded', [])
};

// getters
const getters = {
};

// actions
const actions = {
  removeCartItems({ commit }, products) {
    commit(types.REMOVE_CART_ITEM, products);
  }
};

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, { product }) {
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
    save('cartAdded', state.added);
  },
  [types.REMOVE_CART_ITEM] (state, products) {
    if (!products || products.length === 0) {
      return;
    }

    products.forEach((p) => {
      for (let i = 0; i < state.added.length; i++) {
        let item = state.added[i];
        if (item.id === p.id) {
          state.added.splice(i, 1);
        }
      }
    });
    save('cartAdded', state.added);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
