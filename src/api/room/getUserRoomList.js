import request from '../../utils/request'

export function getUserRoomList() {
  return request({
    url: '/api/room/my',
    method: 'get'
  });
}
