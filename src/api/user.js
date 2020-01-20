import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/yun-accounts-api/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  console.log('获取用户信息', token);
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
