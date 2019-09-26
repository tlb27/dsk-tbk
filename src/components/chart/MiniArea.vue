<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="areaData" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="date*净增粉丝" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// const data = []
const beginDay = new Date().getTime()

// for (let i = 0; i < 10; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }

const tooltip = [
  'date*净增粉丝',
  (x, y) => ({
    name: date,
    value: date
  })
]
const scale = [{
  dataKey: 'date',
  min: 2
}, {
  dataKey: '净增粉丝',
  title: '时间',
  min: 1,
  max: 22
}]

export default {
  name: 'MiniArea',
  props: ['areaData'],
  data() {
    return {

      tooltip,
      scale,
      height: 100
    }
  },
  created() {
    // let _this=this
    // this.axios.get("/admin/opt-summary").then(function(res){
    //   _this.areaData = res.fans_trend
    // })
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
