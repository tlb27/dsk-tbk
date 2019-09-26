const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  refreshable: state => state.app.refreshable,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  uniac_id: state => state.user.uniac_id,
  uniac_name: state => state.user.uniac_name,
  user_uniacs_list: state => state.user.user_uniacs_list,
  all_uniacs_list: state => state.user.all_uniac_list

}

export default getters
