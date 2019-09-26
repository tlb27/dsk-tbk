<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="barData" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="date*订单数" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// const data = []
// const beginDay = new Date().getTime()

// for (let i = 0; i < 12; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }

const tooltip = [
  'date*订单数',
  (date, order) => ({
    name: date,
    value: order
  })
]

const scale = [
  {
    dataKey: 'date',
    min: 2
  },
  {
    dataKey: '订单数',
    title: '订单',
    min: 1,
    max: 30
  }
]

export default {
  name: 'MiniBar',
  props: ['barData'],
  data() {
    return {
      tooltip,
      scale,
      height: 100
    }
  },
  created() {
    // let _this=this;
    // this.axios.get("/admin/opt-summary").then(function(res){
    //   _this.barData = res.order_trend
    // })
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
