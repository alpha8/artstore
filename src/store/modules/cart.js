/* jshint esnext: true */
import * as types from '../types';
import { save, load } from '../../common/js/store';
import api from '@/api/api';

// initial state
const state = {
  added: load('cartAdded', []),
  payGoods: load('payGoods', [])
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
    let record = state.added.find(p => p.id === product.id);
    if (!record) {
      state.added.push({
        id: product.id,
        name: product.name,
        pictures: product.pictures,
        src: product.src,
        content: product.content,
        price: product.price,
        oldPrice: product.oldPrice,
        count: product.count,
        icon: (product.pictures && product.pictures.length) ? api.CONFIG.psCtx + product.pictures[0].id + '?w=114&h=114' : api.CONFIG.defaultImg,
        checked: false
      });
    } else {
      record.count++;
    }
    save('cartAdded', state.added);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
