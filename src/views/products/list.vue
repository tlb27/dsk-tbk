<template>
  <a-card :bordered="false">
    <a-button class="mb15" type="primary" @click="addNew">
      新增
    </a-button>

    <s-table
      ref="table"
      size="default"
      :row-key="record=>record.id"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
       @change="onchange"
    >
    <span slot="action" slot-scope="text, record">
        <template>
          <a-button type="primary" size="small" @click="handleGorw(record)">
            推广
          </a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" @click="handleEdit(record)">
            修改
          </a-button>
         
          <!-- <a-divider type="vertical" /> -->
        </template>
      </span>
    </s-table>

  </a-card>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

import service from '@/utils/fileRequest'
import { mapGetters } from 'vuex'

import STable from '@/components/table/'
import vForm from '@/components/form'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'

import { getSelectionList } from '@/api/manage'

  const pagination = {
    total: 100,
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50']
  }
export default {
  name: 'Service',
  components: {
    AInput,
    ATextarea,
    STable,
    vForm
  },
  computed: {
    ...mapGetters(['token'])
  },
  data() {
    return {
      form: this.$form.createForm(this),
      mdl: {},
      pagination:pagination,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 图片预览
      previewVisible: false,
      // 编辑/新增
      
      lianjie:"",
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '主题ID',
          dataIndex: 'id',
          key: 'id',
          align:'center'
          // sorter: true
        },
          {
          title: '主题类型',
          dataIndex: 'theme_type',
          key: 'theme_type',
          align:'center'
          // sorter: true
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          align:'center'
          // sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time',
          align:'center'
        },
         {
          title: '更改时间',
          dataIndex: 'modified_time',
          key: 'modified_time',
          align:'center'
        },
        {
          title: '商品数',
          dataIndex: 'product_count',
          key: 'product_count',
          align:'center'
        },
        {
          title: '订单数',
          dataIndex: 'order_count',
          key: 'order_count',
          align:'center'
        },
        {
          title: '浏览量',
          dataIndex: 'theme_view',
          key: 'theme_view',
          align:'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
          align:'center'
        }
      ],

      tableData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return  getSelectionList(parameter)
          .then(res => {
            for(var p of res.data){
              var c=eval(  p.goods_data )
              p.product_count=c.length
              if(p.title=="null"){
                p.title=""
              }else{
                if(p.title.length>30){
                  p.title=p.title.slice(0, 30) + '...'
                }
              } 
              
            }

            res.item_count= res.total_count.data_count,
            res.page_count= res.total_count.page_count,
            res.page_no=res.total_count.page_no,
            res.page_size= res.total_count.page_size

            return res
          })
      },

      selectedRowKeys: [],
      selectedRows: [],
      
    }
  },
  created() {

  },
  methods: {
    onchange(a,b,c){
     
    },
    copylianjie(){
       var lianjie = document.getElementsByClassName("copy");
        lianjie[0].select();
        document.execCommand("Copy");
    },
    handleGorw(record){
        this.$router.push({name:"products.recommend",query:{theme_id:record.id,theme_type:record.theme_type}})
    },
    customRequest(a, b, c) {
    },

    handleEdit(record) {
        this.$router.push({
        name: 'products.edit',
        query:{theme_id:record.id,theme_type:record.theme_type}
      })
    },
    handleCancel(e) {
      this.previewVisible = false
    },
    // 新增客服
    addNew() {
      this.$router.push({
        name: 'products.edit'
      })
    },

  }
}
</script>
<style>
  .text-align-left .ant-form-item-label {
    text-align: left;
  }
  .input_kuang{
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .in_right{
    width:80%;
    height: 100%;
  }
  .in_left{
    width: 20%;
    height: 100%;
  }
  .modal_in{
    width: 100%;
    height: 100%;
    border-radius: 0;

  }
</style>
