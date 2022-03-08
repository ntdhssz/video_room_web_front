import request from '../../utils/request'
import store from "../../store";

export function logout() {
  return request({
    url: '/api/login/logout',
    method: 'post',
    data: {
      id: store.state.id,
      token: store.state.token
    }
  });
}
