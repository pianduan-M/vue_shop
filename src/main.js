import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式表
import './assets/css/global.css'

// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器 每次请求携带token值
axios.interceptors.request.use((config) => {
  // 请求头添加token值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 每次都必须把config返回出去
  return config
})
// 格式化时间的过滤器
Vue.filter('formatTime', function(time) {
  let dt = new Date(time)
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1 + '').padStart(2, '0')
  let d = (dt.getDate() + '').padStart(2, '0')

  let h = (dt.getHours() + '').padStart(2, '0')
  let mm = (dt.getMinutes() + '').padStart(2, '0')
  let s = (dt.getSeconds() + '').padStart(2, '0')

  return y + '-' + m + '-' + d + '    ' + h + ':' + mm + ':' + s
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

let vm = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
