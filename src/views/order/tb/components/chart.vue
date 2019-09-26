<template>
  <div>
    <barChart
      :datas="datas"
      :options="originOption"
      className="chart1"
      height="250px"
    />
  </div>

</template>

<script>

  import barChart from '@comp/chart/index'
  // import barChart from '@/views/dashboard/components/Bar_Charts'

  import {mapActions, mapGetters} from 'vuex'
  import moment from 'moment'
  import {debounce} from '@/utils'

  // const today = [moment().format('YYYY-MM-DD 00:00:00'),moment().format('YYYY-MM-DD 23:59:59')]
  const today = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]

  export default {
    name: 'Chart',
    components: {barChart},
    props: {
      date: {
        type: Array,
        default: () => ([])
      },
        time_type:{
        type:Number,
        default:0
      }
    },
    data() {
      var colors = ['#3AA0FF', '#13C2C2', '#675bba']
      return {
        originOption: {
          color: colors,
          tooltip: {
            trigger: 'axis'
          },
          label: {
            show: true,
            position: 'right'
          },
          grid: {
            left: 100,
            right: 30,
            top: 20,
            bottom: 40
          },
          xAxis: [{
            type: 'value',
            data: []
          }],
          yAxis: [
            {
              type: 'category',
              data: [],
              interval:180
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              smooth: true,
              barWidth : 40,
              data: []
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
      datas() {
        return this.option
      },
      date_range() {
        return this.date.map(item => {
          return moment(item.split(' ')[0]).format('YYYY-MM-DD')
        })
      }
    },
    watch: {
      refreshable(val1, val2) {
        if (val1 && val1 !== val2 && '/order/tb_order' === this.$router.history.current.fullPath) {
          this.getChartsDatas()
        }
      },
      date_range: {
        handler: function (val1, val2) {
          this.getChartsDatas()
        },
        deep: true,
      },
      uniac_id(val1, val2) {
        if (val1 !== val2 && '/order/tb_order' === this.$router.history.current.fullPath) {
          this.getChartsDatas()
        }
      },
    },

    mounted() {
      this.getChartsDatas()
    },
    methods: {
      moment,

      getChartsDatas() {
        console.log(123);
        const url = '/admin/tb-order-status'
        const date_range = this.date_range.length ? this.date_range : today
        var datas={}
        if(this.time_type==1){
           datas = {date_range,time_type:this.time_type};
        }
        if(this.time_type==0){
            datas = {date_range};
        }
        if (this.uniac_id) {
          datas.uniac_id = this.uniac_id
        }

        this.axios.post(url, datas).then(res => {
          if (res.length === 0) {
            return false
          }
          let data = []
          const yAxis = ['已绑定','未绑定']
          data[0] = res[0].bind_order
          data[1] = res[0].un_bind_order

          this.option = {
            yAxis: [{
              type: 'category',
              data: yAxis
            }],
            series: [
              {
                name: '数量',
                type: 'bar',
                smooth: true,
                data: data
              }
            ]
          }
        })
      },


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

  .chart1 {
    padding: 0;
  }
</style>
