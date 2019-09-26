<template>
  <a-card :bordered="false">
    <a-button class="mb15" type="primary" @click="addNew">
      新增
    </a-button>

    <s-table
      ref="table"
      size="default"
      :row-key="record=>record.banner_id"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
       @change="onchange"
    >
    <div slot="goods_img" slot-scope="text, record">
      <a-avatar shape="square" style="cursor:pointer" size="large" :src="text" @click="handlePreview(record)" />
    </div>
    <div slot="name_list" slot-scope="text, record">
      <a-button @click="viewContent(text,record)">查看</a-button>
    </div>
    <span slot="action" slot-scope="text, record">
        <template>
          <a-button type="primary" size="small" @click="remove(record)">
            删除
          </a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" @click="handleEdit(record)">
            修改
          </a-button>
         
          <!-- <a-divider type="vertical" /> -->
        </template>
      </span>
    </s-table>
    <a-modal :visible="previewVisible"  :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage">
    </a-modal>
    <a-modal :visible="show_name" title="针对公众号"  :footer="null" @cancel="handleCancel">
        <div v-if="name_list">{{name_list}}</div> 
        <div v-else>未设置公众号</div>     
    </a-modal>
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
import { getTop10 } from '@/api/manage'
import { constants } from 'crypto';

export default {
  name: 'Service',
  components: {
    AInput,
    ATextarea,
    STable,
    vForm
  },
  data() {
    return {
      form: this.$form.createForm(this),
      mdl: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 图片预览
      previewVisible: false,
      // 编辑/新增
      show_name:false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      name_list:"",
      // 表头
      columns: [
        {
          title: 'TopID',
          dataIndex: 'id',
          key: 'id',
          align:'center'
          // sorter: true
        },
        {
          title: '图片',
          dataIndex: 'goods_img',
          key: 'goods_img',
          scopedSlots: { customRender: 'goods_img' },
          align:'center'
          // sorter: true
        },
       
        {
          title: '销量',
          dataIndex: 'volume',
          key: 'volume',
          align:'center'
        },
         {
          title: '商品ID',
          dataIndex: 'goods_id',
          key: 'goods_id',
          align:'center'
        },
        {
          title: '权重大小',
          dataIndex: 'top_seat',
          key: 'top_seat',
          align:'center'
        },
        // {
        //   title: '针对公众号',
        //   dataIndex: 'name_list',
        //   key: 'name_list',
        //   scopedSlots: { customRender: 'name_list' },
        //   align:'center'
        // },
        // {
        //   title: '浏览量',
        //   dataIndex: 'click_num',
        //   key: 'click_num',
        //   align:'center'
        // },
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
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
          align:'center'
        }
      ],
      previewImage:"",
      tableData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return  getTop10(parameter)
          .then(res => {
            console.log(res)
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
    computed: {
    ...mapGetters(['user_uniacs_list'])
  },
  methods: {
    handlePreview(record) {
      this.previewImage = record.goods_img
      this.previewVisible = true
    },
    onchange(a,b,c){
     
    },
   
    remove(record){
      this.axios.post("/admin/top-del",{top_id:record.id}).then(res=>{
         if(res.error==0){
               this.$notification.success({
                message: "success",
                description: res.msg,
              });
              this.$refs.table.refresh()
             }else{
              this.$notification["error"]({
                  message: "错误",
                  description: res.msg,
                  duration: 4
              });
             }
      })
    },
    customRequest(a, b, c) {
    },

    handleEdit(record) {
        this.$router.push({
        name: 'top.edit',
        query:{top_id:record.id}
      })
    },
     viewContent(text,record) {
        console.log(text,record);
        this.name_list = record.name_list
        console.log(this.name_list)
        this.show_name = true
      },
    handleCancel(e) {
      this.previewVisible = false
       this.show_name = false
    },
    // 新增top商品
    addNew() {
      this.$router.push({
        name: 'top.edit'
        
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
