<template>
  <a-card :bordered="false">
    <a-row>
      <a-form layout="horizontal" class="text-align-left">
        <a-row :gutter="24">
          <a-col :xxl="6" :lg="12" :sm="24">
            <a-form-item label="订单ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-model="queryParam.trade_id" placeholder="输入订单ID可以精准查找该次订单" />
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :lg="12" :sm="24">
            <a-form-item label="用户ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-model="queryParam.uid" placeholder="输入用户ID可以查找改用户所有交易订单" />
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :lg="12" :sm="24">
            <a-form-item label="商品ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-model="queryParam.goods_id" placeholder="输入用户ID可以查找改用户所有交易订单" />
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :lg="12" :sm="24">
            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="下单时间">
              <a-range-picker
                v-model="queryParam.date_range2"
                style="width:100%"
                format="YYYY-MM-DD"
                @change="onChange"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="5" :lg="24" :sm="24">
             <a-form-item >
              <a-radio-group
                style="margin-right:20px;"
                v-model="queryParam.platform"
                button-style="solid"
                @change="searchfound"
              >
                <a-radio-button :value="2">全部</a-radio-button>
                <a-radio-button :value="0">淘宝</a-radio-button>
                <a-radio-button :value="1">拼多多</a-radio-button>
              </a-radio-group>
             </a-form-item>
          </a-col>
           <a-col :xxl="16" :xl="14" :lg="24" :sm="24">
             <a-form-item>
              <div class="mytip">
                <div style="padding-left:15px;">
                  <span style="font-weight:bold;margin-right:3px;">总订单数:</span>
                  {{total.order_count}}单，
                  <span v-for="(item,i) of scene_list" :key="i"><span style="font-weight:bold;margin-right:3px;">{{item.coupon_scene|namefilter}}:</span>
                  {{item.scene_count||0}}单，</span>
                </div>
              </div>
             </a-form-item>
           </a-col>
          <a-col :xxl="4" :xl="5" :lg="24" :sm="24">
            <a-form-item>
            <a-row type="flex" justify="end">
              <a-button  type="primary" @click="searchfound()">查找</a-button>
              <a-button :style="{ marginLeft: '10px'}" @click="handleReset">重置</a-button>
              <a download="拼多多订单.csv"></a>
              <a-button @click="download" :style="{ marginLeft: '10px'}">导出</a-button>
            </a-row>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- </a-col> -->
    </a-row>
    <s-table ref="table" size="default" :columns="columns" :data="loadData" :row-selection="null">
      <div slot="avatar" slot-scope="text,record" style="width:40px;height:40px;">
        <a-avatar shape="square" size="large" v-if="text.length>1" :src="text" />
        <img v-else src="../../assets/timg.png" style="width:100%;height:100%" />
      </div>
      <div slot="platform" slot-scope="text,record" style="width:40px;height:40px;">
        <img v-if="text==1" src="../../assets/pdd.png" style="width:100%;height:100%" />
        <img v-else src="../../assets/tb.png" style="width:100%;height:100%" />
      </div>
      <a
        slot="goods_name"
        slot-scope="text,record"
        target="_blank"
        style="text-decoration:underline;"
        :href="record.goods_url"
      >{{text.slice(0,12)}}</a>
      <div slot="rew_type" slot-scope="text,record">
        <div v-if="text == '第一次下单'">
          <a-tag color="#f50">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '第二次下单'">
          <a-tag color="#2db7f5">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '第三次下单'">
          <a-tag color="#87d068">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '普通奖励'">
          <a-tag color="#108ee9">{{ text }}</a-tag>
        </div>
        <div v-else-if="text=='商品推广'">
          <a-tag color="lime">商品推广</a-tag>
        </div>
        <div v-else>
          <a-tag color="purple">{{ text }}</a-tag>
        </div>
      </div>
      <div slot="coupon_scene" slot-scope="text,record">
        <div v-if="text == '未知'">
          <a-tag v-if="record.nickname=='未绑定'" color="pink">未绑定</a-tag>
          <a-tag v-else color="geekblue">未知</a-tag>
        </div>
        <div v-else-if="text == '商城购物'">
          <a-tag color="red">商城购物</a-tag>
        </div>
        <div v-else-if="text == '客服推送'">
          <a-tag color="orange">客服推送</a-tag>
        </div>
        <div v-else-if="text == '海报分享'">
          <a-tag color="green">海报分享</a-tag>
        </div>
        <div v-else-if="text == '口令查券'">
          <a-tag color="cyan">口令查券</a-tag>
        </div>
        <div v-else-if="text == '活动菜单栏'">
          <a-tag color="blue">活动菜单栏</a-tag>
        </div>
        <div v-else-if="text=='小程序'">
          <a-tag color="pink">小程序</a-tag>
        </div>
         <div v-else-if="text=='快应用'">
          <a-tag color="purple">快应用</a-tag>
        </div>
        <div v-else>
          <a-tag color="volcano">商品推广</a-tag>
        </div>
      </div>
      <div slot="rew_status" slot-scope="text,record">
        <div v-if="text == '订单完成'">
          <a-tag color="#f50">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '已收货'">
          <a-tag color="#2db7f5">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '已付款'">
          <a-tag color="#87d068">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '已结算'">
          <a-tag color="#108ee9">{{ text }}</a-tag>
        </div>
        <div v-else-if="text == '订单维权'">
          <a-tag color="#EEA9B8">{{ text }}</a-tag>
        </div>
        <div v-else>
          <a-tag color="purple">{{ text }}</a-tag>
        </div>
      </div>
    </s-table>
  </a-card>
