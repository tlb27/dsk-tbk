<template>
  <a-card :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form
        style="background:white;border:1px solid transparent;border-bottom:1px solid #d9d9d9 "
        class="ant-advanced-search-form"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item
              label="订单ID搜索"
            >
              <a-input
                v-model="queryParam.order_sn"
                v-decorator="[
                  'order_sn',
                  {rules: [{ message: 'Please input your note!' }]}
                ]"
                placeholder="输入订单ID可以精准查找该次订单"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="用户ID搜索"
            >
              <a-input
                v-model="queryParam.uid"
                v-decorator="[
                  'uid',
                  {rules: [{ message: 'Please input your note!' }]}
                ]"
                placeholder="输入用户ID可以查找改用户所有交易订单"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="更新时间搜索"
            >
              <a-range-picker v-model="queryParam.order_modify_at" v-decorator="['order_modify_at', rangeConfig]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="margin-left: -12px; margin-right: -12px;">
          <a-col :span="8" style="padding-left: 12px; padding-right: 12px;">
            <a-form-item
              label="公众号搜索"
            >
              <a-select
                v-model="queryParam.uniac_id"
                v-decorator="[
                  'uniac_id'
                ]"
                placeholder="请输入公众号ID"
              >
                <a-select-option value="1">
                  优惠省钱网购
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="16"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              type="primary"
              @click="getsearch"
            >
              查找
            </a-button>
            <a-button
              :style="{ marginLeft: '20px',marginRight:'50px' }"
              @click="handleReset"
            >
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div id="components-table-demo-size">
      <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="onchange">
        <div slot="avatar" slot-scope="text,record" style="width:35px;height:35px;">
          <img :src="text" style="width:100%">
        </div>
        <div slot="order_status_desc" slot-scope="text,record">
          <div v-if="text == '已成团'">
            <a-tag color="#87d068">
              {{ text }}
            </a-tag>
          </div>
          <div v-else-if="text == '未支付,已取消'">
            <a-tag color="gray">
              {{ text }}
            </a-tag>
          </div>
          <div v-else-if="text == '非多多进宝商品'">
            <a-tag color="purple">
              {{ text }}
            </a-tag>
          </div>
          <div v-else-if="text == '确认收货'">
            <a-tag color="#f50">
              {{ text }}
            </a-tag>
          </div>
          <div v-else>
            <a-tag color="#2db7f5">
              {{ text }}
            </a-tag>
          </div>
        </div>
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value!=='50'">
            {{ props.value }}条/页
          </span>
          <span v-if="props.value==='50'">
            全部
          </span>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script>
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
function validatePrimeNumber(number) {
  if (number === 11) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The prime between 8 and 12 is 11!'
  }
}

const pagination = {
  total: 100,
  current: 1,
  pageSize: 15,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50']
  //  console.log(current,size)
}

// function getpage(current,size) {
//     let data={page_no:current,pageSize:size}
//     let _this=this
//     this.axios.post("/admin/pdd-order-list",data).then(function(res){
//     console.log(res)
// })

// }

const columns = [
  {
    title: '用户ID',
    dataIndex: 'uid'
  },
  {
    title: '公众号',
    dataIndex: 'uniac_id'
  },
  {
    title: '用户',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 150
  },
  {
    title: 'icon',
    dataIndex: 'avatar',
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '订单ID',
    dataIndex: 'order_sn',
    width: 200
  },
  {
    title: '状态描述',
    dataIndex: 'order_status_desc',
    scopedSlots: { customRender: 'order_status_desc' },
    filters: [{
      text: '已成团',
      value: '已成团'
    }, {
      text: '未支付,已取消',
      value: '未支付,已取消'
    }, {
      text: '非多多进宝商品',
      value: '非多多进宝商品'
    }, {
      text: '确认收货',
      value: '确认收货'
    }, {
      text: '审核通过',
      value: '审核通过'
    }],
    onFilter: (value, record) => record.order_status_desc.indexOf(value) === 0
  },
  {
    title: '支付金额',
    dataIndex: 'order_amount',
    sorter: true,
    needTotal: true
  },
  {
    title: '佣金',
    dataIndex: 'promotion_amount',
    sorter: true
  },
  {
    title: '返利',
    dataIndex: 'reward',
    sorter: true
  },
  {
    title: '奖金',
    dataIndex: 'pro_fee',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'order_modify_at',
    sorter: true
  },
  {
    title: '商品名称',
    dataIndex: 'goods_name'
  }
]

