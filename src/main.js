import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import httpRequest from './utils/httpRequest'
import request from './utils/request'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

Vue.prototype.$http = request // ajax请求方法
Vue.prototype.$store = store // ajax请求方法
Vue.prototype.computedHeight = function() {
  const argArr = arguments
  let totalHeight = 0
  for (let i = 0; i < argArr.length; i++) {
    if (document.getElementsByClassName(argArr[i])[0]) {
      totalHeight += document.getElementsByClassName(argArr[i])[0].offsetHeight
    }
  }
  return totalHeight
}
Vue.prototype.doResize = function(tab) {
  setTimeout(() => {
    const height = this.computedHeight(
      'site-navbar',
      'el-tabs__header',
      'operationCont',
      'paginationCont'
    )
    const length = tab.split('/').length
    const dom = document.getElementsByClassName(tab.split('/')[length - 1] + '-table')[0]
    if (dom) {
      dom.style.height = window.innerHeight - height - 140 + 'px'
    }
  }, 50)
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import * as mock from '../mock'
if (process.env.NODE_ENV === 'production') {
  mock.mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
