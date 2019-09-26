<template>
  <div class="user-wrapper">
    <a-button :icon="refreshable?'loading':'reload'" type="primary" @click="ToggleRefresh">
      <!--刷新-->
    </a-button>
    <a-select default-value="" style="width: 120px;margin-left:20px" @change="uniacchoose">
      <a-select-option value="">
        全部
      </a-select-option>
      <a-select-option v-for="(item,i) in user_uniacs_list" :key="i" :value="item.uniac_id">
        {{ item.uniac_name }}
      </a-select-option>
    </a-select>
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="avatar()" />
        <span>{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ name: 'center' }">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    HeaderNotice
    // userInfo:[]
  },
  created() {
    //  this.userInfo= JSON.parse(window.localStorage['user_uniacs_list'])
  },
  methods: {
    uniacchoose(value, b, c) {
      console.log(value, b, c, 'choose')
      const that = this
      let uniac_name = ''
      const status = this.user_uniacs_list.some(item => {
        if (item.uniac_id === value) {
          uniac_name = item.uniac_name
          return true
        }
        return false
      })

      if (status) {
        that.Setuniac_id({ uniac_id: value, uniac_name: uniac_name })
      } else {
        that.Setuniac_id({ uniac_id: '', uniac_name: '' })
      }
    },
    ...mapActions(['Logout', 'Setuniac_id', 'ToggleRefresh']),
    ...mapGetters(['nickname', 'avatar', 'uniac_id']),
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel() {
        }
      })
    }
  },
  computed: {
    ...mapGetters(['user_uniacs_list', 'refreshable'])
  },
  watch: {
    user_uniacs_list() {
      return this.user_uniacs_list
    }
  }
}
</script>
