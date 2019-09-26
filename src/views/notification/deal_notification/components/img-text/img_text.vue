<template>
  <a-row type="flex" justify="start">
    <a-col :xl="8" :lg="10" :md="10" :sm="24" :xs="24" style="display: flex; height:auto;">
      <span>预览：</span>
      <notify-preview :datas="datas">

      </notify-preview>
    </a-col>
    <a-col :xl="10" :lg="12" :md="12" :sm="24" :xs="24">
      <notify-form :datas="datas">

      </notify-form>
    </a-col>
  </a-row>
</template>

<script>
  import notifyPreview from './notify_preview'
  import notifyForm from './notify_form'

  export default {
    name: "img_text",
    components: {
      notifyPreview,
      notifyForm,
    },
    props:{
      datas:{
        type:Object,
        default:()=>({})
      }
    },
  }
</script>

<style scoped>

</style>
