<template>
  <a-card :bordered="false">
    <a-button class="mb15" type="primary" @click="addNew">
      新增
    </a-button>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="16" :sm="24">
            <a-form-item label="位置">
               <a-select
            mode="multiple"
            v-model="queryParam.uniac_list"
            placeholder="公众号"
            @change="handleChange"
            style="width: 100%"
          >
            <a-select-option
              v-for="(p,i) in all_uniacs_list"
              :key="i"
              :value="p.uniac_id"
            >{{p.uniac_name}}</a-select-option>
          </a-select>
            </a-form-item>
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
      :row-key="record=>record.banner_id"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
       @change="onchange"
    >
    <div slot="img" slot-scope="text, record">
      <a-avatar shape="square" style="cursor:pointer" :size="80" :src="text" />
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
        </template>
      </span>
    </s-table>

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
import { getIcon } from '@/api/manage'
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
          title: 'IconID',
          dataIndex: 'id',
          key: 'id',
          align:'center'
          // sorter: true
        },
        {
          title:"标题",
          dataIndex:'title',
          key:'title',
          align:'center'
        },
        {
          title: '图片',
          dataIndex: 'img',
          key: 'img',
          scopedSlots: { customRender: 'img' },
          align:'center'
          // sorter: true
        },
       
        {
          title: '跳转链接',
          dataIndex: 'url',
          key: 'redirect_url',
          align:'center'
        },
        {
          title: "位置",
          dataIndex: 'seat',
          key: 'seat',
          align:'center',
          scopedSlots: { customRender: "seat" },
           filters: [
            {
              text: "1",
              value: "1"
            },
            {
              text: "2",
              value: "2"
            },
            {
              text: "3",
              value:"3"
            },
            {
              text: "4",
              value:"4"
            }
          ]
        },
      
        {
          title: '针对公众号',
          dataIndex: 'uniac_name',
          key: 'uniac_name',
          // scopedSlots: { customRender: 'uniac_id' },
          align:'center'
        },
        {
          title: '浏览量',
          dataIndex: 'click_num',
          key: 'click_num',
          align:'center'
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
        console.log(this.queryParam)
        if(parameter.seat){
          parameter.seat=parameter.seat.join(",")
        }
        if(this.queryParam.uniac_list){
         this.queryParam.uniac_id=this.queryParam.uniac_list.join(",")
        }
        return  getIcon(Object.assign(parameter, this.queryParam))
          .then(res => {
            for(var p of res.data){
              for(var item of this.all_uniacs_list){
                if(p.uniac_id==item.uniac_id){
                  p.uniac_name=item.uniac_name
                }
              }
                // if(first=!p){
                //   first=p
                // }
                // if(p.seat==1&&p.title==first.title){
                //  first.uniac_id=uniac_id.push(p.uniac_id).join(",")
                //   first.id=id.push(p.id).join(",")
                //    first.uniac_name=uniac_name.push(p.uniac_name).join(",")
                // }
            }
            console.log(this.all_uniacs_list)
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
    console.log(this.all_uniacs_list)
  },
    computed: {
    ...mapGetters(['all_uniacs_list','user_uniacs_list'])
  },
  methods: {
      reset() {
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleChange(){},
    handlePreview(record) {
      this.previewImage = record.img
      this.previewVisible = true
    },
    onchange(a,b,c){
     
    },
   
    remove(record){
      this.axios.post("/admin/icon-del",{icon_id:record.id}).then(res=>{
         if(res.error==0){
               this.$notification.success({
                message: "success",
                description: `删除成功`
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
      // console.log(record.uniac_list)
        this.$router.push({
        name: 'icon.edit',
        query:{icon_id:record.id,uniac_id:record.uniac_id,uniac_name:record.uniac_name}
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
    // 新增客服
    addNew() {
      this.$router.push({
        name: 'icon.edit'
        
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
