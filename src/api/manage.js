import { axios } from '@/utils/request'

const api = {
  user: '/user',
  fans: '/admin/fans-list',
  reward: '/admin/cash-list',
  domain: '/admin/domin-list',
  wechat: '/admin/uniac',
  service: '/custom_service/list',  // 客服接口
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  digitalReport: '/admin/report',
  fansReport: '/admin/fans-report',
  sentHistory: 'kfmsg/sent-history',
  selection:'/admin/selection-history',
  getbanner:'/admin/banner-history',
  gettop:'/admin/top-history',
  geticon:'/admin/icon-history',
  order:'/admin/order-list',
  tb_order:'/admin/tb-order-list',
  taobao:'/tbk/autho-view'
}

export default api

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}
export function getDigitalReport(parameter) {
  return axios({
    url: api.digitalReport,
    method: 'get',
    params: parameter
  })
}

export function getFansReport(parameter) {
  return axios({
    url: api.fansReport,
    method: 'get',
    params: parameter
  })
}
export function getOrderList(parameter) {//平多多
  return axios({
    url: api.order,
    method: 'post',
    data: parameter,
    timeout: 60000*10
  })
}
export function getOrderList2(parameter) {//淘宝
  return axios({
    url: api.tb_order,
    method: 'post',
    data: parameter,
    timeout: 60000*10
  })
}

export function getFansList(parameter) {
  return axios({
    url: api.fans,
    method: 'post',
    data: parameter,
  })
}

export function getRewardList(parameter) {
  return axios({
    url: api.reward,
    method: 'post',
    data: parameter
  })
}

export function getDomainList(parameter) {
  return axios({
    url: api.domain,
    method: 'get',
    data: parameter
  })
}

export function getWechatList(parameter) {
  return axios({
    url: api.wechat,
    method: 'get',
    params: parameter
  })
}

export function getTaobaoList(parameter) {
  return axios({
    url: api.taobao,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

// 获取客服列表
export function getServiceList(parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}
//获取主题列表
export function getSelectionList(parameter) {
  return axios({
    url: api.selection,
    method: 'get',
    params: parameter
  })
} 
//获取top10商品列表
export function getTop10(parameter) {
  return axios({
    url: api.gettop,
    method: 'get',
    params: parameter
  })
} 
//获取icon
export function getIcon(parameter) {
  return axios({
    url: api.geticon,
    method: 'get',
    params: parameter
  })
} 
//获取banner列表
export function getBanner(parameter) {
  return axios({
    url: api.getbanner,
    method: 'get',
    params: parameter
  })
} 
// 获取历史推送消息列表
export function getsentHistoryList(parameter) {
  return axios({
    url: api.sentHistory,
    method: 'post',
    data: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
