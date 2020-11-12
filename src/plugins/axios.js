import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'https://api-psi-geadv.herokuapp.com';

Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios;
  },
});
