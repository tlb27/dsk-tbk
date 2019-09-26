<template>
  <a-card :bordered="false" >
    <div class="table-page-search-wrapper">
      <a-row type="flex" justify="end" class="mb24">
        <a-button
         style="background-color:rgb(247, 108, 17); border-color: rgb(247, 108, 17);"
          type="primary"
          icon="taobao-circle"
          @click="toshouquan(1)"
         
        >
          授权接入
        </a-button>
      </a-row>
    </div>  

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      v-bind:data="loadData"
      :row-selection="null"
    >
    <div slot="staus" slot-scope="text, record">
        <span v-if="text=='0'">不可用</span>
        <span v-else-if="text=='1'">已启用</span>
    </div>
    <div slot="action" slot-scope="text,record">
        <a @click="toshouquan(2)" class="ant-dropdown-link" >
          重新授权
        </a>
    </div>
    </s-table>
    
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

import { getTaobaoList ,getWechatList} from '@/api/manage'
import { getInfo } from '@/api/login'


export default {
  name: 'WechatList',
  components: {
    AInput,
    ATextarea,
    STable
  },
  data() {
    return {
      visible: false,
      visible2: false,

      confirmLoading: false,
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

      
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {  },
      // 表头
      columns: [
          {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
          // sorter: true
        },
           {
          title: '用户名',
          dataIndex: 'user_nick',
          key: 'user_nick'
          // sorter: true
        },
      
        {
          title: '默认pid',
          dataIndex: 'default_pid',
          key: 'default_pid'
        },
        {
          title: '网站ID',
          dataIndex: 'default_site_id',
          key: 'default_site_id',
          // sorter: true,
        },
        {
          title: '阿里妈妈账户ID',
          dataIndex: 'mama_aacount',
          key: 'mama_aacount',
          // sorter: true,
        },
        {
          title: '阿里妈妈主账户ID',
          dataIndex: 'main_account',
          key: 'main_account',
          // sorter: true,
        },
         {
          title: '账号状态',
          dataIndex: 'staus',
          key: 'staus',
          // sorter: true,
           scopedSlots: { customRender: 'staus' }
        },
        {
          title: '授权到期过期时间',
          dataIndex: 've_ext_time',
          key: 've_ext_time',
        },
      {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],

      tableData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getTaobaoList({ ...parameter, ...this.filter_info })
         .then(res => {
            console.log(res);
            var result={}
            result.msg=res.msg
            result.error=res.error
            result.data=res.data.admin_info
            console.log(result)
              return  result
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() { 
    // this.getInfo().then(res=>{
    //   this.uid=res.id
    // })
  },
  methods: {
    toshouquan(i){
        this.axios.get("/tbk/autho-url?token="+this.token+"&autho_type="+i).then(res=>{
            console.log(res)
            if(res.error==0){
                  window.open(res.data.autho_url, '_blank').location;
            }
        })
    //   window.location.href="http://wechat.morejoying.com/wechat/authorize/auth-landing?uid="+this.uid
    },
    
  },
  computed: {
    ...mapGetters(['user_uniacs_list', 'uniac_id', 'uniac_name','refreshable','token']),
  },
  watch: {
    uniac_id(val1, val2) {
      if (val1 !== val2 && '/taobao/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    },
    refreshable(val1, val2) {
      if (val1 && val1 !== val2&& '/taobao/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    }
  }
}
</script>
<style scoped>
  .mb24{
    margin-bottom: 24px;
  }
</style>
