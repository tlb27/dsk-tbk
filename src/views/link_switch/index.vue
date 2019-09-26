<template>
  <div>
      <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="类型一" key="1">
        <a-card>
      <div slot="title">淘宝链接转短链</div>
      <a-row type="flex" justify="center">
        <a-col :span="18">
          <a-form>
            <a-form-item label="是否获取用户信息" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-switch v-model="getInfo" checkedChildren="是" unCheckedChildren="否"></a-switch>
              <div style="line-height: 1.5; font-size: 14px; color:#999">
                提示: （是：仅限在公众号内使用,已关注公众号的用户点击有效，未关注公众号的用户无法跳转到商品详情页）
                <br>（否：不需要绑定用户信息，使用公众号默认配置跳转到商品详情页)
              </div>
            </a-form-item>
            <a-form-item label="公众号选择" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="uniac_id" mode="multiple" style="width: 360px">
                <template v-for="uniac in user_uniacs_list">
                  <a-select-option :value="uniac.uniac_id">{{uniac.uniac_name}}</a-select-option>
                </template>
              </a-select>
              <div
                style="line-height: 1.5; font-size: 14px; color:#999"
              >提示: 用户下单后收益计算到公众号，订单需要用户手动绑定</div>
            </a-form-item>
            <a-form-item label="输入链接" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="url" style="width: 480px"></a-input>
              <a-button type="primary" style="margin-left: 15px;" @click="generateLink">生成链接</a-button>
            </a-form-item>
            <template v-for="result in resultList">
              <a-form-item
                :label="result.uniac_name"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input :value="result.url" :disabled="true" style="width: 480px"></a-input>
                <a-button
                  type="primary"
                  style="margin-left: 15px;"
                  v-clipboard:copy="result.url"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制链接</a-button>
              </a-form-item>
            </template>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    </a-tab-pane>
    <a-tab-pane tab="类型二" key="2" >
       <a-card v-if="admin" >
      <div slot="title">推广链接转短链</div>
      <a-row type="flex" justify="center">
        <a-col :span="18">
          <a-form>
            <a-form-item label="商品id" :label-col="labelCol" :wrapper-col="wrapperCol">
               <a-input v-model="goods_id"  style="width: 480px"></a-input>
            </a-form-item>
             <a-form-item label="平台" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="platform"  style="width: 360px">
                  <a-select-option value="0">淘宝</a-select-option>
                  <a-select-option value="1">拼多多</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="公众号选择" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="uniac_id1" mode="multiple" style="width: 360px">
                <template v-for="uniac in user_uniacs_list">
                  <a-select-option :value="uniac.uniac_id">{{uniac.uniac_name}}</a-select-option>
                </template>
              </a-select>
              <div
                style="line-height: 1.5; font-size: 14px; color:#999"
              >提示: 用户下单后收益计算到公众号，订单需要用户手动绑定</div>
            </a-form-item>
            <a-form-item label="输入链接" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button type="primary" style="margin-left: 15px;" @click="generateLink1">生成链接</a-button>
            </a-form-item>
            <template v-for="result in resultList1">
              <a-form-item
                :label="result.uniac_name"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input :value="result.url" :disabled="true" style="width: 480px"></a-input>
                <a-button
                  type="primary"
                  style="margin-left: 15px;"
                  v-clipboard:copy="result.url"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制链接</a-button>
              </a-form-item>
            </template>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    </a-tab-pane>
  </a-tabs>
  
   
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "index",
  data() {
    return {
      uniac_id: [],
      uniac_id1: [],
      type: "",
      getInfo: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      admin:true,
      goods_id:"",
      platform:"",
      url: "",
      url1: "",
      resultList: "",
      resultList1: ""
    };
  },
  created(){
    console.log(this.user_uniacs_list)
     if(this.userInfo.id!=1){
       this.admin=false
     }
  },
  computed: {
    ...mapGetters(["user_uniacs_list","userInfo"]) 
    },
  methods: {
    generateLink() {
      if (this.uniac_id && this.uniac_id.length > 0) {
        let params = `url=${this.url}&uniac_id=${this.uniac_id.join(",")}`;
        if (this.getInfo) {
          params = params + "&need_user_info = 1";
        }
        this.axios.get("/admin/short-url?" + params).then(res => {
          console.log(res);
          this.resultList = res.url_data.map(item => {
            for (let value of this.user_uniacs_list) {
              console.log(value, item);
              if (value.uniac_id == item.uniac_id) {
                item.uniac_name = value.uniac_name;
                return item;
              }
            }
          });
        });
      } else {
        this.$message.error("请选择公众号");
      }
    },
    generateLink1(){
      if (this.uniac_id1 && this.uniac_id1.length > 0) {
        let params = `goods_id=${this.goods_id}&platform=${this.platform}&uniac_id=${this.uniac_id1.join(",")}`;
        this.axios.get("/admin/share-url?" + params).then(res => {
          console.log(res);
          if(res.QR_url){
               this.resultList1 = res.QR_url.map(item => {
            for (let value of this.user_uniacs_list) {
              console.log(value, item);
              if (value.uniac_id == item.uniac_id) {
                item.uniac_name = value.uniac_name;
                return item;
              }
            }
          });
          }else{
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("请选择公众号");
      }
    },
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.success("复制失败, 请重试");
    }
  }
};
</script>

<style scoped>
</style>
