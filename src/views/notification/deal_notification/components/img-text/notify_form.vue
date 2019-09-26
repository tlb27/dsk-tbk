<template>
  <div class="notify-form-wrap">
    <a-form class="ant-form-item">
      <a-form-item label="标题" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-input v-model="datas.title" placeholder="请输入标题"/>
      </a-form-item>
      <a-form-item label="链接" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-input v-model="datas.url" placeholder="请输入链接"/>
      </a-form-item>
      <a-form-item label="描述" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-input v-model="datas.descp" placeholder="请输入描述" type="textarea" :rows="3"/>
      </a-form-item>
      <a-form-item label="icon" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-upload
          v-model="datas.photo"
          name="qrcode"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :custom-request="customRequest"
          action="null"
          @change="handleChange"
        >
          <a-avatar v-if="datas.iconUrl" :size="96" style="border-radius:0;" shape="square" :src="datas.iconUrl"/>
          <template v-else>
            <a-avatar v-if="datas.img" :size="96" style="border-radius:0;" shape="square" :src="datas.img"/>
            <template v-else>
            <a-icon type="plus"/>
            <div class="ant-upload-text">
              上传icon
            </div>
            </template>
          </template>
        </a-upload>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {getBase64} from '@/utils'

  export default {
    name: "notify_form",
    props: {
      datas: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        icon: '',
      }
    },
    methods: {
      customRequest(file, b, c) {
        if (file.file) {
          this.datas.photo = file.file
          this.datas.img = null
          getBase64(file.file, (imageUrl) => {
            this.$set(this.datas, 'iconUrl', imageUrl)
          })
        }
      },
      handleChange(info) {

      }
    }
  }
</script>

<style scoped>
  .notify-form-wrap {
    width: 400px;
  }

  .ant-form-item .ant-form-item {
    margin-bottom: 12px;
  }
</style>
