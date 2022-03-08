import request from '../../utils/request'

export function getRoomUser(userId) {
  return request({
    url: '/api/room/user/' + userId,
    method: 'get'
  });
}
