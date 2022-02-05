import store from "../store";
import {authLogin} from "./authLogin";

export function authCheck(to, from, next) {
  return authLogin().then(res => {
    let data = res.data.data
    this.$store.commit('SET_NICK_NAME', data.nick_name)
    this.$store.commit('SET_AVATAR', data.avatar)
    next()
  })
    .catch(failResponse => {
      store.commit("REMOVE_INFO")
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    })
}
