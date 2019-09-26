import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios,$get,$post } from '@/utils/request' // axios 不建议引入到 Vue 原型链上

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

import { ColorPicker,Button, Select ,Input,Menu,Submenu,MenuItem,container,main,card,tag,Table,TableColumn,Notification,Option,OptionGroup,RadioGroup,Radio,MessageBox} from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.use(ColorPicker)
Vue.use(Button)
// Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Select)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(RadioGroup)
Vue.use(container)
Vue.use(Radio)
Vue.use(OptionGroup)
Vue.use(main)
Vue.use(Option)
Vue.use(Submenu)
Vue.use(TableColumn)
Vue.prototype.$notify = Notification
Vue.use(card)
Vue.use(tag)
Vue.use(Table)
import {deepClone} from '@/utils'
Vue.prototype.$deepClone = deepClone

Vue.prototype.$get = $get
Vue.prototype.$post = $post

import '@/style/index.less'

import './core/use'
import bootstrap from './core/bootstrap'
import '@/permission' // permission control
import '@/utils/filter' // global filter

Vue.config.productionTip = false
Vue.use(VueAxios, router)

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
