import store from "../../store";
import {authLogin} from "./authLogin";

export function authCheck(to, from, next) {
  authLogin().then(res => {
    let data = res.data.data;
    store.commit('SET_NICK_NAME', data.nick_name);
    store.commit('SET_AVATAR', data.avatar);
    next();
  }).catch(failResponse => {
    store.commit("REMOVE_INFO");
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    });
  });
}
