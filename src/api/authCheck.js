import request from '@/utils/request'
import store from "../store";
import {authLogin} from "./authLogin";

export function authCheck(to, from, next) {
  return authLogin().then(res => {
    if (res.data.code !== 200) {
      store.commit("REMOVE_INFO")
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  })
    .catch(failResponse => {
      store.commit("REMOVE_INFO")
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    })
}
