import request from '../../utils/request'

export function authLogin() {
  return request({
    url: '/api/login/auth-login',
    method: 'post'
  });
}
