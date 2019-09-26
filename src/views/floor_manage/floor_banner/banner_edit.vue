<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="banner编辑页面" :bordered="false">
      <template slot="extra">
        <a-button type="primary" @click="$router.go(-1)">返回</a-button>
      </template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input
             placeholder="输入名称"
            v-decorator="[
          'name',
          {rules: [{ required: true, message: '给这个banner定义一个名称' }]}
        ]"
          />
        </a-form-item>
         <!-- <a-form-item label="公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
            <a-select
              mode="multiple"
              v-decorator="[
                  'uniac_list',
                  {rules: [{ required: true, message: '选择当前账号下的公众号' }]}
                ]"
              placeholder="请选择公众号"
              @change="handleChange"
              style="width: 100%"
            >
               <a-select-option v-for="(p,i) in user_uniacs_list" :key="i" :value="p.uniac_id">
                {{p.uniac_name}}
              </a-select-option>
            </a-select>
        </a-form-item> -->
        <a-form-item label="上传banner" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-upload
            name="qrcode"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :custom-request="customRequest"
            action="null"
          >
            <img v-if="imgUrl" :src="imgUrl" class="banner_img">
            <template v-else>
              <a-icon type="plus"/>
              <div class="ant-upload-text">点击上传格式为800*320同比例的图片作为主题图片</div>
            </template>
          </a-upload>
           <a-button type="primary" @click="deleteimg">删除</a-button>
        </a-form-item>
        <a-form-item label="主题链接" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input :disabled="able" @input="panduan1()"
             placeholder="若要设置主题banner,此输入框比填"
            v-decorator="[
          'redirect_url',
        ]"
          />
        </a-form-item>
          <a-form-item label="商品id" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input type="number"   @input="panduan2()" :disabled="able2"
             placeholder="若要设置单品banner,此输入框比填"
            v-decorator="[
          'goods_id',
        ]"
          />
        </a-form-item>
        <a-form-item label="权重排序"  :label-col="{ span: 3 }" :wrapper-col="{ span: 10}">
            <a-input  type="number"
            placeholder="权重越大，排序越靠前！"
              v-decorator="[
                'banner_seat',
                {rules: [{ required: true, message: '设置权重大小' }]}
              ]"
            />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
 
  </div>
</template>

<script>
import { getBase64 } from "@/utils";
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      imgUrl: null,
      dateString:[],
      able:false,
      able2:false
      //  name_list:[]
    };
  },
  created() {
    if(this.$route.query.banner_id){
        this.axios.get("/admin/banner?banner_id="+this.$route.query.banner_id).then(res=>{
        this.imgUrl=res.data.banner_img
        // var list=[]
        // for(var p of res.data.uniac_list.split(",")){
        //   list.push(Number(p))
        // }
        this.form.setFieldsValue({
          name:res.data.name,
          banner_seat:res.data.banner_seat,
          redirect_url:res.data.redirect_url,
          goods_id:res.data.goods_id
        })
      })
    }
  },
  computed: {
    ...mapGetters(['user_uniacs_list'])
  },
  methods: {
    panduan1(value){
        this.form.validateFields((err, values) => {
          if(values.redirect_url.length!=0){
            this.able2=true
          }else{
            this.able2=false
          }
        })
    },
    panduan2(value){
        this.form.validateFields((err, values) => {
          if(values.goods_id.length!=0){
            this.able=true
          }else{
            this.able=false
          }
        })
    },
    onChange(date, dateString) {
     this.dateString=dateString
    },
    deleteimg(){
      this.imgUrl=null
      if(this.banner_img){
        this.banner_img=null
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
         
          let data = new FormData();
          if(this.$route.query.banner_id){
            data.append("banner_id",this.$route.query.banner_id)
          }
           data.append("name",values.name)
          //  data.append("uniac_list",values.uniac_list)
          //  data.append("name_list",this.name_list)
           if(this.banner_img){
              values.banner_img=this.banner_img
              data.append("banner_img",this.banner_img)
           }else{
             data.append("banner_img", this.imgUrl)
           }
           if(this.$route.query.banner_id){
             data.append("edit",1)
           }
           if(values.goods_id){
            data.append("goods_id",values.goods_id)
           }
           if(values.redirect_url){
            data.append("redirect_url",values.redirect_url)
           }
           data.append("banner_seat",values.banner_seat)
         this.axios.post("/admin/banner",data).then(res=>{
           console.log(res)
           if(this.$route.query.banner_id){
             if(res.error==0){
               this.$notification.success({
                message: "success",
                description: `编辑成功`
              });
              setTimeout(()=>{ 
              this.$router.push({
                  name:"banner"
                }) 
              }, 1000);           
            
             }else{
              this.$notification["error"]({
                  message: "错误",
                  description: res.msg+"或存在重复",
                  duration: 4
              });
             }
           }else{
             if(res.error==0){
               this.$notification.success({
                message: "success",
                description: `新建成功`
              });
              setTimeout(()=>{ 
              this.$router.push({
                  name:"banner"
                }) 
              }, 1000);           
            
             }else{
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg+"或存在重复",
                  duration: 4
              });
             }
           }
         })
        }
      });
    },
    customRequest(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
          const isLt200k = file.file.size/1024 < 200;
            if (!isLt200k) {
            this.$message.error('上传图片大小不能超过 200kb!,长宽为建议大小！');
            }else{
              this.imgUrl = imageUrl;
              this.banner_img = file.file;
            }
         
        });
      }
    },
    handleChange(value) {
        var name_list=[]
      for(var p of value){
        for(var item of this.user_uniacs_list){
          if(p==item.uniac_id){
            name_list.push(item.uniac_name)
          }
        }
      }
      this.name_list=name_list.join(",")
    },

  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.banner_img {
  width: 400px;
  height: 160px;
}

</style>
