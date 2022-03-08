import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/Index'
import Login from '../views/Login'
import Register from "../views/Register";
import Room from '../views/Room'
import MyRoom from "../views/MyRoom";
import CreateRoom from "../views/CreateRoom";
import EditRoom from "../views/EditRoom";
import History from "../views/History";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: '/index'
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
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/room/create',
      name: 'CreateRoom',
      component: CreateRoom,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/room/my',
      name: 'MyRoom',
      component: MyRoom,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/room/history',
      name: 'History',
      component: History,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/room/edit/:id',
      name: 'EditRoom',
      component: EditRoom,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/room/:id',
      name: 'Room',
      component: Room,
      meta: {
        requireAuth: true
      }
    }
  ]
})
