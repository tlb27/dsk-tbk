<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="推广链接" :bordered="false">
      <template slot="extra">
        <a-button type="primary" @click="back">返回</a-button>
      </template>
      <div class="mycards">
        <div class="scorll_grid">
          <div class="scorll_box">
            <a-row
              type="flex"
              v-if="$route.query.theme_type==0"
              style="margin-bottom:50px"
              justify="center"
            >
              <div class="phone" v-cloak>
                <div class="phone_card">
                  <div class="header_top">
                    <div class="header_title" v-html="title"></div>
                    <div class="time_author">
                      <span class="daynow">今日热门</span>
                      <span class="author">作者：{{author}}</span>
                    </div>
                    <div class="title_start">
                      <div class="title_img">
                        <img :src="imgUrl" />
                      </div>
                    </div>
                  </div>
                  <div id="recommend_card" v-cloak>
                    <div class="card_border item" v-for="(item,i) of card_data" :key="i">
                      <div class="transverse">
                        <div class="fengmian">
                          <img class="fengmian_img" :src="item.goods_img_url" />
                        </div>
                        <div class="more_price">
                          <div class="card_title">
                            <span v-if="item.platform==1">
                              <img
                                style="width:14px;height:14px;vertical-align: text-bottom;"
                                src="@assets/images/pingduoduo.svg"
                              />
                            </span>
                            <span v-if="item.platform==0">
                              <img
                                style="width:14px;height:14px;vertical-align: text-bottom;"
                                src="@assets/images/taobao.svg"
                              />
                            </span>
                            {{item.title}}
                          </div>
                          <div class="card_wenan">
                            <div class="old">
                              <del>原价￥{{item.price|price}}</del>
                            </div>
                            <div>
                              <span class="old">月销{{item.volume|quantity}}件</span>
                            </div>
                          </div>
                          <div class="lingquan">
                            <span class="font_quan">
                              <span style="font-weight:bold">{{item.coupon_amount|price}}元</span>
                              <span style="color:#999999;">优惠券</span>
                            </span>
                          </div>
                          <div class="card_wenan">
                            <div style="display:flex;justify-content: center;align-items: center">
                              <span style="font-size:15px;vertical-align:baseline;">券后价</span>
                              <span class="quanhou_price">￥{{item.zk_price|price}}</span>
                            </div>
                            <div class="jiangjin" style="display:flex;">
                              <span>
                                <span style="vertical-align:baseline;">返利</span>
                                <span
                                  style="font-weight: bold;vertical-align:baseline;"
                                >￥{{item.promotion_amount|price}}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tip">
                    <div v-if="content">
                      <span style="color:#c13f46;font-weight: 500;font-size: 15px;">热情提示:</span>
                      <span v-html="content"></span>
                    </div>
                    <div v-else>
                      <span style="color:#c13f46;font-weight: 500;font-size:15px;">热情提示:</span>
                      如果亲们觉得宝宝的分享很实用、很走心，记得将这些隐藏优惠券分享给亲朋好友哦~
                      <br />你们的喜爱，是宝宝推荐的动力呀~
                    </div>
                  </div>
                </div>
              </div>
              <div class="phone_edit"></div>
            </a-row>
            <a-row
              type="flex"
              v-if="$route.query.theme_type==1"
              style="margin-bottom:50px;"
              justify="center"
            >
              <div class="phone" v-cloak>
                <div class="phone_card">
                  <div style="position: relative;">
                    <div>
                      <div class="title_img" style="height:0;padding-bottom:40%;">
                        <img v-if="imgUrl1" style="position:absolute;top:0;left:0;" :src="imgUrl1" />
                        <div
                          style="position:absolute;top:0;left:0; width:100%;height:100%;border:1px solid #ddd;cursor: pointer;text-align:center;line-height:150px;"
                          v-else
                        >点击上传格式为800*320同比例的图片作为主题图片</div>
                      </div>
                    </div>
                  </div>
                  <div id="recommend_card" v-cloak>
                    <div
                      class="card_border item"
                      style="width:49.5%;padding:0 0 3px 0"
                      v-for="(item,i) of card_data1"
                      :key="i"
                    >
                      <div
                        class="transverse"
                        style="padding:0;width:100%;display:flex;flex-direction:column;border:1px solid #eee;box-sizing:border-box"
                      >
                        <div class="fengmian" style="width:100%;padding-bottom:100%;">
                          <img class="fengmian_img" :src="item.goods_img_url" />
                        </div>
                        <div class="more_price" style="width:100%;padding:0">
                          <div class="card_title">
                            <span v-if="item.platform==1">
                              <img
                                style="width:14px;height:14px;vertical-align: text-bottom;"
                                src="@assets/images/pingduoduo.svg"
                              />
                            </span>
                            <span v-if="item.platform==0">
                              <img
                                style="width:14px;height:14px;vertical-align: text-bottom;"
                                src="@assets/images/taobao.svg"
                              />
                            </span>
                            {{item.title}}
                          </div>
                          <div class="card_wenan">
                            <div class="old">
                              <del>原价￥{{card_data1[i].price|price}}</del>
                            </div>
                            <div>
                              <span class="old">月销{{card_data1[i].volume|quantity}}件</span>
                            </div>
                          </div>
                          <div class="lingquan">
                            <span class="font_quan">
                              <span style="font-weight:bold">{{card_data1[i].coupon_amount|price}}元</span>
                              <span style="color:#999999;">优惠券</span>
                            </span>
                          </div>
                          <div class="card_wenan" style="margin-bottom:10px">
                            <div style="display:flex;justify-content: center;align-items: center">
                              <span class="quanhou_price">￥{{card_data1[i].zk_price|price}}</span>
                            </div>
                            <div class="jiangjin" style="display:flex;">
                              <span>
                                <span style="vertical-align:baseline;">返利</span>
                                <span
                                  style="font-weight: bold;vertical-align:baseline;"
                                >￥{{card_data1[i].promotion_amount|price}}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-row>
            <tab3
              v-if="$route.query.theme_type==2"
              v-on:listentochild="showchildmsg"
              :tab_title="tab_title"
              :data1="card_data2"
              :data2="card_list2"
              :able="false"
            ></tab3>
          </div>
        </div>
        <div class="right_link">
            <a-form>
            <a-form-item label="使用场景" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chosescene"  style="width: 360px" @change="myscene">
                <template v-for="scene in scenes">
                  <a-select-option :value="scene">{{scene}}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item label="公众号选择" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select  mode="multiple" style="width: 360px" v-model="uniac_id" :disabled="enabled">
                <template v-for="uniac in user_uniacs_list" >
                  <a-select-option :value="uniac.uniac_id">{{uniac.uniac_name}}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item label="输入链接" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button type="primary" style="margin-left: 15px;" @click="growlink">生成链接</a-button>
            </a-form-item>
            <template v-for="result in resultList">
              <a-form-item
                :label="result.name"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
              <div class="myinput">
                   <a-input :value="result.link" :disabled="true" style="width: 480px"></a-input>
                <a-button
                  type="primary"
                  style="margin-left: 15px;"
                  v-clipboard:copy="result.link"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制链接</a-button>
              </div>
              </a-form-item>
            </template>
          </a-form>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin";
