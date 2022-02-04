import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: localStorage.getItem('id'),
    nick_name: localStorage.getItem('nick_name'),
    token: localStorage.getItem('token'),
    avatar: localStorage.getItem('avatar')
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
      localStorage.setItem("id", id)
    },
    SET_NICK_NAME: (state, nick_name) => {
      state.nick_name = nick_name
      localStorage.setItem("nick_name", nick_name)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      localStorage.setItem("avatar", avatar)
    },
    REMOVE_INFO: state => {
      state.id = ''
      state.nick_name = ''
      state.token = ''
      state.avatar = ''
      localStorage.setItem("id", '')
      localStorage.setItem("nick_name", '')
      localStorage.setItem("token", '')
      localStorage.setItem("avatar", '')
    }
  },
  getters: {

  },
  actions: {

  },
  modules: {

  }
})
