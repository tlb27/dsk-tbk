<template>
  <div>
    <a-upload
      name="qrcode"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :custom-request="customRequest"
      action="null"
    >
      <a-avatar v-if="imgUrl" :size="256" shape="square" :src="imgUrl" />
      <template v-else>
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传图片
        </div>
      </template>
    </a-upload>
  </div>
</template>

<script>
  import {getBase64} from '@/utils'
  export default {
    name: "vImage",
    props:{
      imgData:{
        default:()=>({})
      }
    },
    data() {
      return {
        imgUrl: '',
      }
    },
    methods:{
      customRequest(file,b,c){
        console.log(file);
        if (file.file) {

          getBase64(file.file, (imageUrl) => {
            this.$emit('update:imgData',file.file)
           this.imgUrl = imageUrl
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
