<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">
      {{ title }}
    </h4>
    <v-chart
      height="350"
      :data="data"
      :tooltip="tooltip"
      :geoms="geoms"
      :force-fit="true"
      :padding="['auto', 'auto', 'auto', 'auto']"
    >
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-bar :scale="scale" position="date*预估佣金收入" />
      <v-bar position="date*收益预估" />
      <v-bar position="date*新增订单数" />
    </v-chart>
  </div>
</template>

<script>
import moment from 'moment'

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]
const scale = [{
  dataKey: 'x',
  min: 12
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 22
}]

export default {
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      scale,
      tooltip,
      // data2

      scales: {
        'trend': {
          alias: '每100位女性对应的男性数量'
        }
      },
      geoms: [
        {
          type: 'polygon',
          position: 'longitude*latitude',
          color: {
            field: 'trend',
            colors: ['#C45A5A', '#14647D']
          },
          opacity: 'value',
          tooltip: 'name*trend',
          animate: {
            leave: {
              animation: 'fadeOut'
            }
          }
        }
      ]
    }
  },
  created() {
  },
  methods: {
    clicked(a, b) {
      console.log(a, b)
    }
  }
}
</script>
