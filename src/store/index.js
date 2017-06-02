/* jshint esnext: true */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './mutation-types';

Vue.use(Vuex);

// actions
const actions = {
  addToCart({ commit }, product) {
    if (product.inventory > 0) {
      commit(types.ADD_TO_CART, {
        id: product.id
      });
    }
  }
};

// getters
const getters = {
  cartProducts: state => {
    return state.cart.added.map(({ id, quantity }) => {
      const product = state.products.all.find(p => p.id === id);
      return {
        title: product.title,
        price: product.price,
        quantity
      };
    });
  }
};

export default new Vuex.Store({
  actions,
  getters
});