</template>
<script>
import STable from "@/components/table/";
import ATextarea from "ant-design-vue/es/input/TextArea";
import AInput from "ant-design-vue/es/input/Input";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { getOrderList } from "@/api/manage";

const today = [moment("00:00:00", "HH:mm:ss"), moment("23:59:59", "HH:mm:ss")];

const columns = [
  {
    title: "用户ID",
    dataIndex: "uid",
    align: "center"
  },
  {
    title: "公众号",
    dataIndex: "uniac_name",
    align: "center"
  },
  {
    title: "用户",
    dataIndex: "nickname",
    key: "nickname",
    align: "center",
    width: 100
  },
  {
    title: "头像",
    dataIndex: "avatar",
    scopedSlots: { customRender: "avatar" },
    align: "center"
  },
  {
    title: "平台",
    dataIndex: "platform",
    align: "center",
    scopedSlots: { customRender: "platform" }
  },
  {
    title: "订单ID",
    dataIndex: "trade_id",
    align: "center",
    width: 150
  },
  {
    title: "商品ID",
    dataIndex: "goods_id",
    align: "center",
    width: 100
  },
  {
    title: "状态描述",
    dataIndex: "rew_status",
    scopedSlots: { customRender: "rew_status" },
    align: "center",
    filters: [
      {
        text: "已结算",
        value: "StatusSettled"
      },
      {
        text: "订单完成",
        value: "StatusOK"
      },
      {
        text: "已收货",
        value: "StatusReceived"
      },
      {
        text: "已付款",
        value: "StatusPaied"
      },
      {
        text: "已失效",
        value: "StatusFailed"
      },
      {
        text: "订单维权",
        value: "StatusRefund"
      }
    ]
    // onFilter: (value, record) => record.rew_status.indexOf(value) === 0
  },
  {
    title: "支付金额",
    dataIndex: "paied",
    align: "center",
    sorter: true,
    customRender: text => text + " 元"
  },
  {
    title: "佣金",
    dataIndex: "comission",
    align: "center",
    sorter: true,
    customRender: text => text + " 元"
  },
  {
    title: "奖励类型",
    dataIndex: "rew_type",
    scopedSlots: { customRender: "rew_type" },
    align: "center",
    filters: [
      {
        text: "第一次下单",
        value: "第一次下单"
      },
      {
        text: "普通奖励",
        value: "普通奖励"
      },
      {
        text: "第二次下单",
        value: "第二次下单"
      },
      {
        text: "第三次下单",
        value: "第三次下单"
      },
      {
        text: "好友首单",
        value: "好友首单"
      },
      {
        text: "商品推广",
        value: "商品推广"
      }
    ]
  },
  {
    title: "订单来源",
    dataIndex: "coupon_scene",
    scopedSlots: { customRender: "coupon_scene" },
    align: "cenetr",
    filters: [
      {
        text: "未知/未绑定",
        value: "未知"
      },
      {
        text: "商城购物",
        value: "商城购物"
      },
      {
        text: "客服推送",
        value: "客服推送"
      },
      {
        text: "海报分享",
        value: "海报分享"
      },
      {
        text: "口令查券",
        value: "口令查券"
      },
      {
        text: "活动菜单栏",
        value: "活动菜单栏"
      },
      ,
      {
        text: "小程序",
        value: "小程序"
      },
      {
        text: "商品推广",
        value: "商品推广"
      },
      {
        text: "快应用",
        value: "快应用"
      }
    ]
  },
  {
    title: "返利",
    dataIndex: "rew_fee",
    align: "center",
    sorter: true,
    customRender: text => text + " 元"
  },
  {
    title: "奖金",
    dataIndex: "friend_reward",
    align: "center",
    sorter: true,
    customRender: text => text + " 元"
  },
  {
    title: "下单时间",
    dataIndex: "pay_time",
    align: "center",
    sorter: true
  },
  {
    title: "商品名称",
    dataIndex: "goods_name",
    align: "left",
    scopedSlots: { customRender: "goods_name" }
  }
];

