import request from '../utils/request'

export function authLogin() {
  return request({
    url: '/api/login/authLogin',
    method: 'post'
  })
}
