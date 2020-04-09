import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import {get, post} from './utils/http'
import timer from './config/config';

Vue.use(Antd)
Vue.use(ElementUI)
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.Timer = timer

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
