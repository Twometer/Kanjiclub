import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import config from './config/kanjiclub.json';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = config.apiUrl;

Vue.prototype.AppInfo = { version: config.appVer };

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
