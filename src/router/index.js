import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index'
import Login from '../views/Login'
import HelloWorld from "../components/HelloWorld";
import Room from '../views/Room'
import CreateRoom from "../views/CreateRoom";
import MyRoom from "../views/MyRoom";
import Chat from "../views/Chat";

Vue.use(Router)

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
      path: '/hello',
      name: 'Hello',
      component: HelloWorld,
    },
    {
      path: '/room/:id',
      name: 'Room',
      component: Room,
      meta: {
        requireAuth: true
      }
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
      path: '/chat',
      name: 'Chat',
      component: Chat,
      meta: {
        requireAuth: true
      }
    }
  ]
})
