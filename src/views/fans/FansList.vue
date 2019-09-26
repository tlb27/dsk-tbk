<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="{span:8,offset:0}" :sm="24">
            <a-form-item label="订单数">
              <a-input v-model="queryParam.order_count" type="number" style="width: 100%" placeholder="筛选订单数大于输入值的用户" />
            </a-form-item>
          </a-col>
          <a-col :md="{span:8,offset:1}" :sm="24">
            <a-form-item label="好友数">
              <a-input
                v-model="queryParam.friends_count"
                type="number"
                style="width: 100%"
                placeholder="筛选好友数量大于输入值的用户"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{span:4,offset:1}" :sm="24">
            <a-radio-group v-model="status" button-style="solid" @change="onRadioChange">
              <a-radio-button :value="1">
                关注用户
              </a-radio-button>
              <a-radio-button :value="0">
                取关用户
              </a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :offset="0" :md="{span:8,offset:0}" :sm="24">
            <a-form-item>
              <a-row :gutter="24">
                   <a-input-group compact style="display:flex;flex-direction: row">
                    <a-select defaultValue="用户id"  @change="handleselectChange">
                      <a-select-option value="用户ID">用户id</a-select-option>
                      <a-select-option value="昵称">昵称</a-select-option>
                    </a-select>
                    <a-input v-show="dis.dis1" v-model="queryParam.uid" style="width: 80%" placeholder="请输入用户ID" />
                    <a-input v-show="dis.dis2" v-model="queryParam.username" style="width: 80%" placeholder="请输入用户昵称" />
                  </a-input-group>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :md="{span:8,offset:1}" :sm="24">
            <a-form-item label="关注时间">
              <a-range-picker v-model="queryParam.daterange2" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="{span:4,offset:1}" :sm="24">
            <a-form-item>
              <span class="table-page-search-subrowSelectionmitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">
                  查询
                </a-button>
                <a-button style="margin-left: 8px" @click="reset">
                  重置
                </a-button>
                <a-button style="margin-left: 8px" @click="download">
                  导出
                </a-button>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
    >
      <div slot="avatar" slot-scope="text, record">
        <a-avatar shape="square" size="large" :src="text" />
      </div>
    </s-table>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import moment from 'moment'
import { getFansList } from '@/api/manage'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FansList',
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
      status:1,
      form: null,
      mdl: {},
      type: '用户ID',
      canshu:{},
      dis: {
        dis1: true, dis2: false
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      //history
      history:[],
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sorter: true,
          width: 100
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          scopedSlots: { customRender: 'avatar' },
          width: 100
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          width: 150
        },
        {
          title: '公众号',
          dataIndex: 'uniac',
          key: 'uniac',
          width: 150
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
          scopedSlots: { customRender: 'sex' },
          width: 100
        },
        {
          title: '省份',
          dataIndex: 'province',
          key: 'province',
          width: 100
        },
        {
          title: '城市',
          dataIndex: 'city',
          key: 'city',
          width: 100
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: 100
        },
        {
          title: '关注时间',
          dataIndex: 'created_time',
          key: 'created_time',
          sorter: true,
          width: 200
        },
        {
          title: '待结算返利',
          dataIndex: 'waitting_fee',
          key: 'waitting_fee',
          sorter: true,
          needTotal: true,
          width: 150,
          customRender: (text) => text + ' 元'
        },
        {
          title: '已结算返利',
          dataIndex: 'useable_fee',
          key: 'useable_fee',
          sorter: true,
          needTotal: true,
          width: 150,
          customRender: (text) => text + ' 元'
        },
        {
          title: '订单数',
          dataIndex: 'order_count',
          key: 'order_count',
          sorter: true,
          needTotal: true,
          width: 150
        },
        {
          title: '好友数量',
          dataIndex: 'friend_count',
          key: 'friend_count',
          sorter: true,
          needTotal: true,
          width: 150
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getFansList(Object.assign(parameter, this.filter_info))
          .then(res => {
            console.log(res)
            if(this.filter_info.download){
              if(res){
                 var str=res.replace(/\#/g, " ");
                str="用户"+str
                var url="data:text/csv;charset=utf-8,\ufeff"+str;
                var link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "粉丝报表" + ".csv");
                link.click();
              }
              delete this.filter_info.download
              return this.history
            }else{
              this.history=res.data
              return res.data
            }
          })
      },

      selectedRows: []
    }
  },
  created() {

  },
  methods: {
    download(){
      this.filter_info=this.canshu
     this.filter_info.download=1
     this.$refs.table.refresh()
    },
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    // 选择框
    handleselectChange(value) {
      if (value == '用户ID') {
        delete this.queryParam.username
        this.dis.dis1 = true
        this.dis.dis2 = false
      } else if (value == '昵称') {
        delete this.queryParam.uid
        this.dis.dis1 = false
        this.dis.dis2 = true
      }
    },
    onRadioChange(a,b,c) {
           const data = {
        pageSize: a.pageSize,
        page_no: a.current,
        order_key: c.field,
        order_method: c.order,
        goods_status: b.order_status_desc,
        ...this.filter_info
      }
      this.canshu=data
    }
  },
  computed: {
    ...mapGetters(['user_uniacs_list', 'uniac_id', 'uniac_name', 'refreshable']),
    filter_info() {
      const obj = {
        ...this.queryParam
      }
      if (obj.daterange2 != undefined) {
        if (typeof (obj.daterange2[0]) === 'object') {
          obj.daterange = [obj.daterange2[0].format('YYYY-MM-DD 00:00:00'), obj.daterange2[1].format('YYYY-MM-DD 23:59:59')]
        }
      }
      if (this.uniac_id) {
        obj.uniac_id = this.uniac_id
      }
      if (this.status||this.status===0) {
        obj.status = this.status
      }
      delete obj.daterange2
      return obj
    }
  },
  watch: {
    uniac_id(val1, val2) {
      if (val1 !== val2 && '/fans/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    },
    refreshable(val1, val2) {
      if (val1 && val1 !== val2&& '/fans/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    }
  }
}
</script>
<style >
.sd{
  flex-direction: row
}
</style>
