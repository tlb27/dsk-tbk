<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="7" :sm="24">
            <a-form-item label="用户ID搜索">
              <a-input v-model="queryParam.aid" style="width: 100%" placeholder="输入用户ID可以精准该用户所有提现记录" />
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="24">
            <a-form-item label="提现时间">
              <a-range-picker v-model="queryParam.date_range2"  style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="{span:4}" :sm="24">
            <span style="font-size: 16px;">
              提现统计：{{ sum }}元
            </span>
          </a-col>
          <a-col :md="4">
            <a-button type="primary" @click="$refs.table.refresh(true)">
              查询
            </a-button>
            <a-button style="margin-left: 8px" @click="reset">
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      align="center"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
    >
      <!-- onChange: onSelectChange  -->

      <div slot="avatar" slot-scope="text, record">
        <a-avatar shape="square" size="large" :src="text" />
      </div>
      <div slot="status" slot-scope="text,record">
        <div v-if="text == 0">
          <a-tag color="green">
            提现成功
          </a-tag>
        </div>
        <div v-else-if="text == 1">
          <a-tag color="red">
            提现失败
          </a-tag>
        </div>
        <div v-else-if="text == 2">
          <a-tag color="purple">
            待处理
          </a-tag>
        </div>
        <div v-else-if="text == 4">
          <a-tag color="orange">
            金额过低
          </a-tag>
        </div>
        <div v-else>
          <a-tag color="#2db7f5">
            已统计,待打款
          </a-tag>
        </div>
      </div>
      <div slot="pay_type" slot-scope="text,record">
        <div v-if="text == 0">
          <a-tag color="green">
            微信转账
          </a-tag>
        </div>
         <div v-else-if="text == 1">
          <a-tag color="purple">
            支付宝转账
          </a-tag>
        </div>
        <div v-else-if="text == 2">
          <a-tag color="orange">
            客服红宝
          </a-tag>
        </div>
        <div v-else>
          <a-tag color="#2db7f5">
            其他
          </a-tag>
        </div>
      </div>
       <div slot="pay_mode" slot-scope="text,record">
        <div v-if="text == 0">
          <a-tag color="green">
            月结
          </a-tag>
        </div>
         <div v-else-if="text == 1">
          <a-tag color="purple">
            手动提现
          </a-tag>
        </div>
        <div v-else>
          <a-tag color="orange">
            订单结算
          </a-tag>
        </div>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import {mapGetters} from 'vuex'
import moment from 'moment'

import { getRewardList } from '@/api/manage'


export default {
  name: 'RewardList',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: null,
      mdl: {},

      sum: '-', // 提现统计
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户ID',
          dataIndex: 'aid',
          key: 'aid',
          align: 'center',
          sorter: true
        },
        {
          title: '用户昵称',
          dataIndex: 'username',
          key: 'username'
        },
        {
          title: '用户头像',
          dataIndex: 'avatar',
          key: 'avatar',

          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '提现金额',
          dataIndex: 'fee',
          key: 'fee',
          sorter: true,
          needTotal: true,
          customRender: (text) => text + ' 元'
        },
        {
          title: '提现状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          filters: [{
            text: '提现成功',
            value: '0'
          }, {
            text: '提现失败',
            value: '1'
          }, {
            text: '待处理',
            value: '2'
          }, {
            text: '金额过低',
            value: '4'
          }]
        },
         {
          title: '提现方式',
          dataIndex: 'pay_mode',
          key: 'pay_mode',
          scopedSlots: { customRender: 'pay_mode' }
        },
        {
          title: '支付方式',
          dataIndex: 'pay_type',
          key: 'pay_type',
          scopedSlots: { customRender: 'pay_type' }
        },
        {
          title: '支付订单号',
          dataIndex: 'porder_no',
          key: 'porder_no'
        },
        {
          title: '错误描述',
          dataIndex: 'error_msg',
          key: 'error_msg'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          sorter: true
        },
        {
          title: '确认时间',
          dataIndex: 'result_time',
          key: 'result_time',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        
        if (this.filter_info.date_range2&&this.filter_info.date_range2.length>0) {
          this.filter_info.date_range = [this.filter_info.date_range2[0].format('YYYY-MM-DD 00:00:00'), this.filter_info.date_range2[1].format('YYYY-MM-DD 23:59:59')]
        }
        if (this.filter_info.aid) {
          this.filter_info.aid = Number(this.filter_info.aid)
        }
        delete this.filter_info.date_range2
        return getRewardList(Object.assign(parameter, this.filter_info))
          .then(res => {
            this.sum = res.data.cash_count||0
            console.log(res.data,'tixian');
            return res.data
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed:{
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
      if (val1 && val1 !== val2&& '/reward/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    }
  },
  methods: {
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh()
    }
  }
}
</script>
<style scoped>
  .ml30{
    margin-left: 30px;
  }
</style>
