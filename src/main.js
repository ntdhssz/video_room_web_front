// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import Header from "./components/Header";
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs';
import store from './store';
import { authCheck } from "./api/login/authCheck";
import VideoPlayer from 'vue-video-player';
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';
const hls = require('videojs-contrib-hls');
Vue.use(hls);

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VideoPlayer);
let axios = require('axios');
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$store = store;
Vue.component("Header", Header);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    let token = store.state.token;
    if (token) {
      authCheck(to, from, next);
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
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
