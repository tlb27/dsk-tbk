<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="选品编辑页面" :bordered="false">
      <template slot="extra">
        <a-button type="primary" @click="back">返回</a-button>
      </template>
      <a-tabs v-model="activeKey">
        <a-tab-pane key="0" tab="主题1">
          <a-row type="flex" style="margin-bottom:50px" justify="center">
            <div class="phone" v-cloak>
              <div class="phone_card">
                <div class="header_top">
                  <div class="model1">
                    <div class="model1_pai">
                      <a-form>
                        <a-form-item
                          label="标题"
                          style="margin-bottom:10px"
                          :label-col="{ span: 5 }"
                          :wrapper-col="{ span: 19 }"
                        >
                          <a-textarea
                            v-model="title"
                            @input="huanhang"
                            placeholder="请输入自定义此次主题的title"
                            :rows="3"
                          />
                        </a-form-item>
                        <a-form-item
                          label="作者"
                          style="margin-bottom:10px"
                          :label-col="{ span: 5 }"
                          :wrapper-col="{ span: 19 }"
                        >
                          <a-input v-model="author" placeholder="请自定义主题的作者,默认为客服"/>
                        </a-form-item>
                        <a-form-item
                          label="主题图片"
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
                              :custom-request="customRequest"
                              action="null"
                              @change="handleChange"
                            >
                              <a-avatar
                                v-if="imgUrl"
                                style="width:100%;height:80px;"
                                shape="square"
                                :src="imgUrl"
                              />
                              <template v-else>
                                <a-icon type="plus"/>
                                <div class="ant-upload-text">点击上传格式为800*320同比例的图片作为主题图片</div>
                              </template>
                            </a-upload>
                          </div>
                        </a-form-item>
                      </a-form>
                      <div class="sanjiao"></div>
                    </div>
                  </div>
                  <div class="header_title" v-html="title"></div>
                  <div class="time_author">
                    <span class="daynow">今日热门</span>
                    <span class="author">作者：{{author}}</span>
                  </div>
                  <div class="title_start">
                    <div class="title_img">
                      <img :src="imgUrl">
                    </div>
                  </div>
                </div>
                <div id="recommend_card" v-cloak>
                  <div
                    class="card_border item"
                    v-for="(item,i) of card_data"
                    :key="i"
                    v-dragging="{ item: item, list: card_data, group: 'item',otherData:card_list}"
                  >
                    <span class="close" @click="close($event,i)">
                      <a-icon type="close"/>
                    </span>
                    <div class="model1">
                      <div class="model1_pai">
                        <a-form>
                          <a-form-item
                            style="margin-bottom:10px"
                            label="商品ID"
                            :label-col="{ span: 5 }"
                            :wrapper-col="{ span: 19 }"
                          >
                            <a-input
                              type="number"
                              @focus="hang(card_list[i].goods_id,i)"
                              v-model="card_list[i].goods_id"
                              placeholder="请输入商品ID,替换ID即替换商品"
                            />
                          </a-form-item>
                          <a-form-item
                            style="margin-bottom:10px"
                            label="商品平台"
                            :label-col="{ span: 5 }"
                            :wrapper-col="{ span: 19 }"
                          >
                            <a-select v-model="card_list[i].platform" @change="handleselect">
                              <a-select-option
                                @mouseenter="morebtn"
                                @mouseleave="leave"
                                value="0"
                              >淘宝</a-select-option>
                              <a-select-option
                                @mouseenter="morebtn"
                                @mouseleave="leave"
                                value="1"
                              >拼多多</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item style="margin:0">
                            <div class="pro_btn">
                              <a-button @click="grow(i,item)" :disabled="clickable" type="primary">生成</a-button>
                            </div>
                          </a-form-item>
                        </a-form>
                        <div class="sanjiao"></div>
                      </div>
                    </div>

                    <div class="transverse"  @click="showmodel1(i)">
                      <div class="fengmian">
                        <img class="fengmian_img" :src="item.goods_img_url">
                      </div>
                      <div class="more_price">
                        <div class="card_title">
                          <span v-if="item.platform==1">
                            <img
                              style="width:14px;height:14px;vertical-align: text-bottom;"
                              src="@assets/images/pingduoduo.svg"
                            >
                          </span>
                          <span v-if="item.platform==0">
                            <img
                              style="width:14px;height:14px;vertical-align: text-bottom;"
                              src="@assets/images/taobao.svg"
                            >
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
                <div class="add_btn" :class="{zaishow:active==1}" id="add_btn">
                  <a-button @click="add" type="primary">
                    新增一个商品
                    <a-icon type="plus"/>
                  </a-button>
                </div>

                <div class="tip">
                  <div v-if="content">
                    <span style="color:#c13f46;font-weight: 500;font-size: 15px;">热情提示:</span>
                    <span v-html="content"></span>
                  </div>
                  <div v-else>
                    <span style="color:#c13f46;font-weight: 500;font-size:15px;">热情提示:</span>
                    如果亲们觉得宝宝的分享很实用、很走心，记得将这些隐藏优惠券分享给亲朋好友哦~
                    <br>你们的喜爱，是宝宝推荐的动力呀~
                  </div>
                  <div class="model1">
                    <div class="model1_pai">
                      <a-form>
                        <a-form-item
                          label="提示内容"
                          style="margin-bottom:0;"
                          :label-col="{ span: 5 }"
                          :wrapper-col="{ span: 19 }"
                        >
                          <a-textarea
                            v-model="content"
                            @input="huanhang"
                            placeholder="请设置热情提示。若想设计推送模板,有想法请联系管理员"
                            :rows="3"
                          />
                        </a-form-item>
                      </a-form>
                      <div class="sanjiao"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="phone_edit"></div>
          </a-row>
        </a-tab-pane>
        <a-tab-pane  key="1" tab="主题2">
          <a-row type="flex" style="margin-bottom:50px;" justify="center">
            <div class="phone" v-cloak>
              <div class="phone_card">
                <div style="position: relative;">
                  <div @click="topmodel">
                    <div class="title_img" style="height:0;padding-bottom:40%;">
                      <img v-if="imgUrl1" style="position:absolute;top:0;left:0;" :src="imgUrl1">
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
                    v-dragging="{ item: item, list: card_data1, group: 'item',otherData:card_list1}"
                  >
                    <span class="close" style="z-index:100" @click="close1($event,i)">
                      <a-icon type="close"/>
                    </span>
                    <div
                      class="transverse"
                      @click="showmodel(i)"
                      style="padding:0;width:100%;display:flex;flex-direction:column;border:1px solid #eee;box-sizing:border-box"
                    >
                      <div class="fengmian" style="width:100%;padding-bottom:100%;">
                        <img class="fengmian_img" :src="item.goods_img_url">
                      </div>
                      <div class="more_price" style="width:100%;padding:0">
                        <div class="card_title">
                          <span v-if="item.platform==1">
                            <img
                              style="width:14px;height:14px;vertical-align: text-bottom;"
                              src="@assets/images/pingduoduo.svg"
                            >
                          </span>
                          <span v-if="item.platform==0">
                            <img
                              style="width:14px;height:14px;vertical-align: text-bottom;"
                              src="@assets/images/taobao.svg"
                            >
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
                <div
                  class="add_btn"
                  :class="{zaishow:active==1}"
                  style="margin-top:15px"
                  id="add_btn"
                >
                  <a-button @click="add1" type="primary">
                    新增一个商品
                    <a-icon type="plus"/>
                  </a-button>
                </div>
              </div>
            </div>
              <div>
                 <a-form>
                        <a-form-item
                          label="任务名"
                          style="margin-bottom:10px"
                          :label-col="{ span: 5 }"
                          :wrapper-col="{ span: 19 }"
                        >
                          <a-input v-model="title1" placeholder="请自定义主题的作者,默认为客服"/>
                        </a-form-item>
                      </a-form>
              </div>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="时尚杂志">
          <tab3 v-on:listentochild="showchildmsg" :tab_title="tab_title" :able="true" :data1="card_data2" :data2="card_list2"></tab3>
        </a-tab-pane>
      </a-tabs>
      <a-modal :visible="top_img" title="主题图片" :footer="null" @cancel="handleCancel1()">
        <a-form>
          <a-form-item
            label="主题图片"
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
                :custom-request="customRequest1"
                action="null"
              >
                <a-avatar
                  v-if="imgUrl1"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="imgUrl1"
                />
                <template v-else>
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">上传自定义banner</div>
                </template>
              </a-upload>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal  v-for="(model,c) of card_list"
        :key="c+'次'"
        :visible="model.previewVisible" title="商品图片" :footer="null"  @cancel="handleCancel(model)">
        <a-form>
          <a-form-item
            label="更改商品图片"
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
                :custom-request="customRequest3"
                action="null"
              >
                    <a-avatar
                  v-if="imgUrl3"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="imgUrl3"
                />
                 <a-avatar
                  v-else-if="model.img_url"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="model.img_url"
                />
                  <a-avatar
                  v-else-if="card_data[c].goods_img_url"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="card_data[c].goods_img_url"
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
              <a-button @click="grow(c,model)" :disabled="clickable" type="primary">确认</a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        v-for="(model,j) of card_list1"
        :key="j"
        :visible="model.previewVisible"
        title="商品"
        :footer="null"
        @cancel="handleCancel(model)"
      >
        <a-form>
          <a-form-item
            style="margin-bottom:10px"
            label="商品ID"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-input type="number" v-model="model.goods_id" placeholder="请输入商品ID,替换ID即替换商品"/>
          </a-form-item>
          <a-form-item
            style="margin-bottom:10px"
            label="商品平台"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-select v-model="model.platform">
              <a-select-option value="0">淘宝</a-select-option>
              <a-select-option value="1">拼多多</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="更改商品图片"
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
                  v-if="imgUrl2"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="imgUrl2"
                />
                 <a-avatar
                  v-else-if="model.img_url"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="model.img_url"
                />
                  <a-avatar
                  v-else-if="card_data1[j].goods_img_url"
                  style="width:100%;height:80px;"
                  shape="square"
                  :src="card_data1[j].goods_img_url"
                />
                <template v-else>
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">更改商品图片规格(800*800)</div>
                </template>
              </a-upload>
            </div>
          </a-form-item>
          <a-form-item style="margin:0" >
            <div class="pro_btn">
              <a-button @click="grow1(j,model)" :disabled="clickable1" type="primary">生成</a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button type="primary" style="margin-right:10px;" @click="handlegroup" :disabled="clickable2">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from "@/components/FooterToolbar";
