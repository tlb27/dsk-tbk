<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="7" :sm="24">
            <a-form-item label="平台">
              <a-select
                v-model="queryParam.platform"
                v-decorator="[
                  'type'
                ]"
                :allow-clear="true"
                placeholder="请选择选平台"
                @change="handleselectChange"
              >
                <a-select-option v-for="(item, i) in platform" :key="i" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <!-- <a-input v-model="queryParam.uniacid_name" style="width: 100%" placeholder="请输入用户昵称"/> -->
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item label="关注时间">
              <a-range-picker
                v-model="queryParam.date2"
                :allowClear="false"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{span:6}" :sm="24">
            <a-checkbox @change="change('ignore_platform')" :checked="ignore_platform">忽略平台</a-checkbox>
            <a-checkbox @change="change('ignore_uniac')" :checked="ignore_uniac">忽略公众号</a-checkbox>
            <a-checkbox @change="change('ignore_pure')" :checked="ignore_pure">扣除技术服务费</a-checkbox>
          </a-col>
          <a-col :md="{span:4}" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">
              查询
            </a-button>
            <a-button style="margin-left: 8px" @click="reset">
              重置
            </a-button>
          </a-col>
        </a-row>
        <a-row :gutter="24">
           <a-col :md="24" :sm="24">
            <a-form-item label="显示项">
                 <a-checkbox @change="change1('failed_count')" :checked="failed_count">失败订单数</a-checkbox>
            <a-checkbox @change="change1('bind_order_count')" :checked="bind_order_count">绑定订单数</a-checkbox>
            <a-checkbox @change="change1('ordered_users')" :checked="ordered_users">下单粉丝</a-checkbox>
            <a-checkbox @change="change1('total_ordered_users')" :checked="total_ordered_users">累计已下单粉丝</a-checkbox>
            <a-checkbox @change="change1('total_reordered_users')" :checked="total_reordered_users">累计复购粉丝</a-checkbox>
            
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
        <template slot="title">
          <div class="titleflex">
            <span class="bold">合计项:</span>
            <span class="bold" v-if="!ignore_uniac">无</span>
            <span class="bold" v-if="!ignore_platform">无</span>
            <span class="bold" >{{general.order_count||0}}</span>
            <span class="bold" v-if="failed_count">{{general.failed_count||0}}</span>
            <span class="bold" v-if="bind_order_count">{{ general.bind_order_count||0 }}</span>
            <span class="bold" >{{general.earning_pre_count||0 }}</span>
            <span class="bold" >{{general.paied_fee||0}}元</span>
            <span class="bold" >{{general.pay_pre_fee||0 }}元</span>
            <span class="bold">{{ general.reward_fee||0 }}元</span>
            <span class="bold">{{ general.pure_earning_fee||0 }}元</span><!--收益预估-->
            <span class="bold" >{{ general.earning_pre_fee||0 }}元</span>
            <span class="bold" v-if="ordered_users">{{ general.ordered_users||0 }}</span>
            <span class="bold">{{ general.first_order_users||0 }}</span>
            <span class="bold">{{ general.reordered_users||0 }}</span>
            <span class="bold" v-if="total_ordered_users">无</span>
            <span class="bold" v-if="total_reordered_users">无</span>
          </div>
        </template>
      <!-- <div slot="avatar" slot-scope="text, record">
        <a-avatar shape="square" size="large" :src="text" />
      </div> -->
      
    </s-table>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import moment from 'moment'
  import {getDigitalReport} from '@/api/manage'
  import {mapActions, mapGetters} from 'vuex'
