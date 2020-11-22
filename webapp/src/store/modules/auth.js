import axios from 'axios';

const state = {
    user: null
};

const getters = {
    User: state => state.user,
    Language: state => state.user.settings.currentLanguage,
    LoggedIn: state => state.user != null
};

const actions = {
    async Register(_, form) {
        await axios.post('accounts/new', form);
    },

    async Login({ dispatch }, form) {
        await axios.post('accounts/login', form);
        await dispatch('GetUserInfo');
    },

    async LogOut({ commit }) {
        await axios.post('accounts/logout');
        commit('setUser', null);
    },

    async GetUserInfo({ commit }, form) {
        let response = await axios.get('accounts/me', form);
        commit('setUser', response.data);
    },

    async ResetUser({ commit }) {
        commit('setUser', null);
    }
};

const mutations = {
    setUser(state, user) {
        state.user = user;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
