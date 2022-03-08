import request from '../../utils/request'

export function getRoomInfo(id) {
  return request({
    url: '/api/room/' + id,
    method: 'get'
  });
}
