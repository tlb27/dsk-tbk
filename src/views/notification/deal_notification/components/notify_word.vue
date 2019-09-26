<template>
  <div>
    <a-input type="textarea" @input="onInput" v-model="text" placeholder="请输入要推送的消息" :rows="6">

    </a-input>
  </div>
</template>

<script>
  export default {
    name: "vText",
    props:{
      textData:String,
      default:''
    },
    data() {
      return {
        text: ''
      }
    },
    methods:{
      onInput(e){
        this.$emit('update:textData',this.text)
      }
    }
  }
</script>

<style scoped>

</style>
