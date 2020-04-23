// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入elementUI组件库
import ElementUI from 'element-ui'
// 导入elementUI的样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入公共样式
import '@/assets/common.css'

// 导入moment函数
import moment from 'moment'
// 把axios绑定到Vue的原型上
import axios from 'axios'
// 导入element-tree-grid插件, 导入的就是一个别人定义好的组件
import ElTreeGrid from 'element-tree-grid'

// 注册一个全局的组件
// el-table-tree-column
// console.log('el-table-tree-column', ElTreeGrid)
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.prototype.axios = axios

// 全局过滤器
Vue.filter('dataFilter', (input, fromat = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(fromat)
})

// axios的默认全局配置只适合配置一些不会发生改变的值
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置axios的拦截器
// 拦截器:当axios请求的时候,首先会经过这个拦截器
// 请求拦截器:拦截请求
// 响应拦截器:拦截响应
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做什么
    // console.log('haha,请求被我拦截到了吧', config)
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (res) {
    // 对响应数据做点什么
    // console.log('拦截到了响应', res)
    // 直接返回res.data，对应的就是服务器返回的数据
    return res.data
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
