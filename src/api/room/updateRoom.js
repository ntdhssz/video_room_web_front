import request from '../../utils/request'

export function updateRoom(roomId, data) {
  return request({
    url: '/api/room/' + roomId,
    method: 'put',
    data: {
      title: data.title,
      type: data.type,
      video_name: data.video_name,
      video_url: data.video_url,
      choose_video: data.choose_video,
    }
  });
}
