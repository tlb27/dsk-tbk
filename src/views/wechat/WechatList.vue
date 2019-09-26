<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-row type="flex" justify="end" class="mb24">
        <a-button
          style="background-color: #51aa38; border-color: #51aa38;"
          type="primary"
          icon="wechat"
          @click="toshouquan"
         
        >
          添加公众号
        </a-button>
      </a-row>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">
            配置
          </a>
          <!-- <a-divider type="vertical" /> -->
        </template>
      </span>
      <div slot="avatar" slot-scope="text, record">
        <a-avatar shape="square" size="large" :src="text" />
      </div>
      <div slot="model_name" slot-scope="text, record">
        <a @click="handleModifyModel(record)">
          {{ text }}
        </a>
      </div>
      <div slot="input" slot-scope="text,record">
        <a-tag color="red">
          <a v-if="text==null" @click="handleModifyModel2(record)" style="color:#ffa39e">
            未设置
          </a>
           <a v-else-if="text==0" @click="handleModifyModel2(record)" style="color:#ffa39e">
            未设置
          </a>
          <a v-else @click="handleModifyModel2(record)" style="color:#ffa39e">
            {{ text }}
          </a>
        </a-tag>
      </div>
      <div slot="output" slot-scope="text,record">
        <a-tag color="green">
          {{ text }}
        </a-tag>
      </div>
    </s-table>
    
    <a-modal
      title="修改模式"
      :visible="visible2"
      :confirm-loading="confirmLoading"
      @ok="submitnumber"
      @cancel="handleCancel2"
    >
      <a-input type="number"  placeholder="请设置投入的金额" v-model="modeltouru" style="display:flex;justify-content: center"  />
    </a-modal>
    <a-modal
      title="修改模式"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-radio-group v-model="model" style="display:flex;justify-content: center" :options="radioOptions" />
    </a-modal>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

import { getWechatList } from '@/api/manage'
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

      model: '',
      modeltouru:'',
      id: 0,
      radioOptions: [
        {
          label: '返利模式',
          value: 0
        },
        {
          label: '纯客服模式',
          value: 1
        }
      ],
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
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '头像',
          dataIndex: 'icon',
          key: 'icon',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '粉丝数',
          dataIndex: 'user_count',
          key: 'user_count'
          // sorter: true,
        },
        {
          title: '模式',
          dataIndex: 'model_name',
          key: 'model_name',
          scopedSlots: { customRender: 'model_name' }
          // sorter: true,
        },
        {
          title: '投入（元）',
          dataIndex: 'input',
          key: 'input',
          // sorter: true,
          scopedSlots: { customRender: 'input' }
        },
        {
          title: '产出（元）',
          dataIndex: 'output',
          key: 'output',
          // sorter: true,
          scopedSlots: { customRender: 'output' }
        },
        {
          title: '接入时间',
          dataIndex: 'create_time',
          key: 'create_time'
          // sorter: true
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
        return getWechatList({ ...parameter, ...this.filter_info })
          .then(res => {
            console.log(res);
            if (!res.data) {
              this.$message.error(res.msg)
              return []
            }
            return res
          })
      },
      uid:"",
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() { 
    this.getInfo().then(res=>{
      this.uid=res.id
    })
  },
  methods: {
    getInfo,
    submitnumber(e){
       this.confirmLoading = true
        const data = {
        "uniac_id": this.id,
        "input":this.modeltouru
      }
      this.$post('/admin/uniac/update',data).then(res=>{
        console.log(res)
      if (res.error === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg || '保存失败')
          }
          this.visible2 = false
          this.confirmLoading = false
          this.$refs.table.refresh()
          this.modeltouru = ''
        })
        .catch(err => {
          this.$message.error(err.msg || '保存失败')
          this.visible2 = false
          this.confirmLoading = false
          this.modeltouru = ''
        })
    },
    handleEdit(record) {
      this.$router.push({
        name: 'wechat.edit',
        query: { id: record.id }
      })
    },
    handleModifyModel(record) {
      this.id = record.id
      this.model = record.model
      this.visible = true
    },
     handleModifyModel2(record) {
      this.id = record.id
      this.model = record.modeltouru
      this.visible2 = true
    },
    handleOk(e) {
      this.confirmLoading = true
      const data = {
        uniac_id: this.id,
        model: this.model
      }

      this.$post('/uniac/update', data)
        .then(res => {
          if (res.error === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg || '保存失败')
          }
          this.visible = false
          this.confirmLoading = false
          this.$refs.table.refresh()
          this.model = ''
        })
        .catch(err => {
          this.$message.error(err.msg || '保存失败')
          this.visible = false
          this.confirmLoading = false
          this.model = ''
        })
    },
    toshouquan(){
      window.location.href="http://wechat.morejoying.com/wechat/authorize/auth-landing?uid="+this.uid
    },
    handleCancel(e) {
      this.model = ''
      this.visible = false
    },
     handleCancel2(e) {
      this.modeltouru = ''
      this.visible2 = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  },
  computed: {
    ...mapGetters(['user_uniacs_list', 'uniac_id', 'uniac_name','refreshable']),
    filter_info() {
      const obj = {
        ...this.queryParam,
        uniac_id: this.uniac_id
      }
      delete obj.date_range2
      for (const key in obj) {
        if ((!obj[key] && obj[key] !== 0 && obj[key] !== '0') || (Array.isArray(obj[key]) && obj[key].length === 0)) {
          delete obj[key]
          continue
        }
        if (key === 'uid') {
          obj.uid = Number(obj.uid)
        }
      }
      return obj
    }
  },
  watch: {
    uniac_id(val1, val2) {
      if (val1 !== val2 && '/wechat/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    },
    refreshable(val1, val2) {
      if (val1 && val1 !== val2&& '/wechat/list' === this.$router.history.current.fullPath) {
        this.$refs.table.refresh()
      }
    }
  }
}
</script>
<style>
  .mb24{
    margin-bottom: 24px;
  }
</style>
