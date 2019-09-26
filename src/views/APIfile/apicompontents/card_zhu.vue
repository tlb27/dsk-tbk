<template>
  <div id="rform">
    <div class="title">
      <h2 style="font-size:25px;font-weight:bold;margin:12px 0;">
        <span>
          {{detaildata.api_name}}
        </span>
      <el-button type="primary" style="float:right;margin:0 10px"  @click="edit(detaildata)">修改</el-button>
      <el-button style="float:right"   type="danger" @click="sanchu" >删除</el-button>
      </h2>
    </div>
    <div class="paragraph">
      <h4>请求URL：</h4>
      <ul>
        <li>
          <el-tag color="#eee" type="danger">{{detaildata.api_url}}</el-tag>
        </li>
      </ul>
    </div>
    <div class="paragraph">
      <h4>请求方式</h4>
      <ul>
        <li>{{detaildata.request_mothod}}</li>
      </ul>
    </div>
    <div class="paragraph">
      <h4>参数</h4>
      <template>
        <el-table
          :data="detaildata.parameter"
          border
          empty-text="无参数"
          :header-cell-style="getRowClass"
          style="width: 100%; margin: 30px 0;"
        >
          <el-table-column prop="parameter_name" label="参数名" width="180"></el-table-column>
          <el-table-column prop="required" label="必选" width="180"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="explain" label="说明"></el-table-column>
        </el-table>
      </template>
    </div>
    <div class="paragraph">
      <h4>请求示例</h4>
      <div class="jsonbg" >
        <pre>{{detaildata.request_info}}</pre>
      </div>
    </div>
    <div class="paragraph">
      <h4>返回示例</h4>
      <div class="jsonbg" >
        <pre>{{detaildata.re_example}}</pre>
      </div>
    </div>
    <div class="paragraph">
      <h4>返回参数说明</h4>
      <template>
        <el-table
          :data="detaildata.re_info"
          empty-text="无返回参数说明"
          border
          :header-cell-style="getRowClass"
          style="width: 100%; margin: 30px 0 100px;"
        >
          <el-table-column prop="parameter_name" label="参数名" width="180"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="explain" label="说明"></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  name: "rform",
  data() {
    return {
      detaildata:{},
    };
  },
  created(){
  },
  watch:{
    data(val1,val2){
      this.detaildata=val1
      console.log(val1)
    }
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background: #f0f9eb ";
      } else {
        return "";
      }
    },
     sanchu(){
      var data={id:this.data.id}
      this.axios.post("/admin/api-del",data).then(res=>{
        if(res.error==0){
            location.reload()
        }
      })
    },
    edit(p){
      console.log(p)
      this.$router.push({
        name:"api.edit",
        query:{id:this.detaildata.id}
      })
    }
  }
};
</script>

<style scoped>
h4 {
  margin: 0;
}
#rform {
  width: 100%;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  text-align: left;
}
.title {
  border-bottom: 1px solid #eee;
  width: 100%;
  text-align: left;
  margin: 0 0 20px;
}
.el-table .table_header {
  background: red;
}
.pln{
    color: black
}
.str{
    color:#080
}
.pun{
    color: #660
}
.lit{
    color: #066
}
.pun{
    color: #660
}
.jsonbg {
  padding-left: 5px;
  margin: 20px 0;
  background-color: rgb(252, 252, 252);
  border: 1px solid rgb(225, 225, 232);
}
</style>
