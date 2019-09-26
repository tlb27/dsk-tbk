<template>
  <div>
    <div class="preview-wrap">
      <a class="border" @click="onclick">
        <div  class="title">{{datas.title||'这里是标题'}}</div>
        <div class="bottom">
          <div style="width:155px;color:#aaa; word-break: break-all" v-html="datas.descp&&datas.descp.replace('\n','<br/>')||'这里是内容'"></div>
          <a-avatar style="flex-shrink: 0;border-radius:0;" v-if="datas.iconUrl" :size="54" shape="square" :src="datas.iconUrl"/>
          <a-avatar v-if="datas.img" style="flex-shrink: 0;border-radius:0;"  :size="54" shape="square" :src="datas.img">icon</a-avatar>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notify_preview",
    props: {
      datas: {
        type: Object,
        default: () => ({})
      }
    },
    methods:{
      onclick(){
        if (this.datas.url) {
          const url = /^(http|https)/.test(this.datas.url)?this.datas.url :'//'+this.datas.url
          window.open(url)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .preview-wrap {
    width: 264px;
    padding: 5px 12px;
    border: 1px solid #999;

    .border {
      display: block;
      padding: 6px 10px;
      border: 2px solid #2AC845;
    }

    .title {
      margin-bottom: 12px;
      font-size: 16px;
      color: #333;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
    }
  }

</style>
