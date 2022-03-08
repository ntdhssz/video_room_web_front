import request from '../../utils/request'

export function deleteRoom(id) {
  return request({
    url: '/api/room/' + id,
    method: 'delete'
  });
}
