<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" >
      <div style="position:relative">
        <div id="myChart" :style="{ height: '100px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

//  var echarts=require('echarts/lib/echarts');
//引入折线图
require("echarts/lib/chart/line");
//引入所需组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");

import moment from "moment";
import { constants } from "crypto";
// const data = []
const beginDay = new Date().getTime();


export default {
  name: "arealine",
  props: ["areaData"],
  data() {
    return {
      height: 100
    };
  },
 watch:{
    areaData(newvar, oldval) {
      this.drawLine();
    }
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      var chartsdata=this.areaData.slice(-5)
      console.log(chartsdata)
      var date = [];
      var quguan = [];
      var guangzhu = [];
      for (var p of chartsdata) {
        date.push(p.date);
        quguan.push(-p["取关"]);
        guangzhu.push(p["关注"]);
      }
      myChart.setOption({
        tooltip: {
          trigger: "axis"
        },
       
        grid: {
          left: "2%",
          right: "2%",
          bottom: "0%",
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: false,
          data: date,
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          
          {
            name: "关注",
            color: "#1890ff",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: "#1890ff"
                },
                lineStyle: {
                  //线的颜色
                  color: "#1890ff"
                },
                
              }
            },
            data: guangzhu
          },
          {
            name: "取关",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: "red"
                },
                lineStyle: {
                  //线的颜色
                  color: "red"
                },
                
              }
            },
            data: quguan
          }
        ]
      },true);
      window.onresize = function () {
        myChart.resize();
    }
    }
  },
  mounted() {
    this.drawLine();
  },
 
};
</script>
<style scoped>
#zr_0{
  width: 100%;
}
</style>


