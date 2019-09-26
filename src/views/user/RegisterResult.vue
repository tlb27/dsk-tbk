<template>
  <result
    :is-success="true"
    :content="false"
    :title="email"
    :description="description"
  >
    <template slot="action">
      <a-button size="large" type="primary">
        查看邮箱
      </a-button>
      <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">
        返回首页
      </a-button>
    </template>
  </result>
</template>

<script>
import Result from '@/views/result/Result'

export default {
  name: 'RegisterResult',
  components: {
    Result
  },
  data() {
    return {
      description: '创建成功，请联系管理员激活该账户(可忽略)',
      form: {}
    }
  },
  computed: {
    email() {
      const v = this.form && this.form.name || 'xxx'
      const title = `你的账户：${v} 注册成功`
      return title
    }
  },
  created() {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
