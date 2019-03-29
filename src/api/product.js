import axios from '@/libs/api.request'
//获取信用卡列表
export const getCardManageList = (query) => {
    return axios.request({
      url: '/creditCard/query',
      params:query,
      method: 'get'
    })
  }
  //删除信用卡列表
  export const deleteTableList = data => {
    return axios.request({
      url: `/creditCard/delete/${data}`,
      method:"delete"
    })
  }
  // 添加信用卡信息
  export const postCardInfo = (formdata,config) => {
    return axios.request({
      url: '/creditCard/add',
      data: formdata,
      config,
      method: 'post'
    })
  }
  // 修改信用卡信息
  export const editCardInfo = (formdata,config) => {
    return axios.request({
      url: '/creditCard/update',
      data: formdata,
      config,
      method: 'post'
    })
  }
  //获取用户信用卡记录
  export const getUserCardList = (query) => {
    return axios.request({
      url: '/creditCardAccount/query',
      params:query,
      method: 'get'
    })
  }
  //获取用户账单
  export const getUserBillList = (query) => {
    return axios.request({
      url: '/tally/list',
      params:query,
      method: 'get'
    })
  }
  //获取用户征信记录
  export const getUserCreditInfo = (query) => {
    return axios.request({
      url: '/spc/list',
      params:query,
      method: 'get'
    })
  }
  //获取用户征信详情
  export const getUserCreditDetail = (query) => {
    return axios.request({
      url: '/spc/querySpcByCpf',
      params:query,
      method: 'get'
    })
  }
  