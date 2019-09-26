<template>
  <a-card :bordered="false">
    <!--<div class="table-page-search-wrapper">-->
    <!--<a-form layout="inline">-->
    <!--<a-row :gutter="48">-->
    <!--<a-col :md="7" :sm="24">-->
    <!--<a-form-item label="用户ID搜索">-->
    <!--<a-input v-model="queryParam.aid" style="width: 100%" placeholder="输入用户ID可以精准该用户所有提现记录" />-->
    <!--</a-form-item>-->
    <!--</a-col>-->
    <!--<a-col :md="9" :sm="24">-->
    <!--<a-form-item label="提现时间">-->
    <!--<a-range-picker v-model="queryParam.date_range2"  style="width: 100%" />-->
    <!--</a-form-item>-->
    <!--</a-col>-->
    <!--<a-col :md="4">-->
    <!--<a-button type="primary" @click="$refs.table.refresh(true)">-->
    <!--查询-->
    <!--</a-button>-->
    <!--<a-button style="margin-left: 8px" @click="reset">-->
    <!--重置-->
    <!--</a-button>-->
    <!--</a-col>-->
    <!--</a-row>-->
    <!--</a-form>-->
    <!--</div>-->

    <s-table
      ref="table"
      size="default"
      align="center"
      :columns="columns"
      :data="loadData"
      :row-selection="null"
    >
      <!-- onChange: onSelectChange  -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a-button type="primary" size="small" @click="handleEdit(record)">
            修改
          </a-button>
          <a-button type="danger" class="ml5" size="small" @click="handleDel(record)">
            取消
          </a-button>
          <!-- <a-divider type="vertical" /> -->
        </template>
      </span>
      <div slot="content" slot-scope="text, record">
        <a-button @click="viewContent(text,record)">查看</a-button>
      </div>
      <div slot="condition" slot-scope="text,record">
        <p v-if="text.sex">性别: {{text.sex=='1'?'男':text.sex=='2'?'女':'不限'}}</p>
        <p v-if="text.order_number">下单数量: {{text.order_number}}</p>
      </div>

    </s-table>
    <a-modal
      title="消息内容"
      :visible="visible"
      @cancel="handleCancel"
      :footer="false"
    >
      <div v-if="contents.msg_type">消息类型: {{contents.msg_type}}</div>
      <div v-if="contents.descp">内容: {{contents.descp}}</div>
      <div v-if="contents.img">图片:
        <a-avatar shape="square" :src="contents.img"></a-avatar>
      </div>
      <div v-if="contents.title">标题: {{contents.title}}</div>
      <div v-if="contents.url">跳转链接: {{contents.url}}</div>
      <div class="csf">
        <span >推送人数:{{count_people.sent_count}}</span>
        <span >成功:{{count_people.succeed_count}}</span>
        <span >失败:{{count_people.fail_count}}</span>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import {mapGetters} from 'vuex'
  import moment from 'moment'

  import {getsentHistoryList} from '@/api/manage'


  export default {
    name: 'history',
    components: {
      STable
    },
    data() {
      const startDate = moment().month(moment().month() - 1).startOf('month');
      const endDate = moment().month(moment().month() - 1).endOf('month');
      return {
        visible: false,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 12}
        },
        form: null,

        // 查询参数
        queryParam: {date_range2: [startDate, endDate]},
        // 表头
        columns: [
          {
            title: '任务id',
            dataIndex: 'msg_id',
            align: 'center',
            // sorter: true
          },
          {
            title: '任务名称',
            dataIndex: 'task_name',
            align: 'center',
            // sorter: true
          },
          {
            title: '消息类型',
            dataIndex: 'msg_type1',
            align: 'center',
            // sorter: true
          },
          {
            title: '推送的公众号',
            dataIndex: 'uniac2',
          },
          {
            title: '推送状态',
            dataIndex: 'status',
            customRender: (text) => {
              switch (text) {
                case 0:
                  return '未开始';
                case 1:
                  return '进行中';
                case 2:
                  return '推送成功';
                case 3:
                  return '推送取消';
                case 4:
                  return '推送失败';
              }
            }

          },
          {
            title: '创建推送时间',
            dataIndex: 'create_time',
          },
          {
            title: '开始推送时间',
            dataIndex: 'start_time',
          },
          {
            title: '结束推送时间',
            dataIndex: 'reuslt_time',
          },
          {
            title: '推送内容',
            dataIndex: 'content',
            scopedSlots: {customRender: 'content'}
          },
          {
            title: '筛选条件',
            dataIndex: 'condition',
            scopedSlots: {customRender: 'condition'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: {customRender: 'action'}
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log(parameter);
          console.log(parameter, 'parameter');
          const filter_info = {...this.queryParam}
          delete filter_info.date_range2
          return getsentHistoryList(Object.assign(parameter, filter_info))
          // return getsentHistoryList()
            .then(res => {
              console.log(res);
              const arr = res.task_list.map(item => {
                const content = item.content.content
                switch (content.msg_type) {
                  case 0:
                    content.msg_type1 = '图文消息';
                    break;
                  case 1:
                    content.msg_type1 = '文字消息';
                    break;
                  case 2:
                    content.msg_type1 = '图片消息';
                    break;
                  case 3:
                    content.msg_type1 = '模板消息';
                    break;
                  default:
                    content.msg_type = '';
                    break;
                }
                const obj = {...item, ...item.content, ...item.content.content}
                if (typeof obj.condition.uniac_id === 'number') {
                  obj.condition.uniac_id = [obj.condition.uniac_id]
                }
                obj.uniac2 = obj.condition.uniac_id && obj.condition.uniac_id.map(item => {
                  for (let key of this.user_uniacs_list) {
                    if (key.uniac_id === item) {
                      return key.uniac_name
                    }
                  }
                }).join(',') || ''

                return obj
              })
              const obj = {
                item_count: res.data_count,
                page_count: res.page_count,
                page_no: parseInt(res.page_no),
                page_size: res.page_size,
                data: arr
              }
              return obj
            })
        },

        contents: {},
        count_people:{}
      }
    },
    computed: {
      ...mapGetters([
        'refreshable',
        'user_uniacs_list'
      ])
    },
    watch: {
      refreshable(val1, val2) {
        if (val1 && val1 !== val2 && '/reward/list' === this.$router.history.current.fullPath) {
          this.$refs.table.refresh()
        }
      }
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.$refs.table.refresh()
      },
      viewContent(text,record) {
        console.log(text,record);
        this.contents = text
        this.count_people={
          sent_count:record.sent_count,
          succeed_count:record.succeed_count,
          fail_count:record.fail_count
        }
        this.visible = true
      },
      handleCancel() {
        this.visible = false
        this.contents = {}
      },
      handleEdit(record) {
        const data = { task_edit: 1,msg_id:record.msg_id}
        this.axios.post('/kfmsg/sent-history',data)
          .then(res=>{
            if (res.error) {
              this.$message.error(res.msg||'操作失败, 请重试')
            }else{
              let name = record.msg_type===3?'notification.template':'notification.deal_notification'
              this.$router.push({
                name: name,
                query: {
                  msg_id: record.msg_id,
                  details:JSON.stringify(res.data[0]||record)
                }
              })
            }
          })
        // console.log(record)

      },
      handleDel(record) {
        console.log(record)
        const data = { task_del: 1,msg_id:record.msg_id}
        this.axios.post('/kfmsg/sent-history',data)
          .then(res=>{
            console.log(res);
            if (res.error) {
              this.$message.error(res.msg||'操作失败')
            }else{
              this.$message.success(res.msg||'操作成功')
            }
            this.$refs.table.refresh()
          })
      },
    }
  }
</script>
<style scoped>
.csf{
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-direction: row;
  padding: 5px;
}
  .ml30 {
    margin-left: 30px;
  }

  .ml5 {
    margin-left: 5px;
  }
</style>
