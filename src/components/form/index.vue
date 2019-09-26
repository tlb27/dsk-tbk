<template>
  <a-form
    v-bind="$attrs"
    class="text-align-left"
    :form="form"
    @submit="handleSubmit"
  >
    <template v-for="item in this.formTitle">
      <!--点击编辑的输入框-->
      <a-form-item
        v-if="item.type==='editableTag'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
        :required="item.required||false"
      >
        <a-tag @click="showModal(item.en,item.cn)">
          {{ formData[item.en]||'-' }}
        </a-tag>

        <span v-if="item.behind">
          {{ item.behind }}
        </span>
      </a-form-item>

      <!--头像-->
      <a-form-item
        v-else-if="item.type==='avatar'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 6}, sm: {span: 6}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
        :required="item.required||false"
      >
        <a-upload
          v-decorator="[item.en, {
            valuePropName: item.en,
            getValueFromEvent: normFile,
          }]"
          :name="item.en"
          :list-type="item.listType||'picture-card'"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="item.action||'//jsonplaceholder.typicode.com/posts/'"
          @change="handleChange"
        >
          <div v-if="fileList.length < 2">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-item>
      <!--输带单位的数字-->
      <a-form-item
        v-else-if="item.type==='number'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
        :required="item.required||false"
      >
        <a-input-number
          v-decorator="[
            item.en,
            {initialValue: formData[item.en] ,rules: item.rules||[]}
          ]"
          :disabled="item.disabled"
          :name="item.en"
          :min="item.rate&&item.rate.min||0"
          :max="item.rate&&item.rate.max||100"
        />
        <span v-if="item.behind">
          {{ item.behind }}
        </span>
      </a-form-item>

      <!--提现限制-->
      <a-form-item
        v-else-if="item.type==='limit'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17} }"
        :required="item.required||false"
      />

      <!--账号设置-->
      <a-form-item
        v-else-if="item.type==='upload'"
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17} }"
        :required="item.required||false"
      >
        <a-upload
          v-decorator="[item.en, {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          }]"
          :name="item.cn"
          :action="item.action"
          :list-type="item.listType||'picture'"
        >
          <slot />
        </a-upload>
      </a-form-item>

      <!--通用-->
      <a-form-item
        v-else
        :label="item.cn"
        :label-col="item.labelCol||{lg: {span: 7}, sm: {span: 7}}"
        :wrapper-col="item.wrapperCol||{lg: {span: 17}, sm: {span: 17} }"
        :required="item.required||false"
      >
        <a-input
          v-decorator="[
            item.en,
            {initialValue: formData[item.en] ,rules: item.rules}
          ]"
          :disabled="item.disabled"
          :name="item.en"
        />
        <span v-if="item.behind">
          {{ item.behind }}
        </span>
      </a-form-item>
    </template>

    <a-form-item
      v-if="showSubmit"
      :wrapper-col="{ span: 24 }"
      style="text-align: center"
    >
      <a-button html-type="submit" type="primary">
        提交
      </a-button>
      <a-button v-if="showEdit" style="margin-left: 8px" @click="handleEidt">
        编辑
      </a-button>
      <a-button v-if="showCancel" style="margin-left: 8px" @click="handleCancel">
        取消
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'GeneralForm',
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
      default: false
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
      form: this.$form.createForm(this),
      loading: '',
      imageUrl: '',
      fileList: []
    }
  },
  methods: {
    handleSubmit(e) {
      e && e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('handleSubmit', values)
        }
      })
    },

    handleChange(a, b, c, d) {
      console.log(a, b, c, d)
      // this.fileList = fileList
    },
    beforeUpload(a, b) {
      console.log(a, b)
      return false
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
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
    showModal(key, label) {
      this.$emit('showModel', key, label)
    }
  }
}
</script>

<style scoped>
  .text-align-left .ant-form-item-label {
    text-align: left;
  }
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
