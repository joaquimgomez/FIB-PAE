import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import {store} from "./store/index";
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';


Vue.use(VueAxios, axios)
Vue.use(ElementUI, {locale});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
