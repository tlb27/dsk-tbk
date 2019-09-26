<template>
  <a-card id="total-chart" :bordered="false" :loading="loading" :body-style="{padding: '0',width:'100%'}">
    <a-tabs
      default-active-key="1"
      size="large"
      :tab-bar-style="{ paddingLeft: '16px'}"
    >
      <div slot="tabBarExtraContent" class="extra-wrapper">
        <a-radio-group v-model="platform" button-style="solid" @change="onRadioChange">
          <a-radio-button :value="2">
            全部
          </a-radio-button>
          <a-radio-button :value="0">
            淘宝
          </a-radio-button>
          <a-radio-button :value="1">
            拼多多
          </a-radio-button>
        </a-radio-group>
        <a-range-picker
          v-model="value"
          class="ml10"
          :allowClear="false"
          :ranges="{ '本周': [moment().startOf('week'), moment()],
                     '上周':[moment().week(moment().week() - 1).startOf('week'),moment().week(moment().week() - 1).endOf('week')],
                     '本月': [moment().startOf('month'), moment()],
                     '上月': [moment().month(moment().month() - 1).startOf('month'),moment().month(moment().month() - 1).endOf('month')]}"
          :style="{width: '256px'}"
          @change="ondateChange"
        />
      </div>

      <a-tab-pane ref="chartTab" key="1" tab="趋势">
        <bar-chart
          :datas="datas"
          :options="originOption"
          height="500px"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import barChart from '@/components/chart'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

function getStyle(node, attr) {
  if (typeof getComputedStyle !== 'undefined') {
    var value = getComputedStyle(node, null).getPropertyValue(attr)
    return attr == 'opacity' ? value * 100 : value // 兼容不透明度，如果是不透明度，则返回整数方便计算
  } else if (typeof node.currentStyle !== 'undefined') {
    if (attr == 'opacity') { // 兼容不透明度
      return Number(node.currentStyle.getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1])
    } else {
      return node.currentStyle.getAttribute(attr)
    }
  }
}

export default {
  name: 'TencentChart',
  components: { barChart },
  data() {
    const startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000)
    const endDate = new Date()
    const startTime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
    const endTime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()
    const time = [startTime, endTime]

    var colors = ['#3AA0FF', '#13C2C2', '#675bba']
    return {
      time: time,

      value: [moment().subtract(6, 'days'), moment()],
      platform: 2,
      originOption: {
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        label: {
          show: true,
          position: 'top'
        },
        legend: {
          data: ['新增订单数', '预估佣金收入', '收益预估']
        },
        grid: {
          left: 60,
          right: 30,
          top: 40,
          bottom: 30
        },
        xAxis: [{
          type: 'category',
          data: []
        }],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            }
          }
        ],
        series: [
          {
            name: '新增订单数',
            type: 'bar',
            data: [],
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return (params.data)
                }
              }
            },
            barWidth: '30%'
          },
          {
            name: '预估佣金收入',
            type: 'bar',
            data: [],
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return (params.data)
                }
              }
            },
            barWidth: '30%'
          },
          {
            name: '收益预估',
            type: 'bar',
            data: [],
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return (params.data)
                }
              }
            },
            barWidth: '30%'
          }
        ]
      },
      option: {},

      loading: false,
      xAxis: [{
        type: 'category',
        data: []
      }],
      chart: ''
    }
  },
  computed: {
    ...mapGetters(['uniac_id', 'refreshable']),
    filter_infos(val) {
      const obj = {}
      obj.mpid = this.mpid
      obj.start_time = this.time[0]
      obj.End_time = this.time[1]
      obj.type = this.type
      return obj
    },
    datas() {
      return this.option
    }
  },
  watch: {
    filter_infos(val) {
      // this.getTableList(val)
    },
    uniac_id(val1, val2) {
      console.log(val1, val2);
      if (val1 !== val2 && '/dashboard/analysis' === this.$router.history.current.fullPath) {
        this.getcard2()
      }
    },
    refreshable(val1, val2) {
      if (val1 && val1 !== val2&& '/dashboard/analysis' === this.$router.history.current.fullPath) {
        this.getcard2()
      }
    }
  },

  mounted() {
    this.getcard2()
  },
  // activated(){
  //   this.getWidth()
  // },
  methods: {
    moment,
    getWidth() {
      const chart = document.getElementById('total-chart')

    },
    getcard2() {
      const Params = {
        platform: this.platform,
        'date_range': [this.value[0].format('YYYY-MM-DD'), this.value[1].format('YYYY-MM-DD')]
      }
      this.getChartsDatas(Params)
    },
    ondateChange(dates, dateStrings) {
      const Params = { platform: this.platform, 'date_range': [dateStrings[0], dateStrings[1]] }
      this.getChartsDatas(Params)
    },

    getChartsDatas(params) {
      const url = this.uniac_id ? '/admin/data-trend?uid=1&uniac_id=' + this.uniac_id : '/admin/data-trend?uid=1'
      this.axios.post(url, params).then(res => {
        if (!res.data) {
          this.$message.error(res.msg||'获取数据失败,请联系管理员')
          return false
        }
        const pay_pre_fee = []
        const income = []
        const orderNum = []
        const xAxis = []

        res.data.map((item, index) => {
          pay_pre_fee[index] = item.预估佣金收入
          xAxis[index] = item.date
          income[index] = item.收益预估
          orderNum[index] = item.新增订单数
        })
        this.option = {
          xAxis: [{
            type: 'category',
            data: xAxis
          }],
          series: [
            {
              name: '预估佣金收入',
              type: 'bar',
              data: pay_pre_fee,
              barWidth: '20%'
            },
            {
              name: '收益预估',
              type: 'bar',
              data: income,
              barWidth: '20%'
            },
            {
              name: '新增订单数',
              type: 'bar',
              data: orderNum,
              barWidth: '20%'
            }
          ]
        }
      })
    },

    onRadioChange() {
      this.getcard2()
    },

    getTableList(data) {
      this.$get('action/WechatAdvs/fansAndmapsForm', data)
        .then(res => {
          let list
          const data = res.data
          const sale = []
          const returned = []
          const order_total = []
          const xAxis = []

          data.ad_price.forEach((item, index) => {
            sale[index] = item['sum(a.ad_price)']
            xAxis[index] = this.type ? item.days : (item.stat_date + '\n' + item.end_date)
            order_total[index] = item['count(a.id)']
            returned[index] = item['sum(a.real_price)']
          })
          this.option = {
            xAxis: [{
              type: 'category',
              data: xAxis
            }],
            series: [
              {
                name: '回款',
                type: 'bar',
                data: returned,
                yAxisIndex: 0,
                barWidth: '20%'
              },
              {
                name: '订单数',
                type: 'bar',
                data: order_total,
                yAxisIndex: 1,
                barWidth: '20%'
              },
              {
                name: '销售额',
                type: 'bar',
                data: sale,
                yAxisIndex: 0,
                barWidth: '20%'
              }
            ]
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  [v-cloak] {
    display: none
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .ml10 {
      margin-left: 10px;
    }

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }
</style>
