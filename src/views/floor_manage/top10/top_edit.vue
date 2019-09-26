<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="top10编辑页面" :bordered="false">
      <template slot="extra">
        <a-button type="primary" @click="$router.go(-1)">返回</a-button>
      </template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="商品id" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input
            type="number"
            placeholder="请输入商品id"
            v-decorator="[
          'goods_id',
          {rules: [{ required: true, message: 'goods_id不能为空' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="平台" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-select
            v-decorator="[
          'platform',
          {rules: [{ required: true, message: 'platform不能为空' }]}
        ]"
            @change="handleChange"
          >
            <a-select-option value="1">拼多多</a-select-option>
            <a-select-option value="0">淘宝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
          <a-button type="primary" @click="grow">查看</a-button>
        </a-form-item>
        <!-- <a-form-item label="公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-select
            mode="multiple"
            v-decorator="[
                  'uniac_id',
                  {rules: [{ required: false, message: '选择当前账号下的公众号' }]}
                ]"
            placeholder="不选默认未全部"
            @change="handleChange"
            style="width: 100%"
          >
            <a-select-option
              v-for="(p,i) in user_uniacs_list"
              :key="i"
              :value="p.uniac_id"
            >{{p.uniac_name}}</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item label="设置主图" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-upload
            name="qrcode"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :custom-request="customRequest"
            action="null"
          >
            <a-avatar :size="200" shape="square" v-if="imgUrl" :src="imgUrl"/>
            <template v-else>
              <a-icon type="plus"/>
              <div class="ant-upload-text">上传自定义商品主图(800*800)</div>
            </template>
          </a-upload>
          <a-button type="primary" @click="deleteimg">删除</a-button>
          <span style="color:brown;margin-left:10px;">*若不设置主图默认获取原图*</span>
        </a-form-item>
        <a-form-item label="销量" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
          <a-input
            type="number"
            placeholder="有必要可以设置销量"
            v-decorator="[
          'volume',
          {rules: [{ required: false, message: 'goods_id不能为空' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="位置排序" :label-col="{ span: 3 }" :wrapper-col="{ span: 10}">
          <a-input
            type="number"
            :min="1" :max="10"
            placeholder="设置top10中的商品位置！"
            v-decorator="[
                'top_seat',
                {rules: [{ required: true, message: '设置位置' }]}
              ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
      <a-modal :width="260" :visible="goodsshow" title="商品预览" :footer="null" @cancel="handleCancel">
        <div style="width:210px">
          <div class="neibian">
            <div class="avatar">
              <img :src="goods_data.goods_img_url">
            </div>
            <div class="title">
              <span v-if="goods_data.platform==1">
                <img
                  style="width:14px;height:14px;vertical-align: text-bottom;"
                  src="@assets/images/pingduoduo.svg"
                >
              </span>
              <span v-if="goods_data.platform==0">
                <img
                  style="width:14px;height:14px;vertical-align: text-bottom;"
                  src="@assets/images/taobao.svg"
                >
              </span>
              {{goods_data.title}}
            </div>
            <div style="display:flex;justify-content: space-between">
              <span
                style="background: rgba(224,46,36,.08);color: #e02e24;border-radius: 2px;padding: 1px 2px;font-size:12px;"
              >券{{goods_data.coupon_amount|price}}元</span>
              <span
                style="margin-left:30px;color: #e02e24;background: rgba(224,46,36,.08);border-radius: 2px;padding: 1px 2px;font-size:12px"
              >返{{goods_data.promotion_amount|price}}元</span>
            </div>
            <div class="botm">
              <div class="binpai">
                <span
                  style="color:#e02e24;font-weight:blod;font-size:12px"
                >￥{{goods_data.zk_price|price}}</span>
                <del style="color: #9c9c9c;font-size:12px">￥{{goods_data.price|price}}</del>
              </div>
              <span style="font-size:12px;color: #9c9c9c;">已售{{goods_data.volume|quantity}}件</span>
            </div>
          </div>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { getBase64 } from "@/utils";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      imgUrl: null,
      goodsshow: false,
      name_list: [],
      goods_data: {},
      top_img: null
    };
  },
  created() {
    console.log(this.user_uniacs_list);
    if (this.$route.query.top_id) {
      this.axios
        .get("/admin/top-modification?top_id=" + this.$route.query.top_id)
        .then(res => {
          console.log(res)
          this.imgUrl = res.data.goods_img;
          this.form.setFieldsValue({
            top_seat: res.data.top_seat,
            volume: res.data.volume,
            goods_id: res.data.goods_id,
            platform:[res.data.platform==1?"拼多多":"淘宝"]
          });
        });
    }
  },
  filters: {
    price: function(value) {
      var val = Number(value / 1000).toFixed(2);

      return val;
    },
    quantity: function(value) {
      if (value >= 10000) {
        value = Number(value / 10000).toFixed(1) + "万";
      }
      return value;
    }
  },
  computed: {
    ...mapGetters(["user_uniacs_list"])
  },
  methods: {
    deleteimg() {
      this.imgUrl = null;
      if (this.top_img) {
        this.top_img = null;
      }
    },
    grow() {
      this.form.validateFields(["goods_id", "platform"], (errors, values) => {
        if (!errors) {
          if(values.platform=="淘宝"){
            values.platform = 0
          }else if(values.platform=="拼多多"){
            values.platform = 1
          }else{
            values.platform = Number(values.platform);
          }
          var data=new FormData()
          data.append("goods_id",values.goods_id)
          data.append("platform",values.platform)
          this.axios.post("/admin/itemdetail", data).then(res => {
            if (!res.error) {
              this.goodsshow = true;
              this.goods_data = res;
            }else{
              this.$notification["error"]({
                message: "错误",
                description: res.msg ,
                duration: 4
              });
            }
          });
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields(["goods_id", "platform"], (errors, values) => {
        if (!errors) {
          if(values.platform=="淘宝"){
            values.platform = 0
          }else if(values.platform=="拼多多"){
            values.platform = 1
          }else{
            values.platform = Number(values.platform);
          }
           var data=new FormData()
          data.append("goods_id",values.goods_id)
          data.append("platform",values.platform)
          this.axios.post("/admin/itemdetail", data).then(res => {
            if (!res.error) {
              this.form.validateFields((err, values) => {
                if (!err) {
                  if (this.top_img) {
                    console.log(this.top_img)
                    values.top_img = this.top_img;
                  }
                  let data = new FormData();
                  if (this.$route.query.top_id) {
                    data.append("top_id", this.$route.query.top_id);
                  }
                  data.append("goods_id", values.goods_id);
                  if(values.platform=="淘宝"){
                     data.append("platform", 0);
                    values.platform = 0
                  }else if(values.platform=="拼多多"){
                   data.append("platform", 1);
                  }else{
                    data.append("platform", Number(values.platform));
                  }
                  if (values.uniac_id) {
                    data.append("uniac_id", values.uniac_id);
                    data.append("name_list", this.name_list);
                  }
                  if (this.top_img) {
                    data.append("goods_img", this.top_img);
                    console.log(this.top_img)
                  }else{
                    if(this.imgUrl){
                      data.append("goods_img",this.imgUrl);
                    }else{
                      data.append("goods_img",res.goods_img_url);
                    }
                  }
                  if (values.volume) {
                    data.append("volume", values.volume);
                  }else{
                    data.append("volume", res.volume);
                  }
                  data.append("top_seat", values.top_seat);
                  if(this.$route.query.top_id){
                     this.axios.post("/admin/top-modification", data).then(res => {
                      if (res.error == 0) {
                        this.$notification.success({
                          message: "success",
                          description: res.msg
                        });
                        setTimeout(() => {
                          this.$router.push({
                            name: "top"
                          });
                        }, 1000);
                      } else {
                        this.$notification["error"]({
                          message: "错误",
                          description: res.msg ,
                          duration: 4
                        });
                      }
                  })
                  }else{
                     this.axios.post("/admin/top-save", data).then(res => {
                      if (res.error == 0) {
                        this.$notification.success({
                          message: "success",
                          description:  res.msg
                        });
                        setTimeout(() => {
                          this.$router.push({
                            name: "top"
                          });
                        }, 1000);
                      } else {
                        this.$notification["error"]({
                          message: "错误",
                          description: res.msg ,
                          duration: 4
                        });
                      }
                  })
                  }
                 
                }
              });
            } else {
              this.$notification["error"]({
                message: "错误",
                description: res.msg,
                duration: 4
              });
            }
          });
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
              this.top_img = file.file;
            }
          
        });
      }
    },
    handleCancel(e) {
      this.goodsshow = false;
    },
    handleChange(value) {
      var name_list = [];
      for (var p of value) {
        for (var item of this.user_uniacs_list) {
          if (p == item.uniac_id) {
            name_list.push(item.uniac_name);
          }
        }
      }
      this.name_list = name_list.join(",");
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.top_img {
  width: 400px;
  height: 160px;
}
.avatar {
  width: 200px;
  height: 200px;
}
.avatar img {
  width: 100%;
  height: 100%;
}

.neibian {
  padding: 5px;
  padding-bottom: 10px;
}
.binpai {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.botm {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
