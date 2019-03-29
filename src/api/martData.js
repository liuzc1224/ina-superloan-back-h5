import axios from "@/libs/api.request";

//获取渠道转化报表格
export const getChannelChangeList = (params) => {
  return axios.request({
    url: "/channelconvert",
    method: "get",
    params: params
  });
};

//获取产品点击报表格
export const getProductClickList = (params) => {
  return axios.request({
    url: "/market/statement/click",
    method: "get",
    params: params
  });
};

//获取数据总览
export const getTotalDataList = (params) => {
  return axios.request({
    url: "/market/statement/total",
    method: "get",
    params: params
  });
};

//获取数据总览
export const getUseChangeList = (params) => {
  return axios.request({
    url: "/market/statement/user/conversion",
    method: "get",
    params: params
  });
};

//获取转化数据
export const getConversion = (params) => {
  return axios.request({
    url: "/market/statement/some/conversion",
    method: "get",
    params: params
  });
};
