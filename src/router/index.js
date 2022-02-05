import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index'
import Login from '../views/Login'
import HelloWorld from "../components/HelloWorld";

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: HelloWorld,
    },
  ]
})
