import Vue from 'vue';
import App from './App.vue';

import './plugins/axios';
import vuetify from './plugins/vuetify';
import JsonCSV from 'vue-json-csv';

import router from './router/index.js';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');

Vue.component('downloadCsv', JsonCSV);