import { getBase64 } from "@/utils";
import { timeFix } from "@/utils/util";
import { constants } from "crypto";
import { mapActions, mapGetters } from "vuex";
import tab3 from "./edit/tab/tab3";
export default {
  components: {
    tab3
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      activeKey: "0",
      active: 0,
      title:
        "示列:『今日免单福利立减1288元！请5分钟内确认！』，火爆朋友圈的零差评居家好物重磅上线！ |今日热门Vol.0329",
      tab_title: "",
      getInfo: false,  
      author: "品悦客服",
      card_list: [
        {
          goods_id: "",
          platform: "",
          previewVisible: false,
          img: null,
          img_url: null
        }
      ],
      card_list1: [],
      uniac_id: [],  
      chosescene:"客服消息",
      card_list2: [],
      content: `如果亲们觉得宝宝的分享很实用、很走心，记得将这些隐藏优惠券分享给亲朋好友哦~<br>你们的喜爱，是宝宝推荐的动力呀~`,
      card_data1: [],
      card_data2: [
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
          title:
            "Amoi/夏新 K5全民k歌手机麦克风通用无线蓝牙话筒家用唱歌神器音响一体儿童卡拉OK电容麦克风安卓苹果通用",
          volume: "26653",
          zk_price: 38000
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
          title:
            "Amoi/夏新 K5全民k歌手机麦克风通用无线蓝牙话筒家用唱歌神器音响一体儿童卡拉OK电容麦克风安卓苹果通用",
          volume: "26653",
          zk_price: 38000
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      lianjie:"",
      uniac_id: [],
      scenes:["客服消息","图文推送"],
      resultList: [],
      admin: true,
      photo: "",
      imgUrl: null,
      title1: "",
      enabled:false,
      sucg:true,
      tab3_title: "",
      theme_id: null,
      //
      imgUrl1: null,
      imgUrl2: null,
      imgUrl3: null,
      top_img: false
    };
  },
  created() {
      this.lianjie="http://mobile.morejoying.com/#/recommend?theme_type="+this.$route.query.theme_type+"&theme_id="+this.$route.query.theme_id
      if(this.chosescene="客服消息"){
          this.enabled=true
      }
    if (this.userInfo.id != 1) {
      this.admin = false;
    }
    if (this.$route.query.theme_type) {
      this.activeKey = this.$route.query.theme_type + "";
    }
    if (this.$route.query.theme_id) {
      this.theme_id = this.$route.query.theme_id;
      this.axios
        .get(
          "/admin/selection?theme_id=" + this.theme_id + "&not_theme_view=" + 1
        )
        .then(res => {
          if(res.error==0){
            for(var pt of res.data.goods_data){
              if(pt.platform==0){
                this.sucg=false
              }
            }
          }
          if (this.activeKey == "0") {
            for (var i = 0; i < res.data.goods_data.length; i++) {
              var platform;
              if (res.data.goods_data[i].platform == 0) {
                platform = "淘宝";
              }
              if (res.data.goods_data[i].platform == 1) {
                platform = "拼多多";
              }
              this.$set(this.card_list, i, {
                goods_id: res.data.goods_data[i].id,
                platform: platform,
                previewVisible: false
              });
              this.$set(this.card_data, i, res.data.goods_data[i]);

              // this.card_data[i]=res.data.goods_data[i]
            }
            this.title = res.data.title;
            this.author = res.data.author;
            this.theme_img = res.data.theme_img;
            this.content = res.data.content;
            this.imgUrl = res.data.theme_img;
          } else if (this.activeKey == "1") {
            for (var i = 0; i < res.data.goods_data.length; i++) {
              var platform;
              if (res.data.goods_data[i].platform == 0) {
                platform = "淘宝";
              }
              if (res.data.goods_data[i].platform == 1) {
                platform = "拼多多";
              }
              this.$set(this.card_list1, i, {
                goods_id: res.data.goods_data[i].id,
                platform: platform,
                previewVisible: false
              });
              this.$set(this.card_data1, i, res.data.goods_data[i]);
            }
            this.title1 = res.data.title;
            this.theme_img1 = res.data.theme_img;
            this.imgUrl1 = res.data.theme_img;
          } else if (this.activeKey == "2") {
            for (var i = 0; i < res.data.goods_data.length; i++) {
              var platform;
              if (res.data.goods_data[i].platform == 0) {
                platform = "淘宝";
              }
              if (res.data.goods_data[i].platform == 1) {
                platform = "拼多多";
              }

              this.card_list2.push({
                goods_id: res.data.goods_data[i].id,
                platform: platform,
                img: null,
                selection_title: res.data.goods_data[i].title,
                img_url: res.data.goods_data[i].goods_img_url
              });
              this.card_data2 = res.data.goods_data;
            }
            this.tab_title = res.data.title;
          }
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
  methods: {
      growlink(){
          var result=[]
          if(this.chosescene=="客服消息"){
            if(this.sucg){
              result.push({link:this.lianjie+"&show_promo=1",name:"主题链接"})
              this.resultList=result
            }else{
              result.push({link:this.lianjie,name:"主题链接"})
              this.resultList=result
            }
          }else{
              for(var p of this.uniac_id){
                  for(var u of this.user_uniacs_list){
                      if(p==u.uniac_id){
                          result.push({link:this.lianjie+"&sourceOrder=1"+"&uniac_id="+p,name:u.uniac_name})
                      }
                  }
              }
              this.resultList=result
          }
      },
    back() {
      this.$router.push({
        name: "products"
      });
    },
    myscene(i){
        this.chosescene=i
        console.log(i)
        if(i=="客服消息"){
            this.enabled=true
        }else{
            this.enabled=false
        }
    },
    showchildmsg: function(data) {
      this.tab3data = data;
    },
      onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.success("复制失败, 请重试");
    },
    huanhang() {
      this.content = this.content.replace(/\n|\r\n/g, "<br/>");
      this.title = this.title.replace(/\n|\r\n/g, "<br/>");
    }
  },
  computed: {
    ...mapGetters(["userInfo",'user_uniacs_list'])

  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
#recommend_card {
  width: 100%;
  min-height: 80px;
  position: relative;
  margin-top: 25px;
  display: flex;
  padding: 0 3px;
  flex-wrap: wrap;
  justify-content: space-between;
}
#recommend_card:hover {
  /* border: 1px dotted blue; */
  cursor: pointer;
}
.phone_card:hover .add_btn {
  display: block;
}

.card_border {
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.disable {
  display: none;
}
.card_border:not(:first-child) {
  margin-top: 0px;
}
.lingquan {
  width: 100%;
  /* padding: 3vw; */
  display: flex;
  box-sizing: border-box;
}
.card_wenan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 3.5px;
  box-sizing: border-box;
}
.font_quan {
  font-size: 16px;
  color: #f52724;
  justify-content: flex-start;
  display: flex;
  align-items: center;
}

.jump {
  width: 50%;
  height: 90%;
  color: white;
  display: flex;
  font-size: 4.5vw;
  align-items: center;
  justify-content: space-around;
}
.bg_url {
  display: flex;
  justify-content: space-between;
  /* background: url("../../../assets/quan.png") no-repeat; */
  background-size: 100% 100%;
  width: 93vw;
  height: 11vw;
}
.scorll_grid {
  width: 375px;
  margin-left: 5%;
  height: 667px;
}
.more_price {
  width: 65%;
  padding: 0 0 0 7px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.line {
  width: 100%;
  border-top: 1px solid #dddddd;
}
.mycards {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.transverse {
  padding: 12px 7px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.t_line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.jiangjin {
  border-radius: 2px;
  padding: 0 3.5px;
  font-size: 15px;
  background: #fff2f2;
  color: #f52724;
}
.text {
  background: #f52724;
  color: white;
  font-size: 4vw;
  padding: 0 3vw;
  width: 50vw;
}
.fengmian {
  width: 35%;
  padding-bottom: 35%;
  height: 0;
  position: relative;
  background: #eee;
}
.fudong {
  background: #fb6921;
  position: absolute;
  color: white;
  top: 0;
  border-radius: 5px;
  left: 12%;
  transform: translate(-50%, -50%);
  font-size: 5vw;
  padding: 0 3vw;
}
.old {
  color: #999999;
  vertical-align: baseline;
}
.quanhou {
  margin: 3.5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3vw;
}
.describe {
  text-align: left;
  margin: 3vw 0;
}
.quanhou_price {
  color: #f52724;
  display: inline-block;
  vertical-align: baseline;
  font-size: 15px;
  font-weight: bold;
  vertical-align: baseline;
}
.fengmian_img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.myinput{
    width: 100%;
    display: flex;
    flex-direction: row;
}
.scorll_box {
  width: 375px;
  height: 667px;
  overflow-y: auto;
}
.scorll_box::-webkit-scrollbar {
  display: none;
}
.card_title {
  font-size: 14px;
  text-align: left;
  color: #333333;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.text-align-left .ant-form-item-label {
  text-align: left;
}
.phone {
  border: 1px solid #eee;
}
.phone_edit {
  min-width: 320px;
  width: 375px;
  z-index: -1;
}
.phone_card {
  min-width: 320px;
  width: 375px;
}

.title_img {
  width: 100%;
  height: 120px;
}
.title_img img {
  width: 100%;
  height: 100%;
}
.header_top {
  padding: 12px 16px;
  position: relative;
}
.header_top:hover {
  /* border: 1px dotted blue; */
  cursor: pointer;
}
.right_link {
    display: flex;
    margin-left: 4%;
}
.textare {
  height: 200px;
  width: 300px;
  padding: 4px;
  border: 1px solid #888;
  resize: vertical;
  overflow: auto;
}
.model1 {
  width: 95%;
  position: absolute;
  right: 0%;
  padding: 0 10px;
  transform: translateX(100%);
  top: 0;
}
.model1_pai {
  background: #f8f8f8;
  border: 1px solid #eee;
  padding: 8px;
  position: relative;
}
.model1:hover .sanjiao {
  border: 10px solid transparent;
  border-right: 10px solid #f8f8f8;
  position: absolute;
  top: 10%;
  left: 0;
  transform: translateX(-100%);
}
.time_author {
  display: flex;
  justify-content: flex-start;
}
.header_title {
  margin-bottom: 12px;
  font-size: 16px;
  word-wrap: break-word;
  word-break: normal;

  font-weight: bold;
}
.daynow {
  color: rgb(0, 82, 140);
}
.author {
  color: #999999;
  margin-left: 18px;
}
.title_start {
  text-align: left;
  margin: 20px 0 0;
}
.tip {
  position: relative;
  font-size: 14px;
  text-align: center;
  margin: 30px 0;
  padding: 0 16px;
  z-index: 10;
  word-wrap: break-word;
  word-break: normal;
}

.tip:hover {
  /* border: 1px dotted blue; */
  cursor: pointer;
}
.pro_btn {
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.add_btn {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  display: none;
}
.zaishow {
  display: block;
}
</style>
