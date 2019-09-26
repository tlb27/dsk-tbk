<template>
  <a-form
    v-bind="$attrs"
    size="mini"
    class="text-align-left"
    :form="form"
    @submit="handleSubmit"
  >
    <template v-for="item in this.formTitle">
      <!--点击编辑的输入框-->
      <a-form-item
        v-if="item.type==='switch'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
        :required="item.required||false"
      >
        <span v-if="item.pre">
          {{ item.pre }}
        </span>
        <a-tag @click="showModal(item)">
          {{ formData[item.en]?'是':'否' }}
        </a-tag>

        <span v-if="item.behind">
          {{ item.behind }}
        </span>
      </a-form-item>

      <!--通用-->
      <a-form-item
        v-else
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
        :required="item.required||false"
      >
        <span v-if="item.pre">
          {{ item.pre }}
        </span>
        <a-tag @click="showModal(item)">
          {{ formData[item.en]||'-' }}
        </a-tag>

        <span v-if="item.behind">
          {{ item.behind }}
        </span>
      </a-form-item>
    </template>
  </a-form>
</template>

<script>

export default {
  name: 'WechatForm',
  props: {
    formTitle: {
      type: Array,
      default: () => ([])
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    showSubmit: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: 1,
      id: 0,
      dis: true,
      // form
      form: this.$form.createForm(this, { onFieldsChange: this.onFieldsChange })
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('handleSubmit', values)
        }
      })
    },
    handleEidt() {
      this.$emit('handleEidt', this.form)
    },
    handleCancel() {
      this.$emit('handleCancel', this.form)
    },
    editInput(item) {
      item.editable = !item.editable
      if (!item.editable) {
        console.log(this.formData[item.en])
      }
    },
    onFieldsChange(props, fields) {
      console.log(props, fields)
    },
    repeal(item) {
      item.editable = !item.editable
    },
    showModal(item) {
      this.$emit('showModel', item)
    }
  }
}
</script>

<style scoped>
  .text-align-left .ant-form-item-label{
    text-align: left;
  }
  .ant-form-item{
    margin-bottom:0px;
  }
</style>
