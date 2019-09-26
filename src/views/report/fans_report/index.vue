<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item label="关注时间">
              <a-range-picker v-model="queryParam.date" style="width: 100%"/>
            </a-form-item>
          </a-col>
            <a-col :md="{span:4,offset:8}" :sm="24" style="text-align:right">
            <a-checkbox @change="change('ignore_uniac')" :checked="ignore_uniac">忽略公众号</a-checkbox>
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
            <!-- 公众号 -->
            <span class="bold" v-if="!ignore_uniac">无</span>
            <span class="bold">{{general.increase_fans}}</span>
            <span class="bold" >{{general.subscribe}}</span>
            <span class="bold">{{ general.total_user_count||0}}</span>
            <!--  -->
            <span class="bold" >{{ general.unsub }}</span>
            <span class="bold" >{{general.active_fans}}</span>
            <span class="bold">{{ general.poster_sub }}</span>
            <span class="bold">{{ general.goods_sub }}</span>
            <span class="bold" >{{general.cash_count}}</span>
            <span class="bold" >{{general.cash_fee}}元</span>
          </div>
        </template>
    </s-table>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import moment from 'moment'
  import {getFansReport} from '@/api/manage'
  import {mapActions, mapGetters} from 'vuex'
import { constants } from 'crypto';
import { constantRouterMap } from '../../../config/router.config';

  export default {
    name: 'FansReport',
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
        result:{},
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 12}
        },
        form: null,
        ignore_uniac: false,
        mdl: {},
        general: {},
        type: '用户ID',
        dis: {
          dis1: true, dis2: false
        },
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
      
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return  getFansReport(Object.assign(parameter, this.filter_info))
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
                 this.general = res.total_count.total_data
                 this.$refs.table.localDataSource=res.data
                return tables
              } else {
                this.$message.error(res.msg || '获取数据失败,请联系管理员')
              }
            })
            .catch(err => {
              console.log(err);
            })
        },

      }
    },
  
    methods: {
       getwidth(){
         var th=document.getElementsByClassName("ant-table-align-center")
         var span=document.getElementsByClassName("bold")
         for(var i=0;i<th.length;i++){
           console.log(th[i].clientWidth)
              span[i].style.width=th[i].clientWidth+"px"
          }
      },
      reset() {
        this.queryParam = {}
        this.ignore_uniac = false
        this.$refs.table.refresh()
      },
       change(key) {
        this[key] = !this[key]
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
    },
    computed: {
      ...mapGetters(['user_uniacs_list', 'uniac_id', 'uniac_name', 'refreshable']),
      filter_info() {
        if (this.queryParam.date != undefined) {
          if (this.queryParam.date.indexOf('~') == -1 && this.queryParam.date != '') {
            this.queryParam.date = this.queryParam.date[0].format('YYYY-MM-DD') + '~' + this.queryParam.date[1].format('YYYY-MM-DD')
          }
        }
        const obj = {
          ...this.queryParam,
          uniac_id: this.uniac_id
        }
        if (this.ignore_uniac) {
          obj.ignore_uniac = this.ignore_uniac
          delete obj.uniac_id
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
      },
       columns() {
        const arr = [
          {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            sorter: true
          },
          {
            title: '公众号',
            dataIndex: 'uniacid',
            key: 'uniacid'

          },
          {
            title: '净增粉丝数',
            dataIndex: 'increase_fans',
            key: 'increase_fans',
            needTotal: true,
          },
          {
            title: '关注数',
            dataIndex: 'subscribe',
            key: 'subscribe',
            needTotal: true,
            sorter: true
          },
           {
            title: '粉丝总数',
            dataIndex: 'total_user_count',
            key: 'total_user_count',
           
          },
          {
            title: '取消关注',
            dataIndex: 'unsub',
            key: 'unsub',
            sorter: true,
          },
          {
            title: '活跃粉丝数',
            dataIndex: 'active_fans',
            key: 'active_fans',
            needTotal: true,
            sorter: true
          },
          {
            title: '通过邀请海报关注',
            dataIndex: 'poster_sub',
            key: 'poster_sub',
            sorter: true,
            needTotal: true,
          },
          {
            title: '扫描二维码关注',
            dataIndex: 'goods_sub',
            key: 'goods_sub',
            sorter: true,
            // customRender: (text) => text + ' 元'
          },
          {
            title: '提现次数统计',
            dataIndex: 'cash_count',
            key: 'cash_count',
            sorter: true
            //   scopedSlots: { customRender: 'avatar' },
          },
          {
            title: '提现金额统计',
            dataIndex: 'cash_fee',
            key: 'cash_fee',
            sorter: true,
            //   scopedSlots: { customRender: 'sex' },
            needTotal: true,
            customRender: (text) => text + ' 元'
          }
        ]
     
        if (this.ignore_uniac) {
          arr.forEach((item, index) => {
            if (item.title === '公众号') {
              return arr.splice(index, 1)
            }
          })
        }
        return arr

      }
    },
    watch: {
      uniac_id(val1, val2) {
        if (val1 !== val2 && '/report/fans' === this.$router.history.current.fullPath) {
          this.$refs.table.refresh()
        }
      },
      general(val1, val2){
        this.$nextTick(function(){
          this.getwidth()
        });
      },
     
      refreshable(val1, val2) {
        console.log(1);
        if (val1 && val1 !== val2 && '/report/fans' === this.$router.history.current.fullPath) {
          this.$refs.table.refresh()
        }
      }
    }
  }
</script>
<style scoped>
  .bold{
    width: 9%;
    text-align:center;
  }
  .titleflex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
</style>