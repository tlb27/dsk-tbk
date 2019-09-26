<template>
  <div id="home">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo text"
      mode="horizontal"
      @select="handleSelect"
      background-color="#050f24"
      text-color="#fff"
      active-text-color="#70bdff"
    >
      <div class="header">品悦技术API文档</div>
      <el-menu-item index="1">文档中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">未设置</template>
        <el-menu-item index="2-1">未设置</el-menu-item>
        <el-menu-item index="2-2">未设置</el-menu-item>
        <el-menu-item index="2-3">未设置</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div class="neicard">
            <h2 style="padding-bottom:20px;padding-left:20px;border-bottom:1px solid #eee">API编辑</h2>
            <div class="edit_grid">
              <p class="p_h3">请求名称:</p>
              <el-input type="text" class="minput" v-model="urlname" placeholder="请输入内容"></el-input>
            </div>
            <div class="edit_grid">
              <p class="p_h3">请求URL:</p>
              <el-input type="text" class="minput" v-model="url" placeholder="请输入内容"></el-input>
            </div>
            <div class="edit_grid">
              <p class="p_h3">请求方式:</p>
              <el-input type="text" class="minput" v-model="methods" placeholder="请输入内容"></el-input>
            </div>
            <div class="edit_grid">
              <p class="p_h3">参数:</p>
              <el-button @click="addrow()" style="margin:10px;">添加一行</el-button>
              <el-table
                :data="tableData"
                border
                :header-cell-style="getRowClass"
                style="width: 100%; margin: 10px 0;"
              >
                <el-table-column prop="parameter_name" label="参数名" width="180">
                  <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.parameter_name"></el-input>
                    <span v-else>{{scope.row.parameter_name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="required" label="必选" width="180">
                    <template slot-scope="scope">
                        <el-select  v-if="scope.row.status" v-model="scope.row.required" placeholder="请选择">
                        <el-option
                            v-for="item in istrue"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                        </el-select>
                        <span v-else>{{scope.row.required}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型">
                     <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.type"></el-input>
                    <span v-else>{{scope.row.type}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="explain" label="说明">
                      <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.explain"></el-input>
                    <span v-else>{{scope.row.explain}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="edit_grid">
              <p class="p_h3">请求示例:</p>
               <a-textarea placeholder="请输入内容" style="margin:10px 0;" v-model="req_json" :rows="6"/>
            </div>
            <div class="edit_grid">
              <p class="p_h3">返回示例:</p>
               <a-textarea placeholder="请输入内容" style="margin:10px 0;" v-model="json" :rows="6"/>
            </div>
               <div class="edit_grid">
              <p class="p_h3">返回参数说明:</p>
              <el-button @click="addrow1()" style="margin:10px;">添加一行</el-button>
              <el-table
                :data="tableData1"
                border
                :header-cell-style="getRowClass"
                style="width: 100%; margin: 10px 0;"
              >
                <el-table-column prop="parameter_name" label="参数名" width="180">
                  <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.parameter_name"></el-input>
                    <span v-else>{{scope.row.parameter_name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型">
                     <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.type"></el-input>
                    <span v-else>{{scope.row.type}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="explain" label="说明">
                      <template slot-scope="scope">
                     <el-input v-if="scope.row.status" v-model="scope.row.explain"></el-input>
                    <span v-else>{{scope.row.explain}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit1(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete1(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
              </el-table>
                <div class="edit_grid sumbit">
                    <el-button  style="margin-right:20px;" @click="save">保存</el-button>
                    <el-button type="primary"  @click="submit">提交</el-button>
                </div>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { CompassFill } from '@ant-design/icons/lib/dist';
import { constants } from 'crypto';

export default {
  data() {
    return {
      activeIndex2: "1",
      url:"",
      methods:"",
      json:"",
      req_json:"",
      urlname:'',
      istrue:["是","否"],
      tableData: [],
      tableData1:[],
      detaildata:{}
    };
  },
  created(){
    if(this.$route.query.id){
       this.axios.get("/admin/api-history?docs_id="+this.$route.query.id).then(res=>{
          if(res.error==0){
              this.detaildata=res.data[0]
                this.urlname=this.detaildata.api_name
            this.url=this.detaildata.api_url
            this.methods=this.detaildata.request_mothod
             if(this.detaildata.parameter==1){
                this.tableData=[]
            }else{
                this.tableData=JSON.parse(this.detaildata.parameter)
            }
            if(this.detaildata.re_info==1){
                this.tableData1=[]
            }else{
                this.tableData1=JSON.parse(this.detaildata.re_info)
            }
            if(this.detaildata.re_example==1){
                this.detaildata.re_example="无"
            }else{
                this.json=this.detaildata.re_example
            }
              if(this.detaildata.request_info==1||this.detaildata.request_info==""){
                this.detaildata.request_info="无"
            }else{
                this.req_json=this.detaildata.request_info
            }
          }
      })
    }
     
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    addrow() {
        this.tableData.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
      this.tableData.push({
        parameter_name: "username",
        required: "是",
        type: "string",
        explain: "用户名",
        status: 1
      });
    },
    submit(){
         this.tableData1.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
        this.tableData.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
        if(!this.urlname&&!this.url&&!this.methods){
           this.$notification['error']({
                message: '错误',
                description: '前三项必填',
                duration: 4
            })
        }else{
            var data={}
            data.api_name=this.urlname
            data.api_url=this.url
            data.request_mothod=this.methods
             if(this.tableData.length==0){
                data.parameter=1
            }else{
                data.parameter=this.tableData
            }
            if(!this.json||this.json=="无"){
                data.re_example=1
            }else{
                 data.re_example=this.json
            }
             if(!this.req_json||this.req_json=="无"){
                data.request_info=1
            }else{
                 data.request_info=this.req_json
            }
            if(this.tableData1.length==0){
                data.re_info=1
            }else{
                data.re_info=this.tableData1
            }
            if(this.$route.query.id){
                data.docs_id=this.$route.query.id
                this.axios.post("/admin/api-update",data).then(res=>{
                    this.$router.push("/api")
                })
            }else{
                 this.axios.post("/admin/api-add",data).then(res=>{
              if(res.error==0){
                  this.$router.push("/api")
              }else{
                  this.$notification['error']({
                    message: '错误',
                    description: res.msg,
                    duration: 4
                })
              }
          })   
            }
        }
    },
     addrow1() {
        this.tableData1.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
      this.tableData1.push({
        parameter_name: "username",
        type: "string",
        explain: "用户名",
        status: 1
      });
    },
    handleEdit(index, row){
        row.status=1
    },
    handleEdit1(index, row){
        row.status=1
    },
    save(){
         this.tableData1.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
        this.tableData.map(item=>{
            if(item.status){
            item.status = 0;
            }
            return item;
        })
    },
    handleDelete(index, row){
        this.tableData.splice(index,1)
    },
     handleDelete1(index, row){
        this.tableData1.splice(index,1)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background: #f0f9eb ";
      } else {
        return "";
      }
    }
  }
};
</script>

<style scoped>
#home {
  height: 100%;
  background: #eee;
}
.el-menu.el-menu--horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mcard {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header {
  color: white;
  font-size: 1.5rem;
  margin-right: 20px;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;

  line-height: 60px;
}
.el-main {
  background-color: #eee;
  padding: 20px 70px;
  height: 100%;
  height: 100%;
  text-align: center;
}
.edit_grid {
  padding-left: 20px;
}
.mleft {
  width: 20%;
  border-right: 1px solid #eee;
  height: 100%;
}
.mright {
  width: 80%;
  height: 100%;
  border-left: 1px solid #eee;
}
.left_ul {
  list-style: none;
  text-align: left;
}
.left_ul li {
  padding-bottom: 4px;
  font-weight: 500;
  color: black;
  font-size: 15px;
}
.left_ul li:hover {
  background: #ccc;
  cursor: pointer;
}
p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text {
  color: #999;
  font-size: 0.8rem;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.p_h3 {
  font-weight: bold;
  font-size: 0.8rem;
}
.box-card {
  width: 80%;
  margin: 0 auto;
}
.sumbit{
    text-align: center;
    margin: 30px 0 0;
}
.minput {
  margin: 20px 0;
}
.neicard {
  width: 60%;
  margin: 0 auto;
  text-align: left;
}
</style>
