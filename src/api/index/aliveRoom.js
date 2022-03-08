import request from '../../utils/request'

export function aliveRoom(query_info) {
  return request({
    url: 'api/index',
    method: 'get',
    params: {
      'type': query_info.type,
      'keyword': query_info.keyword,
      'page': query_info.page,
      'page_size': query_info.pageSize,
    }
  });
}
