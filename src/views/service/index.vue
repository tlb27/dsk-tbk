<template>
  <a-card :bordered="false">
    <a-button class="mb15" type="primary" @click="addNew">
      新增
    </a-button>

    <a-table
      ref="table"
      size="default"
      :row-key="record=>record.id"
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :row-selection="null"
       @change="onchange"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">
            编辑
          </a>
        </template>
      </span>
      <div slot="avatar" slot-scope="text, record">
        <a-avatar shape="square" size="large" :src="text" />
      </div>
      <div slot="qrcode_url" slot-scope="text, record">
        <a-avatar shape="square" style="cursor:pointer" size="large" :src="text" @click="handlePreview(record)" />
      </div>
      <div slot="status_name" slot-scope="text,record">
        <a-tag v-if="record.status===2" color="red">
          {{ text }}
        </a-tag>
        <a-tag v-else-if="record.status===1" color="green">
          {{ text }}
        </a-tag>
        <a-tag v-else-if="record.status===0" color="orange">
          {{ text }}
        </a-tag>
      </div>
    </a-table>

    <!--二维码预览-->
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage">
    </a-modal>

    <!--新增/修改客服-->
    <a-modal
      :title="isEdit?'客服修改':'客服新增'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item
          label="状态"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-select
            v-decorator="[
              'status',
              {initialValue: formData.status }
            ]"
          >
            <a-select-option :value="0">
              暂停使用
            </a-select-option>
            <a-select-option :value="1">
              正在使用
            </a-select-option>
            <a-select-option :value="2">
              停止使用
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="客服类型"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-select
            v-decorator="[
              'is_robot',
              {initialValue: formData.is_robot }
            ]"
          >
            <a-select-option :value="0">
              人工客服
            </a-select-option>
            <a-select-option :value="1">
              机器人客服
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="客服名称"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-input
            v-decorator="[
              'nickname',
              {initialValue: formData.nickname ,rules:[{ required: true, message: '必须输入昵称!' }]}
            ]"
            name="nickname"
          />
        </a-form-item>
        <a-form-item
          label="好友数量"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-input-number
            v-decorator="[
              'user_count',
              {initialValue: formData.user_count}
            ]"
            name="user_count"
          />
        </a-form-item>
        <a-form-item
          label="客服头像"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-upload
            v-decorator="['icon', {
              valuePropName: 'icon',
              getValueFromEvent: normFile2,
            }]"
            name="icon"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :custom-request="customRequest"
            action="null"
          >
            <a-avatar v-if="iconUrl" :size="96" shape="square" :src="iconUrl" />
            <template v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </template>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="客服二维码"
          :label-col="{lg: {span: 7}, sm: {span: 7}}"
          :wrapper-col="{lg: {span: 17}, sm: {span: 17}}"
        >
          <a-upload
            v-decorator="['qrcode', {
              valuePropName: 'qrcode',
              getValueFromEvent: normFile,
            }]"
            name="qrcode"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :custom-request="customRequest"
            action="null"
          >
            <a-avatar v-if="qrcodeUrl" :size="96" shape="square" :src="qrcodeUrl" />
            <template v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </template>
          </a-upload>
        </a-form-item>
      </a-form>
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

