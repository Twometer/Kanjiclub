import Api from '@/services/api'

const state = {
    currentPractice: null
};

const getters = {
    CurrentPractice: state => state.currentPractice
};

const actions = {

    async NewPractice({ getters, commit }, payload) {
        let language = getters.Language;
        let practice = await Api.Practice.new(language, payload);
        commit('setPractice', practice);
    },

};

const mutations = {
    setPractice(state, practice) {
        state.currentPractice = practice;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};