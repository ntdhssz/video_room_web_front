import request from '../utils/request'

export function getRoomUser(userId) {
  return request({
    url: '/api/room/get_room_user',
    method: 'get',
    params: {
      user_id: userId
    }
  })
}
