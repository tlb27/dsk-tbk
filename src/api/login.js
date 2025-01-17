import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: api.Login, //, //auth/login
    method: 'post',
    data: parameter
  })
}
//获取所以公众号
export function getAlluniac(parameter) {
  return axios({
    url: api.get_all_unica,
    method: 'get',
    params: parameter
  })
}
export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded '
    }
  })
}

export function getInfo() {
  return axios({
    url: api.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
