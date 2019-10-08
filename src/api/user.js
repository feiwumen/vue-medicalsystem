import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manager/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/manager/query',
    method: 'get',
    params: { userId }
  })
}

export function logout() {
  return request({
    url: '/manager/logout',
    method: 'post'
  })
}
