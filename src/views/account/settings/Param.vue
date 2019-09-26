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
            {rules: [{ required: true, message: '请输入淘宝返利比例' }]}
          ]"
          :default-value="40"
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
            {rules: [{ required: true, message: '请输入拼多多返利比例' }]}
          ]"
          :default-value="40"
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
        <a-input-number name="day_exchange_limit" :default-value="20" :min="0" :max="100" />
        <span> 次</span>
      </a-form-item>
      <a-form-item
        label="提现时间频率限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number name="exchange_time_interval" :default-value="60" :min="0" :max="100" />
        <span> 秒</span>
      </a-form-item>
      <a-form-item
        label="单次提现最大金额"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number name="exchange_max_fee" :default-value="100" :min="0" :max="100" />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="每日提现总额限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number name="day_total_exchange_limit" :default-value="100" :min="0" :max="100" />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="近期提现限制"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <span>每 </span>
        <a-input-number name="lock_exchange_hours" />
        <span> 小时，最多提现</span>
        <a-input-number name="lock_exchange_reward" />
        <span> 元</span>
      </a-form-item>
      <a-form-item
        label="第三方阿里妈妈账号设置"
        :label-col="{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <span>key：</span>
        <a-input name="lock_exchange_hours" />
        <span>secret：</span>
        <a-input name="lock_exchange_reward" />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 24 }"
        style="text-align: center"
      >
        <a-button html-type="submit" type="primary">
          提交
        </a-button>
        <a-button style="margin-left: 8px">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'BaseForm',
  data() {
    return {
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      value: 1,

      // form
      form: this.$form.createForm(this)

    }
  },
  methods: {

    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
