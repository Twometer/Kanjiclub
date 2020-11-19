import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import auth from './modules/auth'
import languages from './modules/languages'
import lessons from './modules/lessons'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: { auth, languages, lessons },
    plugins: [ createPersistedState() ]
});
