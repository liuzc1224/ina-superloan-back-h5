import axios from '@/libs/api.request'
//获取用户列表
export const getUserList = (query) => {
    return axios.request({
      url: '/userInfo/getList',
      params:query,
      method: 'get'
    })
  }
  //获取用户详情
  export const getUserDetail = (query) => {
    return axios.request({
      url: '/userInfo/getDetail',
      params:query,
      method: 'get'
    })
  }
  //修改用户状态
  export const editUserStatus = (params) => {
    return axios.request({
      url: '/userInfo/update',
      data: params,
      method: 'post'
    })
  }

  //获取用户邀请记录
  export const getUserInviteList = (query) => {
    return axios.request({
      url: 'getUserInviteList',
      params:query,
      method: 'get'
    })
  }