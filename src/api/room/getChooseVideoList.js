import request from '../../utils/request'

export function getChooseVideoList() {
  return request({
    url: '/api/room/videos',
    method: 'get'
  });
}
