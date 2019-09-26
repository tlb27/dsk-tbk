import axios from 'axios'
import store from '@/store'

const token = store.getters.token
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000 // 请求超时时间
})

service.interceptors.request.use(config => {
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
})

export default service
