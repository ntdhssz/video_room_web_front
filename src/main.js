// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import store from './store'
import { authCheck } from "./api/authCheck";
import Header from "./views/Header";

Vue.config.productionTip = false

Vue.use(ElementUI)
var axios = require('axios')
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.component("Header", Header)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    let token = store.state.token
    if (store.state.token) {
      authCheck(to, from, next)
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
