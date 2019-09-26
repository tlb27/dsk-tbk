<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1'
    },
    height: {
      type: String,
      default: '400px'
    },
    datas: {
      default: 123
    },
    options: {
      type: Object,
      default: () => ({})
    },
    opts: {
      type: Object,
      default: () => ({})
    },
    range: {
      type: Array,
      default: () => {
        const date = new Date()
        const array = []
        let range
        range = date.getFullYear() + '-' + (date.getMonth() + 1)
        array.push(range)
        return array
      }
    }
  },
  data() {
    return {
      chart: null

    }
  },
  computed: {
    newData() {
      return this.datas
    }
  },
  watch: {
    newData(val1, val2) {
      if (this.chart) {
        this.chart.setOption(val1, this.opts)
      } else {
        this.initChart(val1)
      }
    }
  },
  mounted() {
    if (!this.chart) {
      this.initChart(this.options)
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 200)
      setTimeout(_ => {
        this.__resizeHandler()
      }, 0)
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart(options) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    },
    console1(val) {
      console.log(1, val)
    }

  }
}
</script>

<style scoped>
  .chart{
    width:100%;
    padding:20px;
  }
</style>
