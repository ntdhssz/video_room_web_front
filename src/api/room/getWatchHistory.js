import request from '../../utils/request'

export function getWatchHistory() {
  return request({
    url: '/api/room/history',
    method: 'get'
  });
}
