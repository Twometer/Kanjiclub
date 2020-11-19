import Api from '@/services/api'

const state = {
    lessons: null
};

const getters = {
    Lessons: state => state.lessons
};

const actions = {
    async GetLessons({ getters, commit }) {
        let language = getters.Language;
        let lessons = (await Api.Lessons.get(language)).data;
        commit('setLessons', lessons);
    }
};

const mutations = {
    setLessons(state, lessons) {
        state.lessons = lessons;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};