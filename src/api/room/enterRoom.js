import request from '../../utils/request'

export function enterRoom(id) {
  return request({
    url: '/api/room/enter/' + id,
    method: 'get'
  });
}
