import request from '@/utils/request'
import store from "../store";

export function authLogin() {
  return request({
    url: '/api/login/authLogin',
    method: 'get'
  })
}
