import Api from '@/services/api';

const state = {
    currentPractice: null,
    currentSelection: [],
};

const getters = {
    CurrentPractice: state => state.currentPractice,
    SelectedPractices: state => state.currentSelection
};

const actions = {
    async NewPractice({ getters, commit }, payload) {
        let language = getters.Language;
        let practice = await Api.Practice.new(language, payload);
        commit('setPractice', practice.data);
    }
};

const mutations = {
    setPractice(state, practice) {
        state.currentPractice = practice;
    },
    setPracticeSelection(state, selection) {
        state.currentSelection = selection;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
