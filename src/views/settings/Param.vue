<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item

        label="淘宝返利比例"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input-number
          v-decorator="[
            'tb_reward_rate',
            {initialValue: set_list.tb_reward_rate ,rules: [{ required: true, message: '请输入淘宝返利比例' }]}
          ]"
          :disabled="dis"
          name="tb_reward_rate"
          :min="0"
          :max="100"
        />
        <span> %</span>
      </a-form-item>
      <a-form-item
        label="拼多多返利比例"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input-number
          v-decorator="[
            'ddk_reward_rate',
            {initialValue: set_list.ddk_reward_rate ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="ddk_reward_rate"
          :min="0"
          :max="100"
        />
        <span> %</span>
      </a-form-item>
      <a-form-item
        label="每日提现次数限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number
          v-decorator="[
            'day_exchange_limit',
            {initialValue: set_list.day_exchange_limit ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="day_exchange_limit"
          :min="0"
          :max="100"
        />
        <span> 次</span>
      </a-form-item>
      <a-form-item
        label="提现时间频率限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number
          v-decorator="[
            'exchange_time_interval',
            {initialValue: set_list.exchange_time_interval ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="exchange_time_interval"
          :min="0"
          :max="100"
        />
        <span> 秒</span>
      </a-form-item>
      <a-form-item
        label="单次提现最大金额"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number
          v-decorator="[
            'exchange_max_fee',
            {initialValue: set_list.exchange_max_fee ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="exchange_max_fee"
          :min="0"
          :max="100"
        />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="每日提现总额限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number
          v-decorator="[
            'day_total_exchange_limit',
            {initialValue: set_list.day_total_exchange_limit ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="day_total_exchange_limit"
          :min="0"
          :max="100"
        />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="近期提现限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <span>每 </span>
        <a-input-number
          v-decorator="[
            'lock_exchange_hours',
            {initialValue: set_list.lock_exchange_hours ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="lock_exchange_hours"
        />
        <span> 小时，最多提现</span>
        <a-input-number
          v-decorator="[
            'lock_exchange_reward',
            {initialValue: set_list.lock_exchange_reward ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="lock_exchange_reward"
        />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="第三方阿里妈妈账号设置"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <span>key：</span>
        <a-input
          v-decorator="[
            'isv_mama_key',
            {initialValue: set_list.isv_mama_key ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="isv_mama_key"
        />
        <span>secret：</span>
        <a-input
          v-decorator="[
            'isv_mama_secret',
            {initialValue: set_list.isv_mama_secret ,rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :disabled="dis"
          name="isv_mama_secret"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 24 }"
        style="text-align: center"
      >
        <a-button html-type="submit" type="primary">
          提交
        </a-button>
        <a-button v-if="dis" style="margin-left: 8px" @click="handleeidt">
          编辑
        </a-button>
        <a-button v-if="!dis" style="margin-left: 8px" @click="handleeidt">
          取消
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'ParamForm',
  data() {
    return {
      value: 1,
      dis: true,
      // form
      form: this.$form.createForm(this),
      set_list: {}
    }
  },
  created() {
    this.axios.get('admin/settings?access-token=12345&uniac_id=1').then(res => {
      this.set_list = res.data
      // console.log(this.set_list)
    })
  },
  methods: {

    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          var list = []
          for (var p in values) {
            var name = p
            var value = values[p]
            list.push({ name: name, value: value })
          }
          var data = { uniac_id: 0, data: list }
          this.axios.post('admin/settings', data).then(res => {
            alert(res.msg)
          })
        }
      })
    },
    handleeidt() {
      this.dis = !this.dis
    }
  }
}
</script>
