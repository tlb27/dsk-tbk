<template>
  <div>
    <a-row type="flex" style="margin-bottom:50px;" justify="center">
      <div class="phone" v-cloak style=" border: 1px solid #eee;">
        <div class="phone_card">
          <div style="position:relative">
            <h2 class="title" v-html="title"></h2>
            <div class="rightmodel">
              <a-form>
                <a-form-item
                  label="标题"
                  style="margin-bottom:0"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <a-textarea
                    v-model="title"
                    @input="huanhang"
                    placeholder="请输入自定义此次主题的title"
                    :rows="2"
                  />
                </a-form-item>
              </a-form>
            </div>
          </div>
          <div class="grid" v-for="(p,index) of card_data" :key="index"  v-dragging="{ item: p, list: card_data, group: 'p',otherData:card_list}">
            <div class="card">
              <div class="avatar">
                <img v-if="p.goods_img_url" :src="p.goods_img_url">
                <img v-else src="@/assets/MRXJ2.jpg">
              </div>
             <div class="myfont pailie" >
              <span v-if="p.coupon_amount!=0" style="margin-right:10px">优惠券￥{{p.coupon_amount|price}}</span>
              <span style="margin-right:10px">返现￥{{p.promotion_amount|price2}}</span>
              <span>券后价￥{{p.zk_price|price}}</span>
            </div>
            <div class="myfont mywidth">{{p.title}}</div>
            </div>
            <div class="rightmodel" style="top:5%">
              <a-form>
                <a-form-item
                  style="margin-bottom:10px"
                  label="商品名"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <!--   -->
                  <a-input
                    type="text"
                    v-model="card_list[index].selection_title"
                    placeholder="请简化商品名(必填)，不要超过12个字"
                  />
                </a-form-item>
                <a-form-item
                  style="margin-bottom:10px"
                  label="商品ID"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <!--    -->
                  <a-input
                    type="number"
                    v-model="card_list[index].goods_id"
                    placeholder="请输入商品ID,替换ID即替换商品"
                  />
                </a-form-item>
                <a-form-item
                  style="margin-bottom:10px"
                  label="商品平台"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <!-- -->
                  <a-select v-model="card_list[index].platform">
                    <a-select-option value="0">淘宝</a-select-option>
                    <a-select-option value="1">拼多多</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="更改图片"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <div>
                    <a-upload
                      name="qrcode"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      :custom-request="customRequest2"
                      action="null"
                    >
                     <a-avatar
                        v-if="card_data[index].goods_img_url"
                        style="width:100%;height:80px;"
                        shape="square"
                        :src="card_data[index].goods_img_url"
                      />
                      <a-avatar
                        v-else-if="tab3_imgUrl"
                        style="width:100%;height:80px;"
                        shape="square"
                        :src="tab3_imgUrl"
                      />
                      <template v-else>
                        <a-icon type="plus"/>
                        <div class="ant-upload-text">更改商品图片规格(800*800)</div>
                      </template>
                    </a-upload>
                  </div>
                </a-form-item>
                <a-form-item style="margin:0">
                  <div class="pro_btn">
                    <a-button @click="grow(index)" :disabled="clickable" type="primary">生成</a-button>
                    <a-button @click="close($event,index)" type="primary">删除</a-button>
                  </div>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </div>
      <div class="phone disable" v-if="able"></div>
    </a-row>
    <a-row type="flex" justify="center"  v-if="able">
      <div class="add_btn" id="add_btn">
        <a-button @click="add" type="primary">
          新增一个商品
          <a-icon type="plus"/>
        </a-button>
      </div>
    </a-row>
  </div>
</template>

<script>
import { getBase64 } from "@/utils";
import { constants } from 'crypto';

