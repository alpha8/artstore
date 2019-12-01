import api from '@/api/api';
import {getToken, setToken, removeToken} from '@/common/js/auth';

const SSO_KEYNAME = 'sso';
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    userInfo: {},
    profile: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_USERID: (state, id) => {
      state.id = id;
    },
    SET_USERINFO: (state, user) => {
      state.userInfo = user;
    },
    SET_PROFILE: (state, profile) => {
      state.profile = profile;
    },
    CLEAR_PROFILE: (state) => {
      state.profile = {};
      state.userInfo = {};
      state.id = '';
      state.avatar = '';
      state.name = '';
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username;
      return new Promise((resolve, reject) => {
        api.ssoLogin({
          username: userInfo.username,
          code: userInfo.code || '',
          password: userInfo.password || ''
        }).then(response => {
          if (response.code != 200 || !response.data) {
            reject('服务器开了小差，请稍候再试');
            return;
          }
          const data = response.data;
          const tokenStr = data.tokenHead + data.token;
          setToken(tokenStr);
          commit('SET_TOKEN', tokenStr);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getInfo().then(response => {
          const data = response.data;
          const member = data.member || {};
          commit('SET_NAME', member.nickname || member.username);
          commit('SET_AVATAR', member.icon);
          commit('SET_USERID', member.id);
          commit('SET_USERINFO', member);
          commit('SET_PROFILE', data);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('CLEAR_PROFILE');
          removeToken(SSO_KEYNAME);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('CLEAR_PROFILE');
        removeToken(SSO_KEYNAME);
        resolve();
      });
    }
  }
};

export default user;