export default {
  components: {
    AInput,
    ATextarea
  },
  data() {
    return {
      data: [],
      columns,
      queryParam: { order_sn: '', uid: '', order_modify_at: [] },
      pagination,

      rangeConfig: {
        rules: [{ type: 'array' }]
      }
    }
  },
  created() {
    var _this = this
    const data = { pageSize: _this.pagination.pageSize, page_no: _this.pagination.current, order_key: 'order_modify_at', order_method: 'descend' }
    this.axios.post('/admin/pdd-order-list', data).then(function(res) {
      _this.getData(res)
      // console.log(_this.data)
    })
  },

  methods: {
    // 获取数据通用方法
    getData(res) {
      this.pagination.total = res.data.item_count
      this.pagination.current = res.data.page_no
      let i = 1
      const list = []
      for (var p of res.data.data) {
        p['key'] = i + ''
        if (p['uniac_id'] == 1) {
          p['uniac_id'] = '优惠省钱网购'
        }
        if (p['goods_name'].length > 16) {
          p['goods_name'] = p['goods_name'].slice(0, 16) + '...'
        }
        list.push({ key: p.key, uniac_id: p.uniac_id, nickname: p.nickname, uid: p.uid, avatar: p.avatar, order_sn: p.order_sn, order_status_desc: p.order_status_desc, order_amount: p.order_amount, promotion_amount: p.promotion_amount, reward: p.reward, pro_fee: p.pro_fee, order_modify_at: p.order_modify_at, goods_name: p.goods_name })
        this.data = list
        i++
      }
    },
    handleReset() {
      var _this = this
      this.queryParam = { order_sn: '', uid: '', order_modify_at: [] }
      const data = { pageSize: this.pagination.pageSize, page_no: this.pagination.current }
      this.axios.post('/admin/pdd-order-list', data).then(function(res) {
        _this.getData(res)
      })
    },
    // 查找
    getsearch() {
      var _this = this
      var data = { order_sn: this.queryParam.order_sn, uid: this.queryParam.uid, uniac_id: this.queryParam.uniac_id, pageSize: this.pagination.pageSize, page_no: this.pagination.current }
      if (this.queryParam.order_modify_at.length != 0) {
        console.log(this.queryParam.order_modify_at)
        data.date_range = [this.queryParam.order_modify_at[0].format('YYYY-MM-DD 00:00:00'), this.queryParam.order_modify_at[1].format('YYYY-MM-DD 23:59:59')]
      }
      if (this.queryParam.uid.length == 0) {
        data.uid = this.queryParam.uid
      } else {
        data.uid = parseInt(this.queryParam.uid)
      }
      if (this.queryParam.uniac_id == undefined) {
        delete data.uniac_id
      }
      for (var key in data) {
        if (data[key].length == 0) {
          delete data[key]
        }
      }
      console.log(data)
      this.axios.post('/admin/pdd-order-list', data).then(function(res) {
        _this.getData(res)
        console.log(_this.data)
      })
    },
    //  table 一发生改变就触发
    onchange(a, b, c) {
      console.log(this.queryParam)
      var _this = this
      const data = { pageSize: a.pageSize,
        page_no: a.current,
        order_key: c.field,
        order_method: c.order,
        goods_status: b.order_status_desc,
        order_sn: this.queryParam.order_sn, uid: this.queryParam.uid, uniac_id: this.queryParam.uniac_id }
      if (this.queryParam.order_modify_at.length != 0) {
        console.log(this.queryParam.order_modify_at)
        data.date_range = [this.queryParam.order_modify_at[0].format('YYYY-MM-DD HH:mm:ss'), this.queryParam.order_modify_at[1].format('YYYY-MM-DD HH:mm:ss')]
      }
      if (this.queryParam.uid.length == 0) {
        data.uid = this.queryParam.uid
      } else {
        data.uid = parseInt(this.queryParam.uid)
      }
      if (b.order_status_desc != undefined) {
        if (b.order_status_desc.length != 0) {
          data.goods_status = b.order_status_desc
        } else {
          data.goods_status = undefined
        }
      }
      for (var key in data) {
        if (data[key] == undefined) {
          delete data[key]
        }
      }
      console.log(data)
      this.axios.post('/admin/pdd-order-list', data).then(function(res) {
        _this.getData(res)
        console.log(_this.data)
      })
      // console.log(c)
      // console.log(b)
    }

  }

}
</script>
<style>
.ant-layout-content .search-content{
      margin-top: 15px;
}
#components-table-demo-size h4 { margin-bottom: 16px; }
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

#components-form-demo-advanced-search .ant-form {
  max-width: none;
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
</style>
