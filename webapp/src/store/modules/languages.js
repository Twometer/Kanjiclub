import Api from '@/services/api';

const state = {
    userLanguages: null
};

const getters = {
    UserLanguages: state => state.userLanguages
};

const actions = {
    async GetUserLanguages({ commit }) {
        let languages = (await Api.Languages.get()).data;
        commit('setLanguages', languages);
    }
};

const mutations = {
    setLanguages(state, languages) {
        state.userLanguages = languages;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
