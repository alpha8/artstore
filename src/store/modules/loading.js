/* jshint esnext: true */
import * as types from '../types';

const state = {
  loadingList: []
};

const mutations = {
  [types.SHOW_LOADING] (state, payload) {
    state.loadingList.push({text: payload || '加载中...'});
  },
  [types.HIDE_LOADING] (state) {
    state.loadingList.shift();
  }
};

const getters = {
  isLoading (state) {
    return state.loadingList.length > 0;
  },
  loadingText (state) {
    return state.loadingList.length > 0 ? state.loadingList[0].text : null;
  }
};

const actions = {
  openLoading (context, payload) {
    context.commit(types.SHOW_LOADING, payload);
    setTimeout(() => {
      context.commit(types.HIDE_LOADING);
    }, 4000);
  },
  closeLoading (context) {
    context.commit(types.HIDE_LOADING);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
