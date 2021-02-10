import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式表
import './assets/css/global.css'

// 引入字体图标
import './assets/fonts/iconfont.css'
// 导入树状表格
import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor /* { default global options } */)
// 页面加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器 每次请求携带token值
axios.interceptors.request.use((config) => {
  // 进度条开始
  NProgress.start()
  // 请求头添加token值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 每次都必须把config返回出去
  return config
})

// axios 请求成功
axios.interceptors.response.use((config) => {
  NProgress.done()
  console.log(config.data.meta.status)
  if (config.data.meta.status === 400) {
    router.replace('/login')
  }
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

Vue.component('tree-table', TreeTable)

let vm = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
