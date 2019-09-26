import Vue from 'vue'
import { login, getInfo, logout,getAlluniac} from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: 'longer',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    uniac_id: '',
    uniac_name: '',
    user_uniacs_list: [],
    all_uniac_list:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_uniac_id: (state, params) => {
      state.uniac_id = params.uniac_id
      state.uniac_name = params.uniac_name
    },
    SET_uniacs_list: (state, user_uniacs_list) => {
      state.user_uniacs_list = user_uniacs_list
    },
    SET_Alluniacs_list: (state, all_uniac_list) => {
      state.all_uniac_list = all_uniac_list
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve,reject) => {
        login(userInfo).then(response => {
          if (response.error == 0) {
            // window.localStorage['user_uniacs_list']= JSON.stringify(response.user_uniacs_list)
            Vue.ls.set(ACCESS_TOKEN, response.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', response.token)
          }
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      }) 
    },
    // 设置 uniac_id
    Setuniac_id({ commit }, params) {
      commit('SET_uniac_id', params)
    },
    GetAlluniac({ commit },params){
      return new Promise((resolve,reject)=>{
        getAlluniac().then(response => {
          var list=[]
          var list2=[]
          for(var item of response.admin_info_list){
            if(item.data.uniac_id){
              list2.push(item)
             for(var i=0;i<item.data.uniac_id.split(",").length;i++){
                list.push({uniac_id:Number(item.data.uniac_id.split(",")[i]),uniac_name:item.data.uniac_name.split(",")[i]})
              }
            }
          }
        commit('SET_Alluniacs_list', list)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response
          if (result.role && result.role.length > 0) {
            const role = result.role
            // role.permissions = result.role.permissions
            // role.permissions.map(per => {
            //   if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //     const action = per.actionEntitySet.map(action => { return action.action })
            //     per.actionList = action
            //   }
            // })
            // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_uniacs_list', response.user_uniacs_list)
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(response)
        })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
