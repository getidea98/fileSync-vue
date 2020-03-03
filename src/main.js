import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icon/iconfont.css'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

import axios from 'axios'
import {Message} from "element-ui";

axios.defaults.baseURL = 'http://localhost:8080/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
    config.headers.Platform = 'web';
  return config;
});
Vue.prototype.$axios = axios;
Vue.prototype.$message = Message;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
