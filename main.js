import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui";
import wxShare from '@/common/wechatMP.js'

Vue.use(uView);
// import vconsole from 'vconsole' // 引入vconsole
// Vue.prototype.$vconsole = new vconsole() // 使用vconsole

import http from './api/index'
import cache from './utils/cache'
import mcUtils from './utils/mcUtils'

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$cache = cache;
Vue.prototype.$utils = mcUtils;
Vue.prototype.$api = {http};
Vue.prototype.$wxin = wxShare.initShare;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
