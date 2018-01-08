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
      let img = api.CONFIG.defaultImg;
      if (product.pictures && product.pictures.length) {
        let pic = product.pictures[0];
        if (pic && pic.width < pic.height) {
          img = api.CONFIG.psCtx + pic.id + '?w=750&h=500&v=v2';
        } else {
          img = api.CONFIG.psCtx + pic.id + '?w=750&h=500';
        }
      }
      state.added.push({
        id: product.id,
        name: product.name,
        pictures: product.pictures,
        src: product.src,
        content: product.content,
        price: product.price,
        oldPrice: product.oldPrice,
        count: product.count,
        icon: img,
        stock: product.stock,
        checked: true
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
