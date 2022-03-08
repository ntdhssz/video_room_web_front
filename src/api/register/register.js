import request from '../../utils/request'

export function register(registerForm) {
  return request({
    url: '/api/register',
    method: 'post',
    data: {
      login_name: registerForm.login_name,
      nick_name: registerForm.nick_name,
      password: registerForm.password,
      confirm_password: registerForm.confirm_password
    }
  });
}
