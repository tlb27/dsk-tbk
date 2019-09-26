<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="域名">
              <a-input v-model="queryParam.domin" placeholder="请输入域名" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">
                查询
              </a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">
                重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="{ show: true, clear: () => { this.selectedRowKeys = [] } }"
      :row-selection="{ selectedRowKeys: selectedRowKeys}"
    >
      <div slot="type" slot-scope="text,record">
        <div v-if="text == 1">
          <a-tag color="cyan">
            回调域名
          </a-tag>
        </div>
        <div v-else>
          <a-tag color="purple">
            普通域名
          </a-tag>
        </div>
      </div>
      <div slot="status" slot-scope="text,record">
        <div v-if="text == 1">
          <a-tag color="green">
            启用
          </a-tag>
        </div>
        <div v-else>
          <a-tag color="red">
            失效
          </a-tag>
        </div>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">
          编辑
        </a>
      </span>
    </s-table>

    <a-modal
      v-model="visible"
      title="操作"
      :width="800"
      @ok="handleOk"
    >
      <a-form :auto-form-create="(form)=>{this.form = form}">
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="ID"
          has-feedback
        >
          <a-input id="id" v-model="mdl.id" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="域名"
          has-feedback
          :required="true"
        >
          <a-input id="domin" v-model="mdl.domin" placeholder="请输入域名" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="类型"
          has-feedback
          :required="true"
        >
          <a-select v-model="mdl.type">
            <a-select-option value="1">
              回调域名
            </a-select-option>
            <a-select-option value="2">
              普通域名
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="状态"
          has-feedback
          :required="true"
        >
          <a-select v-model="mdl.status">
            <a-select-option value="1">
              启用
            </a-select-option>
            <a-select-option value="0">
              失效
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import STable from '@/components/table/'

import { getDomainList } from '@/api/manage'

export default {
  name: 'DomainList',
  components: {
    STable
  },
  filters: {
  },
  data() {
    return {
      description: '',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sorter: true
        },
        {
          title: '域名',
          dataIndex: 'domin',
          key: 'domin'
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDomainList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  watch: {
    /*
    'selectedRows': function (selectedRows) {
      this.needTotalList = this.needTotalList.map(item => {
        return {
          ...item,
          total: selectedRows.reduce( (sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
    }
    */
  },
  created() {
  },
  methods: {
    resetSearchForm() {
      this.queryParam = { }
    },
    handleEdit(record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk() {

    },
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    }
  }
}
</script>