import { getServiceList } from '@/api/manage'

  const pagination = {
    total: 100,
    current: 1,
    pageSize: 20,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50']
    //  console.log(current,size)
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
      previewTitle: '',
      previewImage: '',
      // 编辑/新增
      isEdit: false,
      visible: false,
      confirmLoading: false,
      formTitle: [
        {
          cn: '昵称',
          en: 'nickname',
          rules: [{ required: true, message: '必须输入昵称!' }]
        }
      ],
      formData: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客服ID',
          dataIndex: 'id',
          key: 'id',
          align:'center'
          // sorter: true
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          align:'center'
        },
        {
          title: '客服类型',
          dataIndex: 'type',
          key: 'type',
          align:'center'
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          scopedSlots: { customRender: 'avatar' },
          align:'center'
        },
        {
          title: '二维码',
          dataIndex: 'qrcode_url',
          key: 'qrcode_url',
          // sorter: true,
          scopedSlots: { customRender: 'qrcode_url' },
          align:'center'
        },
        {
          title: '绑定用户数',
          dataIndex: 'bind_count',
          key: 'bind_count',
          // sorter: true,
          scopedSlots: { customRender: 'bind_count' },
          align:'center'
        },
        {
          title: '好友数量',
          dataIndex: 'user_count',
          key: 'user_count',
          // sorter: true,
          scopedSlots: { customRender: 'user_count' },
          align:'center'
        },
        {
          title: '状态',
          dataIndex: 'status_name',
          key: 'status_name',
          scopedSlots: { customRender: 'status_name' },
          align:'center'
          // sorter: true
        },
        {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
          align:'center'
        }
      ],

      tableData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(parameter, this.queryParam)
        return getServiceList(Object.assign({}, this.queryParam))
          .then(res => {
            console.log(res.data)
            return res.data.data
          })
      },

      selectedRowKeys: [],
      selectedRows: [],

      qrcodeUrl: '',
      iconUrl: ''
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    onchange(a,b,c){
      console.log(a)
      var data = {
          page_size: a.pageSize,
          page_no: a.current,
        }
       getServiceList(data)
        .then(res => {
          this.pagination.total = res.data.data_count
          this.pagination.current = res.data.page_no
          this.tableData = res.data.data.map(item => {
            item.avatar = item.avatar + '?' + Math.random()
            item.qrcode_url = item.qrcode_url + '?' + Math.random()
            return item
          })
        })
    },
    getTableList() {
       var data = {
          page_size: this.pagination.pageSize,
          page_no: this.pagination.current,
        }
      getServiceList(data)
        .then(res => {
          this.pagination.total = res.data.data_count
          this.pagination.current = res.data.page_no
          this.tableData = res.data.data.map(item => {
            item.avatar = item.avatar + '?' + Math.random()
            item.qrcode_url = item.qrcode_url + '?' + Math.random()
            return item
          })
        })
    },
    customRequest(a, b, c) {
      console.log(a, b, c)
    },

    handleEdit(record) {
      this.qrcodeUrl = record.qrcode_url
      this.iconUrl = record.avatar
      this.formData = record

      this.isEdit = true
      this.visible = true
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (this.isEdit) {
            this.handleSubmit()
          } else {
            this.handleCreateSubmit()
          }
        }
      })
      return false
    },

    // 新增提交
    handleCreateSubmit() {
      const datas = this.form.getFieldsValue()
      const qrcode = datas.qrcode && datas.qrcode[0].originFileObj
      const icon = datas.icon && datas.icon[0].originFileObj
      const formData = new FormData()
      const url = '/custom-service/new?nickname=' + datas.nickname
      qrcode && formData.append('qrcode', qrcode)
      icon && formData.append('icon', icon)
      formData.append('nickname', datas.nickname)

      service.post(url, formData).then(res => {
        this.handleCancel()
        this.getTableList()
      })
    },

    // 编辑提交
    handleSubmit() {
      const datas = this.form.getFieldsValue()
      console.log(datas);
      const qrcode = datas.qrcode && datas.qrcode[0].originFileObj
      const icon = datas.icon && datas.icon[0].originFileObj
      const nickname = datas.nickname
      const status = datas.status
      const cs_id =  this.formData.id
      const user_count =  datas.user_count
      const is_robot =  datas.is_robot

      const formData = new FormData()

      qrcode && formData.append('qrcode', qrcode)
      icon && formData.append('icon', icon)
      nickname && formData.append('nickname', nickname)
      user_count && formData.append('user_count', user_count)
      formData.append('status', status)
      cs_id && formData.append('cs_id', cs_id)
      formData.append('is_robot', is_robot)

      service({
        url: '/custom-service/update',
        method: 'POST',
        data: formData
      }).then(res => {
        if (res.data.error === 3) {
          this.$message.error(res.data.msg)
        }else{
          this.$message.success(res.data.msg)
          this.handleCancel()
          this.getTableList()
        }

      })
    },
    handleCancel(e) {
      this.visible = false
      this.previewVisible = false
      this.formData = {}
      this.form.resetFields()

      this.previewImage = ''
      this.qrcodeUrl = ''
      this.iconUrl = ''
    },

    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      getBase64(e.file.originFileObj, (imageUrl) => {
        this.qrcodeUrl = imageUrl
      })
      return e && e.fileList
    },

    normFile2(e) {
      if (Array.isArray(e)) {
        return e
      }
      getBase64(e.file.originFileObj, (imageUrl) => {
        this.iconUrl = imageUrl
      })
      return e && e.fileList
    },

    handlePreview(record) {
      console.log(record)
      this.previewImage = record.qrcode_url
      this.previewTitle = record.nickname
      this.previewVisible = true
    },
    // 新增客服
    addNew() {
      this.isEdit = false
      this.visible = true
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
  }
}
</script>
<style>
  .text-align-left .ant-form-item-label {
    text-align: left;
  }
</style>
