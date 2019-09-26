<template>
  <div v-cloak class="page-header-index-wide">
    <a-row :gutter="24" >
      <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="今日纯收益预估" :total="`￥${cardData.data.tody.profit}`">
          <a-tooltip slot="action" title="仅仅反映用户当日下单带来的收益，下单后用户可能会发起退款，导致此数据不可靠">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <trend style="margin-right: 16px;">
              <span slot="term">
                佣金收入
              </span>
              {{ cardData.data.tody.fee| NumberFormat }}元
            </trend>
            <trend>
              <span slot="term">
                返利支出
              </span>
              {{ cardData.data.tody.reward| NumberFormat }}元
            </trend>
          </div>
          <template slot="footer">
            <div style="display: flex;justify-content: space-between">
              <span>本月&nbsp;{{ cardData.data.month.profit| NumberFormat }}元</span>
              <span style="float: right;">
                累计&nbsp;{{ cardData.data.total.profit| NumberFormat }}元
              </span>
            </div>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="今日订单笔数" :total="cardData.data.tody.order | NumberFormat">
          <a-tooltip slot="action" title="近期新订单趋势">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <trend style="margin-right: 16px;">
              <span slot="term" style="margin-left: 0;">
                拼多多&nbsp;{{ pdd_order_trend||0 }}
              </span>

            </trend>
            <trend>
              <span slot="term">
                淘宝&nbsp;{{ tb_order_trend||0 }}
              </span>

            </trend>
            <!--<mini-bar :bar-data="cardData.order_trend" />-->
          </div>
          <template slot="footer">
            <span>本月订单数&nbsp;{{ cardData.data.month.order| NumberFormat }}</span>
            <span style="float: right;">
              总订单数&nbsp;{{ cardData.data.total.order }}
            </span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          title="今日净增粉丝"
          :total="cardData.user.tody.subscribe-cardData.user.tody.unsubscribe | NumberFormat"
        >
          <a-tooltip slot="action" title="近期增粉趋势">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <AreaLine :area-data="cardData.fans_trend"/>
          </div>
          <template slot="footer">
            <div style="display: flex;justify-content: space-between">
              <span>关注{{ cardData.user.tody.subscribe| NumberFormat }}</span>
              <span>取关{{ cardData.user.tody.unsubscribe| NumberFormat }}</span>
              <span>二维码{{ cardData.user.tody.goods_sub| NumberFormat }}</span>
              <span>客服{{ cardData.user.tody.robot| NumberFormat }}</span>
              <!--<span>总粉丝{{ cardData.user.total.subscribe | NumberFormat }}</span>-->
            </div>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="粉丝活跃度" :total="`${cardData.fans_active.active_degree}%`">
          <a-tooltip slot="action" title="用户在公众号进行消息交互或点击菜单栏即成为当日活跃用户">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-progress
              color="rgb(19, 194, 194)"
              :target="cardData.fans_active.total"
              :percentage="cardData.fans_active.active_degree"
              height="8px"
            />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">
                活跃粉丝数
              </span>
              {{ cardData.fans_active.active }}
            </trend>
            <trend flag="up">
              <span slot="term">
                总粉丝数
              </span>
              {{ cardData.fans_active.total }}
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <BarCharts/>
  </div>
</template>
<script>
  import ChartCard from '@/components/chart/ChartCard'
  import ACol from 'ant-design-vue/es/grid/Col'
  import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import BarCharts from './components/Bar_Charts'
  import AreaLine from './components/Arealine_Charts'
  import Trend from '@/components/Trend'
  import moment from 'moment'
  import {mapActions, mapGetters} from 'vuex'

  const rankList = [{name: '优惠省钱网购', total: 253}]
  export default {
    name: 'Analysis',
    components: {
      ATooltip,
      ACol,
      AreaLine,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      BarCharts
    },
    data() {
      return {
        //           dateFormat: 'YYYY/MM/DD',
        //   monthFormat: 'YYYY/MM',
        // value:[moment().week(moment().week() - 1).startOf('week'),moment().week(moment().week() - 1).endOf('week')],//上一周
        value: [moment().subtract(6, 'days'), moment()],
        rankList,
        cardData: {
          'data': {
            'month': {
              'fee': 0,
              'order': 0,
              'profit': 0,
              'reward': 0
            },
            'tody': {
              'fee': 0,
              'order': 0,
              'profit': 0,
              'reward': 0
            },
            'total': {
              'fee': 0,
              'order': 0,
              'profit': 0.0,
              'reward': 0.0
            }
          },
          'user': {
            'month': {
              'promotion': 0,
              'subscribe': 0,
              'unsubscribe': 0
            },
            'tody': {
              'promotion': 0,
              'subscribe': 0,
              'unsubscribe': 0
            },
            'total': {
              'promotion': 0,
              'subscribe': 0,
              'unsubscribe': 0
            }
          },
          'fans_active': {
            'total': 0,
            'active': 0,
            'active_degree': '%0'
          }
        },
        yongData: [],
        fanslist: [],
        areaData: [],

        pdd_order_trend: '',
        tb_order_trend: '',

        loading: true,
        platform: 0
      }
    },
    created() {
      this.getcard1()
    },
    methods: {
      moment,
      getcard1() {
        var _this = this
        const url = this.uniac_id ? '/admin/opt-summary?uniac_id=' + this.uniac_id : '/admin/opt-summary'

        this.axios.get(url).then((res) => {
          if (!res.data.error) {
            _this.cardData = res
            this.pdd_order_trend = res.pdd_order_trend
            this.tb_order_trend = res.tb_order_trend
            this.loading = false
            if (!res.data.tody.profit) {
              _this.cardData.data.tody.profit = 0
            }
          }
        })
      }
    },
    computed: {
      ...mapGetters(['uniac_id', 'refreshable'])
    },
    watch: {
      uniac_id(val1, val2) {
        if (val1 !== val2 && '/dashboard/analysis' === this.$router.history.current.fullPath) {
          this.getcard1()
        }
      },
      refreshable(val1, val2) {
        if (val1 && val1 !== val2 && '/dashboard/analysis' === this.$router.history.current.fullPath) {
          this.getcard1()
        }
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

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }
</style>
