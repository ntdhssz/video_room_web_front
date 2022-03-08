import request from '../../utils/request'

export function loginNameCheck(loginName) {
  return request({
    url: '/api/register/login-name-check',
    method: 'get',
    params: {
      login_name: loginName
    }
  });
}