export default {
  components: {
    AInput,
    ATextarea,
    STable
  },
  data() {
    return {
      form: null,
      queryParam: { date_range2: today, platform: 2 }, //
      columns,
      mdl: {},
      history: {},
      total: {},
      scene_list:[],
      loadData: parameter => {
        console.log(parameter);
        if (parameter.page_size == undefined) {
          parameter.page_size = 20;
        }
        if (parameter.sortField) {
          this.sortField = parameter.sortField;
          this.filter_info.sortField = parameter.sortField;
        } else {
          delete this.sortField;
        }
        if (parameter.sortOrder) {
          this.sortOrder = parameter.sortOrder;
          this.filter_info.sortOrder = parameter.sortOrder;
        } else {
          delete this.sortOrder;
        }
        if (parameter.rew_status) {
          this.rew_status = parameter.rew_status;
        }
        if (parameter.rew_type) {
          this.rew_type = parameter.rew_type;
        }
        if (parameter.coupon_scene) {
          this.coupon_scene = parameter.coupon_scene;
        }
        if (parameter.rew_type && parameter.rew_type.length == 0) {
          delete parameter.rew_type;
          delete this.filter_info.rew_type;
        }
        if (parameter.rew_status && parameter.rew_status.length == 0) {
          delete parameter.rew_status;
          delete this.filter_info.rew_status;
        }
        if (parameter.coupon_scene && parameter.coupon_scene.length == 0) {
          delete parameter.coupon_scene;
          delete this.filter_info.coupon_scene;
        }
        var data = {
          ...parameter,
          ...this.filter_info
        };
        if (data.platform == 2) {
          delete data.platform;
        }
        console.log(this.filter_info);

        return getOrderList(Object.assign(data)).then(res => {
          if (this.filter_info.download) {
            var str = res.replace(/\#/g, " ");
            str = str.replace(/ID/, "id");
            var url = "data:text/csv;charset=utf-8,\ufeff" + str;
            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "订单列表" + ".csv");
            link.click();
            delete this.filter_info.download;
            return this.history;
          } else {
            for (var p of res.data.data) {
              if (p["friend_reward"] == undefined) {
                p["friend_reward"] = "￥0";
              }
              if (p["uid"] == 0) {
                p["uid"] = "";
              }
              if (p["rew_fee"] == null) {
                p["rew_fee"] = "￥0";
              }
              if (p["rew_type"] == 1) {
                p["rew_type"] = "第一次下单";
              }
              if (p["rew_type"] == 2) {
                p["rew_type"] = "第二次下单";
              }
              if (p["rew_type"] == 3) {
                p["rew_type"] = "第三次下单";
              }
              if (p["rew_type"] == 0) {
                p["rew_type"] = "普通奖励";
              }
              if (p["rew_type"] == 4) {
                p["rew_type"] = "好友首单";
              }
              if (p["rew_type"] == 20) {
                p["rew_type"] = "商品推广";
              }
              if (p["coupon_scene"] == -1) {
                p["coupon_scene"] = "未知";
              }
              if (p["coupon_scene"] == 0) {
                p["coupon_scene"] = "商城购物";
              }
              if (p["coupon_scene"] == 1) {
                p["coupon_scene"] = "客服推送";
              }
              if (p["coupon_scene"] == 2) {
                p["coupon_scene"] = "海报分享";
              }
              if (p["coupon_scene"] == 3) {
                p["coupon_scene"] = "口令查券";
              }
              if (p["coupon_scene"] == 4) {
                p["coupon_scene"] = "活动菜单栏";
              }
              if (p["coupon_scene"] == 6) {
                p["coupon_scene"] = "小程序";
              }
              if (p["coupon_scene"] == 20) {
                p["coupon_scene"] = "商品推广";
              }
              if (p["coupon_scene"] == 8) {
                p["coupon_scene"] = "快应用";
              }

              if (p["rew_status"] == 0) {
                p["rew_status"] = "已付款";
              }
              if (p["rew_status"] == 1) {
                p["rew_status"] = "已收货";
              }
              if (p["rew_status"] == 2) {
                p["rew_status"] = "订单完成";
              }
              if (p["rew_status"] == 3) {
                p["rew_status"] = "已结算";
              }
              if (p["rew_status"] == -1) {
                p["rew_status"] = "已失效";
              }
              if (p["rew_status"] == -2) {
                p["rew_status"] = "订单维权";
              }
            }
            // var data={data:res.data.data,item_count:res.data.item_count,page_count:res.data.page_count,page_no:res.data.page_no,page_size:res.data.page_size}
            this.history = res.data;
            this.total = res.data.total_temp;
            console.log(this.history.total_temp);
            this.scene_list=res.data.scene_list
            return res.data;
          }
        });
      }
    };
  },
  filters:{
    namefilter:function(value){
        if (value == -1) {
          value = "未知";
        }
        if (value == 0) {
          value = "商城购物";
        }
        if (value == 1) {
          value = "客服推送";
        }
        if (value == 2) {
          value = "海报分享";
        }
        if (value== 3) {
          value = "口令查券";
        }
        if (value == 4) {
          value = "活动菜单栏";
        }
        if (value == 6) {
          value = "小程序";
        }
        if (value == 7) {
          value= "商品推广";
        }
        if (value == 8) {
          value= "快应用";
        }
        return value;
    }
  },
  computed: {
    ...mapGetters([
      "user_uniacs_list",
      "uniac_id",
      "uniac_name",
      "refreshable"
    ]),
    filter_info() {
      const obj = {
        ...this.queryParam,
        uniac_id: this.uniac_id
      };
      if (obj.date_range2 && obj.date_range2.length > 0) {
        obj.date_range = [
          obj.date_range2[0].format("YYYY-MM-DD 0:0:0"),
          obj.date_range2[1].format("YYYY-MM-DD 23:59:59")
        ];
      }
      for (const key in obj) {
        if (
          (!obj[key] && obj[key] !== 0 && obj[key] !== "0") ||
          (Array.isArray(obj[key]) && obj[key].length === 0)
        ) {
          delete obj[key];
          continue;
        }
        if (key === "uid") {
          obj.uid = Number(obj.uid);
        }
      }
      return obj;
    }
  },
  watch: {
    uniac_id(val1, val2) {
      if (
        val1 !== val2 &&
        "/order/pdd_order" === this.$router.history.current.fullPath
      ) {
        this.$refs.table.refresh();
      }
    },
    refreshable(val1, val2) {
      if (
        val1 &&
        val1 !== val2 &&
        "/order/pdd_order" === this.$router.history.current.fullPath
      ) {
        this.$refs.table.refresh();
      }
    }
  },
  created() {},
  methods: {
    onChange(value, dateString) {},

    handleReset() {
      this.queryParam = { platform: 2 };
      this.$refs.table.refresh(true);
    },
    searchfound() {
      if (this.sortField && this.sortField != undefined) {
        this.filter_info.sortField = this.sortField;
      } else {
        delete this.filter_info.sortField;
      }
      if (this.sortOrder && this.sortOrder != undefined) {
        this.filter_info.sortOrder = this.sortOrder;
      } else {
        delete this.filter_info.sortOrder;
      }
      if (this.rew_status && this.rew_status.length != 0) {
        this.filter_info.rew_status = this.rew_status;
      } else {
        delete this.filter_info.rew_status;
      }
      if (this.rew_type && this.rew_type.length != 0) {
        this.filter_info.rew_type = this.rew_type;
      } else {
        delete this.filter_info.rew_type;
      }
      if (this.coupon_scene && this.coupon_scene.length != 0) {
        this.filter_info.coupon_scene = this.coupon_scene;
      } else {
        delete this.filter_info.coupon_scene;
      }
      this.$refs.table.refresh(true);
    },
    download() {
      this.filter_info.download = 1;
      this.$refs.table.refresh(true);
    }
  }
};
</script>
<style>
.text-align-left .ant-form-item-label {
  text-align: left;
}

.ant-layout-content .search-content {
  margin-top: 15px;
}

#components-table-demo-size h4 {
  margin-bottom: 16px;
}

.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
.mytip {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  border-radius: 4px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  line-height: 30px;
}
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}

#components-form-demo-advanced-search .ant-form-item {
  margin-bottom: 24px;
}

#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

.wid100 {
  width: 100%;
}
#components-badge-demo-dot .anticon-notification {
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
}
</style>