export default {
  name: "tab3",
  props:["data1","data2","tab_title","able"],
  data() {
    return {
      form: null,
      clickable:false,
      title: `清凉一“夏”，美妆个护，低价来袭！`,
      tab3_imgUrl: null,
      card_list: [
        {
          goods_id: "",
          platform: "",
          img: null,
          selection_title: "",
          img_url: null
        }
      ],
      card_data: [
        {
          cat_id: "50011972",
          commission_rate: 300,
          coupon_amount: 30000,
          create_time: "2019-04-19 17:28:43.183779",
          goods_img_url: "",
          goods_url: "https://detail.tmall.com/item.htm?id=565569114301",
          id: "565569114301",
          modified_time: "2019-04-19 17:28:43.183779",
          platform: 0,
          price: 68000,
          promotion_amount: 4560,
          sell_pt: "",
          title:"AirPods(配充电盒)",
          volume: "26653",
          zk_price: 1246000
        }
      ]
    };
  },
  created() {
  },
  filters: {
    price: function(value) {
      var val = Number(value / 1000);
      return val;
    },
    quantity: function(value) {
      if (value >= 10000) {
        value = Number(value / 10000).toFixed(1) + "万";
      }
      return value;
    },
    number: function(value) {
      if (value == null) {
        value = 0;
      }
      return value;
    },
    price2: function(value) {
      var val = Number(value / 1000).toFixed(2);
      return val;
    }
  },
   mounted() {
    this.$dragging.$on("dragged", ({ value }) => {
        value.otherData = value.otherData.map((i, index) => {
          i = {
            goods_id: value.list[index].id,
            platform: value.list[index].platform == 1 ? "拼多多" : "淘宝",
             img:i.img,
            img_url:i.img_url,
            selection_title:value.list[index].title
          };
          return i;
        });
        this.card_list = value.otherData;
    })
  },
  methods: {
    add() {
      this.card_data.push({
        cat_id: "50011972",
        commission_rate: 300,
        coupon_amount: 30000,
        create_time: "2019-04-19 17:28:43.183779",
        goods_img_url: "",
        goods_url: "https://detail.tmall.com/item.htm?id=565569114301",
        id: "565569114301",
        modified_time: "2019-04-19 17:28:43.183779",
        platform: 0,
        price: 68000,
        promotion_amount: 4560,
        sell_pt: "",
        title:"AirPods(配充电盒)",
        volume: "26653",
        zk_price: 38000
      });
      this.card_list.push({
        goods_id: "",
        platform: "",
        selection_title: "",
        img: null,
        img_url: null
      });
    },
    close(e, i) {
      this.card_data.splice(i, 1);
      this.card_list.splice(i, 1);
    },
    customRequest2(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
          const isLt200k = file.file.size / 1024 < 200;
          if (!isLt200k) {
            this.$message.error("上传图片大小不能超过 200kb!");
          } else {
            this.tab3_img = file.file;
            this.tab3_imgUrl = imageUrl; 
          }
        });
      }
    },
    huanhang() {
      this.title = this.title.replace(/\n|\r\n/g, "<br/>");
    },
    grow(i) {
      this.clickable=true
      this.card_list[i].img_url = this.tab3_imgUrl;
      this.card_list[i].img = this.tab3_img;
      this.tab3_imgUrl = null;
      this.tab3_img = null;
      if (this.card_list[i].platform == "淘宝") {
        var platform = 0;
      } else if (this.card_list[i].platform == "拼多多") {
        var platform = 1;
      } else {
        var platform = this.card_list[i].platform;
      }
      let goods_id = this.card_list[i].goods_id;
      var data = new FormData();
      data.append("platform", platform);
      data.append("goods_id", goods_id);
      if(this.card_list[i].selection_title){
        data.append("selection_title", this.card_list[i].selection_title);
      }
      if (this.card_list[i].img) {
        data.append("selection_img", this.card_list[i].img);
      }else{
        data.append("selection_img", this.card_list[i].img_url);
      }
      this.axios.post("/admin/itemdetail", data).then(res => {
        if(!res.error){
             this.$set(this.card_data, i, res);
             this.card_list[i].selection_title=res.title
        }else {
            this.$notification["error"]({
              message: "错误",
              description: res.msg||res.error,
              duration: 3
            });
          }
          this.clickable=false
      }).catch(error=>{
        this.clickable=false
        console.log(error)
      })
    },
    sendtoparent(val1){
        this.$emit("listentochild",val1)
    }
  },
  computed: {
    filter_info() {
      const obj = {
        title: this.title,
        goods_data: this.card_list
      };
      var goods_data = [];
      for (var p of this.card_list) {
        if (p.platform == "淘宝") {
          goods_data.push({
            goods_id: p.goods_id,
            platform: 0,
            selection_title: p.selection_title,
            img: p.img,
            img_url: p.img_url
          });
        } else if (p.platform == "拼多多") {
          goods_data.push({
            goods_id: p.goods_id,
            platform: 1,
            selection_title: p.selection_title,
            img: p.img,
            img_url: p.img_url
          });
        } else {
          goods_data.push({
            goods_id: p.goods_id,
            platform: p.platform,
            selection_title: p.selection_title,
            img: p.img,
            img_url: p.img_url
          });
        }
      }
      obj.goods_data = goods_data;
      return obj;
    }
  },
  watch: {
    filter_info(val1,val2){
        this.sendtoparent(val1)
    },
    data2(val1,val2){
      if(val1.length>0){
          this.card_list=val1
      }
    },
    data1(val1,val2){
      this.card_data=val1
    },
    tab_title(val1,val2){
      this.title=val1
    }
  }
};
</script>

<style scoped>
.phone {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 375px;
  min-height: 500px;
}
.phone_card {
}
.avatar {
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  position: relative;
}
.avatar img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.grid {
  width: 100;
  position: relative;
}
[v-cloak] {
  display: none;
}
.card {
  background: white;
  box-sizing: border-box;
  overflow: hidden;
  width: 90%;
  border-radius: 10px;
  -moz-box-shadow: 0px 6px 20px #8a8a8a;
  -webkit-box-shadow: 0px 6px 20px #8a8a8a;
  box-shadow: 0px 6px 20px #8a8a8a;
  margin: 20px auto;
}
.title {
  font-weight: bold;
  padding-left: 16px;
  min-height: 31px;
  margin-bottom: 18px;
}

.rightmodel {
  position: absolute;
  right: -100%;
  top: 0;
  width: 100%;
  padding: 8px;
  background: #f8f8f8;
  border: 1px solid #eee;
  box-sizing: border-box;
}
.pro_btn {
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.mywidth {
 font-size: 18px;
 width: 90%;
  margin-left:5%;
  height: 25px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.myfont {
  width: 90%;
  margin: 0 auto;
    color: black;
  font-style: normal;
  margin-bottom: 5px;
  text-align: left;
}
.add_btn {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
</style>
