import axios from '@/libs/api.request'

export const login = ({
  username,
  password
}) => {
  let data = new FormData()
  data.append('username', username)
  data.append('password', password)
  return axios.request({
    url: '/employee/login',
    data,
    method: 'post'
    // headers:{"Content-Type":"application/x-www-form-urlencoded"}
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

//获取用户注册列表
export const getRegUserList = query => {
  return axios.request({
    url: '/user',
    method: 'get',
    params: query
  })
}

//获取黑白名单列表
export const getBlackandWhiteList = query => {
  return axios.request({
    url: '/blackandwhite/getList',
    method: 'get',
    params: query
  })
}

//删除黑白名单
export const deleteBlackandWhiteList = id => {
  return axios.request({
    url: `/blackandwhite/${id}`,
    method: 'delete'
  })
}

//新增黑白名单
export const addBlackandWhiteList = params => {
  return axios.request({
    url: '/blackandwhite',
    method: 'post',
    data: params
  })
}
//修改黑白名单
export const putBlackandWhiteList = params => {
  return axios.request({
    url: '/blackandwhite',
    method: 'put',
    data: params
  })
}
