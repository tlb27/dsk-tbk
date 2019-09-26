<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="icon编辑页面" :bordered="false">
      <template slot="extra">
        <a-button type="primary" @click="$router.go(-1)">返回</a-button>
      </template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="标题" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input
            placeholder="输入标题"
            v-decorator="[
          'title',
          {rules: [{ required: true, message: '给这个icon 定义一个名称' }]}
        ]"
          />
        </a-form-item>
         <a-form-item label="账户" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
              <a-select
            v-decorator="[
                  'admin',
                  {rules: [{ required: false, message: '请选择账号' }]}
                ]"
            placeholder="可以不选中此项,下方选择框默认为所有公众号"
            @change="handleChange1"
            style="width: 100%"
          >
            <a-select-option
              v-for="(p,i) in all_uniac_lis"
              :key="i"
              :value="p.admin_id"
            >{{p.admin_name}}</a-select-option>
          </a-select>
         </a-form-item>
        <a-form-item label="公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
       
          <a-select
            mode="multiple"
            v-decorator="[
                  'uniac_id',
                  {rules: [{ required: false, message: '选择当前账号下的公众号' }]}
                ]"
            placeholder="公众号"
            @change="handleChange"
            style="width: 100%"
          >
            <a-select-option
              v-for="(p,i) in for_uniac_list"
              :key="i"
              :value="p.uniac_id"
            >{{p.uniac_name}}</a-select-option>
          </a-select>
          
        </a-form-item>
        <a-form-item label="上传icon" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
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
              <div class="ant-upload-text">上传自定义格式为100*100图片</div>
            </template>
          </a-upload>
          <a-button type="primary" @click="deleteimg">删除</a-button>
        </a-form-item>
   
        <a-form-item label="主题链接" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input
            placeholder="设置icon链接"
            v-decorator="[
          'url',{rules: [{ required: true, message: '设置icon链接' }]}
        ]"
          />
        </a-form-item>

        <a-form-item label="位置排序" :label-col="{ span: 3 }" :wrapper-col="{ span: 10}">
          <a-input
            type="number"
             min="1" max="4"
            placeholder="位置越大，排序越靠前！"
            v-decorator="[
                'seat',
                {rules: [{ required: true, message: '设置位置大小' }]}
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
import { mapActions, mapGetters } from "vuex";
import { itemProps } from 'ant-design-vue/es/vc-menu';
import { constants } from 'crypto';
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      imgUrl: null,
      dateString: [],
      uniac_list: {},
      for_uniac_list:[],
      uniac_data:[],
      all_uniac_lis:[]
    };
  },
  created() {
    this.axios.get("/admin/get-all-uniac").then(res=>{
      var list=[]
      var list2=[]
      for(var item of res.admin_info_list){
        if(item.data.uniac_id){
          list2.push(item)
         for(var i=0;i<item.data.uniac_id.split(",").length;i++){
            list.push({uniac_id:Number(item.data.uniac_id.split(",")[i]),uniac_name:item.data.uniac_name.split(",")[i]})
          }
        }
      }
      this.uniac_data=list
      this.all_uniac_lis=list2
      this.for_uniac_list=list
    })
    if(this.$route.query.uniac_id){
      this.uniac_list={uniac_id:this.$route.query.uniac_id,uniac_name:this.$route.query.uniac_name}
      this.old_uniac_list={uniac_id:this.$route.query.uniac_id,uniac_name:this.$route.query.uniac_name}
    }
    if (this.$route.query.icon_id) {
      this.axios
        .get(
          "/admin/icon-modification?icon_id=" +
            this.$route.query.icon_id +
            "&uniac_list=" +
            this.$route.query.uniac_id
        )
        .then(res => {
          console.log(res)
          this.imgUrl = res.data.img;
          this.old_seat=res.data.seat
          var list = [];
          // for (var p of JSON.parse(res.data.uniac_list).uniac_id.split(",")) {
          //   list.push(Number(p));
          // }
          this.form.setFieldsValue({
            title: res.data.title,
            seat: res.data.seat,
            url: res.data.url,
            uniac_id: Number(res.data.uniac_id)
          });
        });
    }
  },
  computed: {
    ...mapGetters(["user_uniacs_list"])
  },
  methods: {
    onChange(date, dateString) {
      this.dateString = dateString;
    },
    deleteimg() {
      this.imgUrl = null;
      if (this.banner_img) {
        this.banner_img = null;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = new FormData();
          if (this.$route.query.icon_id) {
            data.append("icon_id", this.$route.query.icon_id);
            data.append("old_seat",this.old_seat)
          data.append("old_uniac", JSON.stringify(this.old_uniac_list));
          }
          data.append("title", values.title);
        
          data.append("uniac_list", JSON.stringify(this.uniac_list));
          //  data.append("name_list",this.name_list)

          if (this.banner_img) {
            data.append("img", this.banner_img);
          } else {
            data.append("img", this.imgUrl);
          }
          if (values.url) {
            data.append("url", values.url);
          }
          data.append("seat", values.seat);
          if (this.$route.query.icon_id) {
            this.axios.post("/admin/icon-modification", data).then(res => {//修改
                if (res.error == 0) {
                  this.$notification.success({
                    message: "success",
                    description: `编辑成功`
                  });
                  setTimeout(()=>{
                  this.$router.push({
                      name:"icon"
                    })
                  }, 1000);
                } else {
                  this.$notification["error"]({
                    message: "错误",
                    description: res.msg ,
                    duration: 4
                  });
                }
            });
          } else {
            this.axios.post("/admin/icon-save", data).then(res => {//新建
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `新建成功`
                });
                setTimeout(()=>{
                this.$router.push({
                    name:"icon"
                  })
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg ,
                  duration: 4
                });
              }
            });
          }
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
      console.log(value)
      var name_list = [];
      for (var p of value) {
        for (var item of this.uniac_data) {
          if (p == item.uniac_id) {
            name_list.push(item.uniac_name);
          }
        }
      }
      this.uniac_list = {
        uniac_id: value.join(","),
        uniac_name: name_list.join(",")
      };
    },
    handleChange1(value){
      var list=[]
      for(var p of this.all_uniac_lis){
        if(value==p.admin_id){
            for(var i=0;i<p.data.uniac_id.split(",").length;i++){
              list.push({uniac_id:Number(p.data.uniac_id.split(",")[i]),uniac_name:p.data.uniac_name.split(",")[i]})
            }
        }
      }
      this.for_uniac_list=list
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.banner_img {
  width: 100px;
  height: 100px;
  overflow: hidden;
}
</style>