import { constants } from 'crypto';

  const defaultDate = [moment().subtract(30, 'days'), moment()]
  export default {
    name: 'digitalList',
    components: {
      STable
    },
    data() {

      return {
        //  userInfo:[],
        visible: false,
        platform: [{name: '淘宝', value: 0}, {name: '拼多多', value: 1}],
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 12}
        },
        general: {},
        form: null,
        ignore_platform: true,
        ignore_uniac: false,
        failed_count:false,//失败订单数
        bind_order_count:false,//绑定订单数
        ordered_users:false,//下单粉丝
        total_ordered_users:false,//累计已下单粉丝
        total_reordered_users:false,//累计复购粉丝
        ignore_pure:false,
        mdl: {},
        type: '用户ID',
        dis: {
          dis1: true, dis2: false
        },
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {date2: defaultDate},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          if (parameter.page_size == undefined) {
            parameter.page_size = 10
          }
          return getDigitalReport(Object.assign(parameter, this.filter_info))
            .then(res => {
              if (res.data) {
                for (const p of res.data) {
                  for (const u of this.user_uniacs_list) {
                    if (p.uniacid == u.uniac_id) {
                      p.uniacid = u.uniac_name
                    }
                  }
                }
                const tables = {
                  data: res.data,
                  item_count: res.total_count.data_count,
                  page_count: res.total_count.page_count,
                  page_no: parseInt(res.total_count.page_no),
                  page_size: res.total_count.page_size
                }
                  this.$refs.table.localDataSource=res.data
                this.general = res.total_count.total_list
                return tables
              }else{
                this.$message.error(res.msg||'获取数据失败,请联系管理员')
              }
            })
            .catch(err => {
              console.log(err);
            })
        },

        selectedRows: []
      }
    },
    mounted() {
    },
    updated(){
     
    },
    methods: {
      getwidth(){
         var th=document.getElementsByClassName("ant-table-align-center")
         var span=document.getElementsByClassName("bold")
         console.log(th)
         for(var i=0;i<th.length;i++){
              span[i].style.width=th[i].clientWidth+"px"
          }
      },
      reset() {
        this.queryParam = {date2: defaultDate}
        this.ignore_platform = true
        this.ignore_uniac = false
        this.$refs.table.refresh()
      },
      // 选择框
      handleselectChange(value) {
        if (value == '用户ID') {
          this.dis.dis1 = true
          this.dis.dis2 = false
        } else if (value == '昵称') {
          this.dis.dis1 = false
          this.dis.dis2 = true
        }
      },
      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      change(key) {
        this[key] = !this[key]
        this.$refs.table.refresh()
      },
       change1(key) {
        this[key] = !this[key]
          this.getwidth()
      },
    },
    computed: {
      ...mapGetters(['user_uniacs_list', 'uniac_id', 'uniac_name', 'refreshable']),
      filter_info() {
        if (this.queryParam.date2 != undefined) {
          if (this.queryParam.date2.indexOf('~') == -1 && this.queryParam.date2 != '') {
            this.queryParam.date = this.queryParam.date2[0].format('YYYY-MM-DD') + '~' + this.queryParam.date2[1].format('YYYY-MM-DD')
          }
        }
        const obj = {
          ...this.queryParam,
          uniac_id: this.uniac_id
        }
        if (this.ignore_platform) {
          obj.ignore_platform = this.ignore_platform
          delete obj.platform
        }
        if (this.ignore_uniac) {
          obj.ignore_uniac = this.ignore_uniac
          delete obj.uniac_id
        }
        if (this.ignore_pure) {
          obj.ignore_pure = this.ignore_pure
        }
        delete obj.date2
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
      },
      // 表头
      columns() {
        const arr = [
          {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            //  fixed: 'left',
            //  width: 150
          },
          {
            title: '公众号',
            dataIndex: 'uniacid',
            //  fixed: 'left',
            key: 'uniacid',
            //  width: 150

          },
          {
            title: '平台',
            dataIndex: 'platform',
            //  fixed: 'left',
            key: 'platform',
            customRender: (text) => {
              if (text === 1) {
                return '拼多多'
              } else if (text === 0) {
                return '淘宝'
              } else {
                return ''
              }
            }
          },
         
          {
            title: '订单数量',
            dataIndex: 'order_count',
            key: 'order_count',
            // slots: { title: 'customTitle' },
            needTotal: true,
            sorter: true,
          },
           {
            title:"失败订单数",
            dataIndex:"failed_count",
            key:"failed_count",
            // width:120,
          },
            {
            title: '绑定订单数量',
            dataIndex: 'bind_order_count',
            key: 'bind_order_count',
            needTotal: true,
            sorter: true,
            //  width: 120
          },
            {
            title: '结算订单数',
            dataIndex: 'settled_count',
            key: 'settled_count',
            // width:120,
            sorter: true
            //   scopedSlots: { customRender: 'avatar' },
          },
             {
            title:"GMV",
            dataIndex:"paied_fee",
            key:"paied_fee",
             customRender: (text) => text + ' 元'
            // width:120,
          },
          {
            title: '佣金收入',
            dataIndex: 'pay_pre_fee',
            //  fixed: 'left',
            key: 'pay_pre_fee',
            sorter: true,
            // width:120,
            customRender: (text) => text + ' 元'
          },
          {
            title: '返利支出',
            dataIndex: 'reward_fee',
            //  fixed: 'left',
            key: 'reward_fee',
            sorter: true,
            // width:120,
            needTotal: true,
            customRender: (text) => text + ' 元'
          },
           {
            title: '收益预估',
            dataIndex: 'pure_earning_fee',
            key: 'pure_earning_fee',
            // width:120,
            //  fixed: 'left',
            customRender: (text) => text + ' 元'
          },
          {
            title: '结算佣金',
            dataIndex: 'settled_fee',
            key: 'settled_fee',
            // width:120,
            sorter: true,
            //   scopedSlots: { customRender: 'sex' },
            needTotal: true,
            customRender: (text) => text + ' 元'
          },
           {
            title:"下单粉丝",
            dataIndex:"ordered_users",
            key:"ordered_users",
            // width:120,
          },
          {
            title:"首单粉丝",
            dataIndex:"first_order_users",
            key:"first_order_users",
            // width:120,
          },
          {
            title:"新增复购粉丝",
            dataIndex:"reordered_users",
            key:"reordered_users",
            // width:120,
          },
          {
            title:"累计已下单粉丝",
            dataIndex:"total_ordered_users",
            key:"total_ordered_users",
            // width:130,
          },
          {
            title:"累计复购粉丝",
            dataIndex:"total_reordered_users",
            key:"total_reordered_users",
            // width:130,
          },
        ]
        if (this.ignore_platform) {
          arr.forEach((item, index) => {
            if (item.title === '平台') {
              return arr.splice(index, 1)
            }
          })
        }
        if (this.ignore_uniac) {
          arr.forEach((item, index) => {
            if (item.title === '公众号') {
              return arr.splice(index, 1)
            }
          })
        }
        if (!this.failed_count) {
          arr.forEach((item, index) => {
            if (item.title === '失败订单数') {
              return arr.splice(index, 1)
            }
          })
        }if (!this.bind_order_count) {
          arr.forEach((item, index) => {
            if (item.title === '绑定订单数量') {
              return arr.splice(index, 1)
            }
          })
        }if (!this.ordered_users) {
          arr.forEach((item, index) => {
            if (item.title === '下单粉丝') {
              return arr.splice(index, 1)
            }
          })
        }if (!this.total_ordered_users) {
          arr.forEach((item, index) => {
            if (item.title === '累计已下单粉丝') {
              return arr.splice(index, 1)
            }
          })
        }if (!this.total_reordered_users) {
          arr.forEach((item, index) => {
            if (item.title === '累计复购粉丝') {
              return arr.splice(index, 1)
            }
          })
        }
        return arr

      }
    },
    watch: {
      uniac_id(val1, val2) {
        if (val1 !== val2 && '/report/digital' === this.$router.history.current.fullPath) {
          this.$refs.table.refresh()
        }
      },
      general(val1,val2){
        this.$nextTick(function(){
          this.getwidth()
        });
      },
      columns(val1,val2){
          this.$nextTick(function(){
          this.getwidth()
        });
      },
      refreshable(val1, val2) {
        console.log(1);
        if (val1 && val1 !== val2 && '/report/digital' === this.$router.history.current.fullPath) {
          this.$refs.table.refresh()
        }
      }
    }
  }
</script>
<style scoped>
  .bold{
    width: 10%;
    text-align:center;
  }
  .titleflex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
</style>
