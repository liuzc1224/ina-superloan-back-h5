import axios from "@/libs/api.request";

const map_url = {
  order_audit_report: "/risk/statement/order/audit/map",//订单审核
  reviewers_audit_today: "/risk/statement/riskEmployee/audit/map",//今日信审人员审核
  historical_ending: "/risk/statement/history/pay/map",//历史放款
  historical_repayment: "/risk/statement/history/repay/map",//历史案件还款
  channel_transformation: "/risk/statement/channel/conversion/map",//渠道转化
  refusal_today: "/risk/statement/audit/refuse/map",//今日拒绝
  operate_report: "/cashloanoper/map",
  operate_map: "risk/statement/operate/map",//汇总页面
};
const data_url = {
  order_audit_report: "/risk/statement/order/audit/data",
  reviewers_audit_today: "/risk/statement/riskEmployee/audit/data",
  historical_ending: "/risk/statement/history/pay/data",
  historical_repayment: "/risk/statement/history/repay/data",
  channel_transformation: "/risk/statement/channel/conversion/data",
  refusal_today: "/risk/statement/audit/refuse/data",
  operate_report: "/cashloanoper/get",
};
//现金贷风控报表charts图
export const getRiskMap = (url, params) => {
  return axios.request({
    url: map_url[url],
    method: "get",
    params: params
  });
};

//现金贷风控报表data表
export const getRiskData = (url, params) => {
  return axios.request({
    url: data_url[url],
    method: "get",
    params: params
  });
};

//现金贷风控报表charts图
export const getOperateReportMap = (url, params) => {
  return axios.request({
    url: map_url[url],
    method: "get",
    params: params
  });
};

//现金贷运营报表data表
export const getOperateReportList = (url, params) => {
  return axios.request({
    url: data_url[url],
    method: "get",
    params: params
  });
};

//获取汇率
export const getRate = () => {
  return axios.request({
    url: '/cashloanoper/rate',
    method: "get"
  });
};
//删除所有现金贷风控报表
export const delRiskData = () => {
  return axios.request({
    url: '/risk/statement/truncate/tables',
    method: "delete"
  });
};