import { mixin, mixinDevice } from "@/utils/mixin";
import { getBase64 } from "@/utils";
import { timeFix } from "@/utils/util";
import notifyImage from "../../notification/deal_notification/components/notify_img";
import { constants } from "crypto";
import { mapActions, mapGetters } from 'vuex'
import tab3 from "./tab/tab3"
export default {
  components: {
    notifyImage,
    FooterToolBar,
    tab3
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      activeKey: "0",
      clickable:false,
      clickable1:false,
      clickable2:false,
      active: 0,
      title:
        "示列:『今日免单福利立减1288元！请5分钟内确认！』，火爆朋友圈的零差评居家好物重磅上线！ |今日热门Vol.0329",
        tab_title:"",
      author: "品悦客服",
      card_list: [{ goods_id: "", platform: "",previewVisible:false,img:null,img_url:null }],
      card_list1: [],
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
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      admin:true,
      photo: "",
      imgUrl: null,
      title1:"",
      tab3_title:"",
      theme_id: null,
      //
      imgUrl1: null,
      imgUrl2:null,
      imgUrl3:null,
      top_img: false
    };
  },
  created() {
     if(this.userInfo.id!=1){
       this.admin=false
     }
    if(this.$route.query.theme_type){
      this.activeKey = this.$route.query.theme_type + "";
    }
    if (this.$route.query.theme_id) {
      this.theme_id = this.$route.query.theme_id;
      this.axios
        .get(
          "/admin/selection?theme_id=" + this.theme_id + "&not_theme_view=" + 1
        )
        .then(res => {
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
                previewVisible:false
              });
              this.$set(this.card_data, i, res.data.goods_data[i]);

              // this.card_data[i]=res.data.goods_data[i]
            }
            this.title = res.data.title;
            this.author = res.data.author;
            this.theme_img = res.data.theme_img;
            this.content = res.data.content;
            this.imgUrl = res.data.theme_img;
          }else if(this.activeKey=="1"){
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
                previewVisible:false
              });
              this.$set(this.card_data1, i, res.data.goods_data[i]);
            }
            this.title1=res.data.title
            this.theme_img1 = res.data.theme_img;
            this.imgUrl1 = res.data.theme_img;
          }else if(this.activeKey=="2"){
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
                selection_title:res.data.goods_data[i].title,
                img_url: res.data.goods_data[i].goods_img_url,
              })
              this.card_data2=res.data.goods_data
            }
            this.tab_title=res.data.title
        
          }
        });
    }
  },
  mounted() {
    this.$dragging.$on("dragged", ({ value }) => {
      if (this.activeKey == 0) {
        value.otherData = value.otherData.map((i, index) => {
          i = {
            goods_id: value.list[index].id,
            platform: value.list[index].platform == 1 ? "拼多多" : "淘宝",
             img:value.list[index].img,
            img_url:value.list[index].img_url,
            previewVisible: false
          };
          return i;
        });
        this.card_list = value.otherData;
      } else if (this.activeKey == 1) {
        value.otherData = value.otherData.map((i, index) => {
          i = {
            goods_id: value.list[index].id,
            platform: value.list[index].platform == 1 ? "拼多多" : "淘宝",
            img:value.list[index].img,
            img_url:value.list[index].img_url,
            previewVisible: false
          };
          return i;
        });
        this.card_list1 = value.otherData;
      }
    });
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
    hang(val, i) {},
    back() {
      this.$router.push({
        name: "products"
      });
    },
    showchildmsg:function(data){
      this.tab3data=data
    },
    handlegroup() {
      this.clickable2=true
      if (this.activeKey == 0) {
        let keyi = false;
        for (var i = 0; i < this.card_list.length; i++) {
          if (
            this.title == "" ||
            this.card_data[i].goods_img_url.length == 0 ||
            this.author == "" ||
            this.imgUrl == null ||
            this.content == ""
          ) {
            this.$notification["error"]({
              message: "错误",
              description: "存在错误商品或未填选项",
              duration: 4
            });
            keyi = false;
          } else {
            keyi = true;
          }
        }
        if (keyi) {
          var data = new FormData();
          data.append("title", this.title);
          data.append("author", this.author);
          data.append("theme_img", this.theme_img);
          data.append("activeKey", this.activeKey);
          var goods_data = [];
          for (var p of this.card_list) {
            if (p.platform == "淘宝") {
              goods_data.push({ goods_id: p.goods_id, platform: 0 });
            } else if (p.platform == "拼多多") {
              goods_data.push({ goods_id: p.goods_id, platform: 1 });
            } else {
              goods_data.push({ goods_id: p.goods_id, platform: p.platform });
            }
          }
          data.append("goods_data", JSON.stringify(goods_data));
          data.append("content", this.content);
          if (this.theme_id) {
            data.append("edit", 1);
            data.append("theme_id", this.theme_id);
          }
          this.axios.post("/admin/selection", data).then(res => {
            if (this.theme_id) {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `修改推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            } else {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `生成推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            }
            this.clickable2=false

          }).catch(error=>{
           this.$notification["error"]({
                  message: "错误",
                  description: "服务器错误",
                  duration: 4
                });
          this.clickable2=false
      })
        }
      } else if (this.activeKey == 1) {
        let tab1 = false;
        for (var i = 0; i < this.card_list1.length; i++) {
          if (
            this.card_data1[i].goods_img_url.length == 0 ||
            this.imgUrl1 == null
          ) {
            this.$notification["error"]({
              message: "错误",
              description: "存在错误商品或未填选项",
              duration: 4
            });
            tab1 = false;
          } else {
            tab1 = true;
          }
        }
        if (tab1) {
          var data = new FormData();
          data.append("theme_img", this.theme_img1);
          var goods_data = [];
          for (var p of this.card_list1) {
            if (p.platform == "淘宝") {
              goods_data.push({ goods_id: p.goods_id, platform: 0 });
            } else if (p.platform == "拼多多") {
              goods_data.push({ goods_id: p.goods_id, platform: 1 });
            } else {
              goods_data.push({ goods_id: p.goods_id, platform: p.platform });
            }
          }
          data.append("title", this.title1);
          data.append("author", null);
          data.append("content", null);
          data.append("goods_data", JSON.stringify(goods_data));
          if (this.theme_id) {
            data.append("edit", 1);
            data.append("theme_id", this.theme_id);
          }
          data.append("activeKey", this.activeKey);
          this.axios.post("/admin/selection", data).then(res => {
            if (this.theme_id) {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `修改推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            } else {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `生成推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            }
             this.clickable2=false
          }).catch(error=>{
           this.$notification["error"]({
                  message: "错误",
                  description: "服务器错误",
                  duration: 4
                });
          this.clickable2=false
      })
        }
      }else if(this.activeKey==2){
        console.log(this.tab3data)
        var tab2 = false;
        if(this.tab3data==undefined){
           this.$notification["error"]({
              message: "错误",
              description: "存在错误商品或未填选项",
              duration: 4
            });
             tab2 = false;
        }else{
          for (var i = 0; i < this.tab3data.goods_data.length; i++) {
          if (
            this.tab3data.title.length == 0 ||this.tab3data.goods_data[i].platform.length==0||this.tab3data.goods_data[i].goods_id.length==0
          ) {
            this.$notification["error"]({
              message: "错误",
              description: "存在错误商品或未填选项",
              duration: 4
            });
            tab2 = false;
          } else {
            tab2 = true;
          }
        }
        }
        if (tab2) {
          var data = new FormData();
          data.append("theme_img", null);
          var goods_data = [];
          for (var p of this.tab3data.goods_data) {
              goods_data.push({ goods_id: p.goods_id, platform: p.platform });
          }
          data.append("title", this.tab3data.title);
          data.append("author", null);
          data.append("content", null);
          data.append("goods_data", JSON.stringify(goods_data));
          if (this.theme_id) {
            data.append("edit", 1);
            data.append("theme_id", this.theme_id);
          }
          data.append("activeKey", this.activeKey);
          this.axios.post("/admin/selection", data).then(res => {
            if (this.theme_id) {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `修改推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            } else {
              if (res.error == 0) {
                this.$notification.success({
                  message: "success",
                  description: `生成推送主题成功`
                });
                setTimeout(() => {
                  this.$router.push({
                    name: "products"
                  });
                }, 1000);
              } else {
                this.$notification["error"]({
                  message: "错误",
                  description: res.msg + "或存在重复或商品列表太长",
                  duration: 4
                });
              }
            }
            this.clickable2=false
          }).catch(error=>{
           this.$notification["error"]({
                  message: "错误",
                  description: "服务器错误",
                  duration: 4
                });
          this.clickable2=false
      })
        }
      }
    },
    morebtn() {
      this.active = 1;
    },
    leave() {
      this.active = 0;
    },
    handleselect(value) {},
    customRequest(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
           const isLt200k = file.file.size/1024 < 200;
            if (!isLt200k) {
            this.$message.error('上传图片大小不能超过 200kb!,长宽为建议大小！');
            }else{
            this.theme_img = file.file;
            this.imgUrl = imageUrl;
            }
        });
      }
    },
    customRequest1(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
           const isLt200k = file.file.size/1024 < 200;
            if (!isLt200k) {
            this.$message.error('上传图片大小不能超过 200kb!,长宽为建议大小！');
            }else{
            this.theme_img1 = file.file;
            this.imgUrl1 = imageUrl;
            }
          this.top_img = false;
        });
      }
    },
    customRequest2(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
           const isLt200k = file.file.size/1024 < 200;
            if (!isLt200k) {
            this.$message.error('上传图片大小不能超过 200kb!,长宽为建议大小！');
            }else{
            this.theme_img2 = file.file;
            this.imgUrl2 = imageUrl;
            }
        });
      }
    },
    customRequest3(file, b, c) {
      if (file.file) {
        getBase64(file.file, imageUrl => {
          this.$emit("update:imgData", file.file);
           const isLt200k = file.file.size/1024 < 200;
            if (!isLt200k) {
            this.$message.error('上传图片大小不能超过 200kb!,长宽为建议大小！');
            }else{
            this.theme_img3 = file.file;
            this.imgUrl3 = imageUrl;
            }
        });
      }
    },
    topmodel() {
      this.top_img = true;
    },
    close(e, i) {
      if (this.card_data.length == 1) {
        alert("不要删太猛啦");
      } else {
        this.card_data.splice(i, 1);
        this.card_list.splice(i, 1);
      }
    },
    close1(e, i) {
      this.card_data1.splice(i, 1);
      this.card_list1.splice(i, 1);
    },
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
        title:
          "Amoi/夏新 K5全民k歌手机麦克风通用无线蓝牙话筒家用唱歌神器音响一体儿童卡拉OK电容麦克风安卓苹果通用",
        volume: "26653",
        zk_price: 38000
      });
      this.card_list.push({ goods_id: "", platform: "",previewVisible:false,img:null,img_url:null,});
    },
    add1() {
      this.card_data1.push({
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
      });
      this.card_list1.push({
        goods_id: "",
        platform: "",
        img:null,
        img_url:null,
        previewVisible: false
      });
    },
    grow(i, item) {
        this.clickable=true   
        this.card_list[i].img_url=this.imgUrl3
        this.card_list[i].img=this.theme_img3
        this.imgUrl3=null
        this.theme_img3=null   
      if (this.card_list[i].platform == "淘宝") {
        var platform = 0;
      } else if (this.card_list[i].platform == "拼多多") {
        var platform = 1;
      } else {
        var platform = this.card_list[i].platform;
      }
      let goods_id = this.card_list[i].goods_id;
      var data=new FormData()
      data.append("platform",platform)
      data.append("goods_id",goods_id)
      if(this.card_list[i].img){
        data.append("selection_img",this.card_list[i].img)
      }
      this.axios
        .post("/admin/itemdetail",data).then(res => {
          if (res.goods_img_url) {
            this.card_data[i].title = res.title;
            this.card_data[i].cat_id = res.cat_id;
            this.card_data[i].commission_rate = res.commission_rate;
            this.card_data[i].coupon_amount = res.coupon_amount;
            this.card_data[i].create_time = res.create_time;
            this.card_data[i].goods_img_url = res.goods_img_url;
            this.card_data[i].goods_url = res.goods_url;
            this.card_data[i].id = res.id;
            this.card_data[i].modified_time = res.modified_time;
            this.card_data[i].platform = res.platform;
            this.card_data[i].price = res.price;
            this.card_data[i].promotion_amount = res.promotion_amount;
            this.card_data[i].sell_pt = res.sell_pt;
            this.card_data[i].volume = res.volume;
            this.card_data[i].zk_price = res.zk_price;
            this.$notification.success({
              message: "success",
              description: `生成商品成功`
            });
            this.card_list[i].previewVisible = false;
          } else {
            this.$notification["error"]({
              message: "错误",
              description: res.msg||res.error,
              duration: 3
            });
          }
          this.clickable=false
        }).catch(error=>{
        this.clickable=true
        console.log(error)
      })
    },
    grow1(i, item) {
      this.clickable1=true
        this.card_list1[i].img_url=this.imgUrl2
      this.card_list1[i].img=this.theme_img2
      this.imgUrl2=null
      this.theme_img2=null 
      if (this.card_list1[i].platform == "淘宝") {
        var platform = 0;
      } else if (this.card_list1[i].platform == "拼多多") {
        var platform = 1;
      } else {
        var platform = this.card_list1[i].platform;
      }
      let goods_id = this.card_list1[i].goods_id;
       var data=new FormData()
      data.append("platform",platform)
      data.append("goods_id",goods_id)
      if(this.card_list1[i].img){
        data.append("selection_img",this.card_list1[i].img)
      }
      this.axios.post("/admin/itemdetail",data).then(res => {
          if (res.goods_img_url) {
            this.card_data1[i].title = res.title;
            this.card_data1[i].cat_id = res.cat_id;
            this.card_data1[i].commission_rate = res.commission_rate;
            this.card_data1[i].coupon_amount = res.coupon_amount;
            this.card_data1[i].create_time = res.create_time;
            this.card_data1[i].goods_img_url = res.goods_img_url;
            this.card_data1[i].goods_url = res.goods_url;
            this.card_data1[i].id = res.id;
            this.card_data1[i].modified_time = res.modified_time;
            this.card_data1[i].platform = res.platform;
            this.card_data1[i].price = res.price;
            this.card_data1[i].promotion_amount = res.promotion_amount;
            this.card_data1[i].sell_pt = res.sell_pt;
            this.card_data1[i].volume = res.volume;
            this.card_data1[i].zk_price = res.zk_price;
            this.$notification.success({
              message: "success",
              description: `生成商品成功`
            });
            this.card_list1[i].previewVisible = false;
          } else {
            this.$notification["error"]({
              message: "错误",
              description: res.msg||res.error,
              duration: 3
            })
          }
          this.clickable1=false
        }).catch(error=>{
        this.clickable1=true
        console.log(error)
      })
    },
    handleCancel(model) {
      model.previewVisible = false;
    },
    handleCancel1() {
      this.top_img = false;
    },
    showmodel(i) {
      this.card_list1[i].previewVisible = true;
    },
    showmodel1(i) {
      this.card_list[i].previewVisible = true;
    },
    handleChange(info) {
    },
    huanhang() {
      this.content = this.content.replace(/\n|\r\n/g, "<br/>");
      this.title = this.title.replace(/\n|\r\n/g, "<br/>");
    }
  },
   computed:{
    ...mapGetters(['userInfo'])
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
#recommend_card:hover .close {
  display: block;
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
.close {
  position: absolute;
  right: 5px;
  top: 0;
  padding: 0 4px;
  display: none;
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
