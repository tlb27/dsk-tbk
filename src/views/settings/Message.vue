<template>
  <div>
    <a-card class="card" title="返利相关" :bordered="false">
      <a-form ref="message" :form="form">
        <a-select default-value="全部" style="height:50px" @change="handleChange">
          <a-select-option value="0">
            全部
          </a-select-option>
          <a-select-option value="1">
            订单
          </a-select-option>
          <a-select-option value="2">
            提现,余额
          </a-select-option>
          <a-select-option value="3">
            查券
          </a-select-option>
          <a-select-option value="4">
            推广,海报
          </a-select-option>
          <a-select-option value="5">
            系统
          </a-select-option>
        </a-select>

        <a-form-item
          v-for="(p,key) in msglist"
          :label="p.describe"
        >
          <a-textarea
            :ref="`msg`"
            :value="p.text"
            :disabled="dis"
            :name="p.name"
            rows="5"
          />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button
        type="primary"
        style="margin-right:10px;"
        @click="handlegroup"
      >
        提交
      </a-button>
      <a-button
        v-if="dis"
        style="margin-right:10px;"
        type="primary"
        @click="handleedit"
      >
        编辑
      </a-button>
      <a-button
        v-if="!dis"
        style="margin-right:10px;"
        type="primary"
        @click="handleedit"
      >
        取消
      </a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'MessageForm',
  components: {
    FooterToolBar
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      msglist: [],
      dis: true,
      loading: false,
      // table
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.axios.get('/admin/wechat-auto-msg?access-token=123').then(res => {
      this.msglist = res
      console.log(this.msglist)
    })
  },
  methods: {
    handlegroup() {
      console.log(this.$refs)
      var msg = this.$refs.msg
      var data = []
      for (var i = 0; i < msg.length; i++) {
        var name = msg[i].name
        var value = msg[i].value
        data.push({ name: msg[i].name, value: msg[i].value })
      }
      console.log(data)
      this.axios.post('/admin/wechat-auto-msg', data).then(res => {
        console.log(res)
      })
    },
    handleedit() {
      this.dis = !this.dis
    },
    handleChange(value) {
      this.axios.get('/admin/wechat-auto-msg?access-token=123&group=' + value).then(res => {
        this.msglist = res
        console.log(this.msglist)
      })
    }
    // 最终全页面提交
    // validate () {
    //   this.$refs.message.form.validateFields((err, values) => {
    //     if (!err) {
    //       this.$notification['error']({
    //         message: 'Received values of form:',
    //         description: values
    //       })
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 24px;
    }
</style>
