<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" title="菜单栏编辑" :bordered="false">
      <template>
            <a-form>
          <!-- <a-form-item label="账户" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
            <a-select
              v-decorator="[
                  'admin',
                  {rules: [{ required: false, message: '请选择账号' }]}
                ]"
              placeholder="可以不选中此项,下方选择框默认为所有公众号"
              @change="handleChange1"
              style="width: 100%"
            >
              <a-select-option
                v-for="(p,i) in uniac_user"
                :key="i"
                :value="p.admin_id"
              >{{p.admin_name}}</a-select-option>
            </a-select>
          </a-form-item> -->
          <a-form-item label="公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
            <a-select
              mode="multiple"
             v-model="uniac_id"
              placeholder="公众号"
              @change="handleChange"
              style="width: 100%"
            >
              <a-select-option
                v-for="(p,i) in user_uniacs_list"
                :key="i"
                :value="p.uniac_id"
              >{{p.uniac_name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item  :label-col="{ span: 3}" :wrapper-col="{ span: 10 ,offset: 3 }">
            <a-button class="save_btn" type="primary" @click="saveFun">保存并发布至菜单</a-button>
          </a-form-item>
        </a-form>
        <div class="public-account-management clearfix">
          <!--左边配置菜单-->
          <div class="left">
            <div class="menu clearfix">
              <div class="menu_bottom" v-for="(item, i) of menu.button" :key="i">
                <!-- 一级菜单 -->
                <div
                  @click="menuFun(i,item)"
                  class="menu_item"
                  :class="{'active': isActive == i}"
                >{{item.name}}</div>
                <!--以下为二级菜单-->
                <div class="submenu" v-if="isSubMenuFlag == i">
                  <div class="subtitle" v-for="(subItem, k) in item.sub_button" :key="k">
                    <div
                      class="menu_subItem"
                      :class="{'active': isSubMenuActive == i + '' +k}"
                      @click="subMenuFun(item, subItem, i, k)"
                    >{{subItem.name}}</div>
                  </div>
                  <!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
                  <div
                    class="menu_bottom menu_addicon"
                    v-if="item.sub_button.length < 5"
                    @click="addSubMenu(item)"
                  >
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </div>
              <!-- 一级菜单加号 -->
              <div class="menu_bottom menu_addicon" v-if="menuKeyLength < 3" @click="addMenu">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </div>
          <!--右边配置-->
          <div v-if="!showRightFlag" class="right">
            <div class="configure_page">
              <div class="delete_btn">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteMenu(tempObj)"
                >删除当前菜单</el-button>
              </div>
              <div>
                <span>菜单名称：</span>
                <el-input
                  class="input_width"
                  v-model="tempObj.name"
                  placeholder="请输入菜单名称"
                  clearable
                ></el-input>
              </div>

              <div>
                <div class="menu_content">
                  <span>菜单内容：</span>
                  <el-radio-group v-model="tempObj.type">
                    <el-radio :label="'view'">跳转链接</el-radio>
                    <el-radio :label="'click'">发送关键词</el-radio>
                    <el-radio v-if="userInfo.id==1" :label="'miniprogram'">小程序</el-radio>
                  </el-radio-group>
                </div>
                <div class="configur_content">
                  <div v-if="tempObj.type == 'view'">
                    <span>跳转链接：</span>
                    <el-input
                      class="input_width"
                      v-model="tempObj.url"
                      placeholder="请输入链接"
                      clearable
                    ></el-input>
                  </div>
                  <div v-if="tempObj.type == 'click'">
                    <div>
                      <span>关键词：</span>
                      <el-input
                        class="input_width"
                        v-model="tempObj.key"
                        placeholder="请输入关键词"
                        clearable
                      ></el-input>
                    </div>
                    <p class="blue">tips:这里需要配合关键词推送消息一起使用</p>
                  </div>
                  <div v-if="tempObj.type == 'miniprogram'">
                    <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
                  </div>
                </div>
              </div>
            </div>
            <div>menu对象值：{{menu}}</div>
          </div>
          <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
          <div v-if="showRightFlag" class="right">
            <p>请选择菜单配置</p>
          </div>
        </div>
      
      </template>
    </a-card>
  </div>
</template>
    </a-card>
  </div>
</template>

<script>
import { getBase64 } from "@/utils";
import { mapActions, mapGetters } from "vuex";
import { constants } from "crypto";
export default {
  data() {
    return {
      showRightFlag: true, //右边配置显示默认详情还是配置详情
      menu: {
        // // 一级菜单
        button: [
          {
            type: "click",
            name: "菜单1",
            // key: "menu1",关键词
            // media_id: "", //素材名称--图文消息
            sub_button: [
             
            ]
          }
        ]
      }, //横向菜单
      isActive: -1, // 一级菜单点中样式
      isSubMenuActive: -1, // 一级菜单点中样式
      isSubMenuFlag: -1, // 二级菜单显示标志

      tempObj: {
        // type:"view",//media_id:素材内容; view:跳转链接
        // name:"",//菜单名称
        // material:"",//素材名称
        // link:"",//跳转链接
      }, //右边临时变量，作为中间值牵引关系
      tempSelfObj: {
        //一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
        // grand:"" 1:表示一级菜单； 2:表示二级菜单
        // index:"" 表示一级菜单索引
        // secondIndex:"" 表示二级菜单索引
      },
      uniac_id:[],
      visible2: false, //素材内容  "选择素材"按钮弹框显示隐藏
      tableData: [] //素材内容弹框数据
    };
  },
  created() {
      console.log(this.user_uniacs_list)
  },
  mounted() {},
  filters: {},
  methods: {
    handleChange(value) {
      var name_list = [];
      for (var p of value) {
        for (var item of this.user_uniacs_list) {
          if (p == item.uniac_id) {
            name_list.push(item.uniac_name);
          }
        }
      }
      this.uniac_list = {
        uniac_id: value.join(","),
        uniac_name: name_list.join(",")
      };
    },
    // 调用素材内容 “选择素材”的弹框数据，模拟从微信返回的数据
    //模拟调取菜单数据
    // 素材内容弹框的选择按钮函数
    // handleEdit(index, row) {
    //   this.visible2 = false;
    //   this.tempObj.media_id = row.name;
    // },
    saveFun() {
      if(this.uniac_id.length==0){
            this.$notification["error"]({
                  message: "错误",
                  description:"请选择公众号",
                  duration: 4
              });
      }else{
        console.log(this.menu)
        for(var p of this.menu.button){
          if(p.type=="miniprogram"){
            p.appid="{}"
            p.pagepath="pages/loginOnload/loginOnload"
          }
          for(var j of p.sub_button){
            if (j.type=="miniprogram"){
              j.appid="{}"
              j.pagepath="pages/loginOnload/loginOnload"
            }
          }
        }
        var data={}
        data.uniac_list=this.uniac_id.join(",")
        data.json=this.menu
        this.axios.post("/admin/menu-switch",data).then(res=>{
          console.log(res)
          if(res.error_msg){
              this.$notification["error"]({
                  message: "错误",
                  description:res.error_msg,
                  duration: 4
              });
          }
          if(res.msg){
            if(res.msg[0].return_msg=="ok"){
               this.$notification.success({
                  message: "success",
                  description: `成功`
                });
            }else{
               this.$notification["error"]({
                  message: "错误",
                  description:res.msg[0].return_msg,
                  duration: 4
              });
            }
          }
          
      }).catch(error=>{
         this.$notification["error"]({
                  message: "错误",
                  description:"请填写正确的菜单栏格式,一级菜单不能为空",
                  duration: 4
              });
      })
      }
      
    },
    // 一级菜单点击事件
    menuFun(i, item) {
      this.showRightFlag = false; //右边菜单隐藏
      // console.log(i);
      this.tempObj = item; //这个如果放在顶部，flag会没有。因为重新赋值了。
      this.tempSelfObj.grand = "1"; //表示一级菜单
      this.tempSelfObj.index = i; //表示一级菜单索引

      this.isActive = i; //一级菜单选中样式
      this.isSubMenuFlag = i; //二级菜单显示标志
      this.isSubMenuActive = -1; //二级菜单去除选中样式
    },
    // 二级菜单点击事件
    subMenuFun(item, subItem, index, k) {
      this.showRightFlag = false; //右边菜单隐藏

      this.tempObj = subItem; //将点击的数据放到临时变量，对象有引用作用

      this.tempSelfObj.grand = "2"; //表示二级菜单
      this.tempSelfObj.index = index; //表示一级菜单索引
      this.tempSelfObj.secondIndex = k; //表示二级菜单索引

      this.isSubMenuActive = index + "" + k; //二级菜单选中样式
      this.isActive = -1; //一级菜单去除样式
    },
    // 添加横向一级菜单
    addMenu() {
      // 先判断1，再判断2,对象增加，会进行往下计算，所以必须先判断2，再判断1
      if (this.menuKeyLength == 2) {
        this.$set(this.menu.button, "2", {
          // type: "",
          name: "菜单3",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
          sub_button: []
        });
      }
      if (this.menuKeyLength == 1) {
        this.$set(this.menu.button, "1", {
          // type: "",
          name: "菜单2",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
          sub_button: []
        });
      }
    },
    // 添加横向二级菜单
    addSubMenu(item) {
      let subMenuKeyLength = item.sub_button.length; //获取二级菜单key长度
      if (subMenuKeyLength == 4) {
        this.$set(item.sub_button, "4", {
          // type: "",
          name: "子菜单5"
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 3) {
        this.$set(item.sub_button, "3", {
          // type: "",
          name: "子菜单4"
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 2) {
        this.$set(item.sub_button, "2", {
          // type: "",
          name: "子菜单3"
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 1) {
        this.$set(item.sub_button, "1", {
          // type: "",
          name: "子菜单2"
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 0) {
        this.$set(item.sub_button, "0", {
          // type: "",
          name: "子菜单1"
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
    },
    //删除当前菜单
    deleteMenu(obj) {
      console.log(obj);
      var _this = this;
      this.$confirm({
        title: '提示',
        content: "此操作将永久删除该文件, 是否继续?",
        onOk() {
         _this.deleteData();
        },
        onCancel() {
        }
      })
      // this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     _this.deleteData(); // 删除菜单数据
      //   })
      //   .catch(() => {});
    },
    // 删除菜单数据
    deleteData() {
      // 一级菜单的删除方法
      if (this.tempSelfObj.grand == "1") {
        this.menu.button.splice(this.tempSelfObj.index, 1);
      }
      // 二级菜单的删除方法
      if (this.tempSelfObj.grand == "2") {
        this.menu.button[this.tempSelfObj.index].sub_button.splice(
          this.tempSelfObj.secondIndex,
          1
        );
      }
       this.$notification.success({
                  message: "success",
                  description: `删除成功`
                });
    }
  },
  computed: {
    // menuObj的长度，当长度 小于  3 才显示一级菜单的加号
    ...mapGetters(["user_uniacs_list","userInfo"]),
    menuKeyLength: function() {
      return this.menu.button.length;
    },
   
    
  },
  watch:{
       menu(val1,val2){
        console.log(val1)
    }
  }
  ,
  components: {}
};
</script>
<style lang="less" scoped="scoped">
/* 公共颜色变量 */
.clearfix {
  *zoom: 1;
}
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
div {
  text-align: left;
}
.public-account-management {
  min-width: 1200px;
  width: 1200px;
  margin: 0 auto;
  .left {
    float: left;
    display: inline-block;
    width: 350px;
    height: 715px;
    background: url("../../../assets/iphone_backImg.png") no-repeat;
    background-size: 100% auto;
    padding: 581px 25px 88px;
    position: relative;
    box-sizing: border-box;
    /*第一级菜单*/
    .menu {
      .menu_bottom {
        position: relative;
        float: left;
        display: inline-block;
        box-sizing: border-box;
        width: 100px;
        /*height: 44px;*/
        /*line-height: 44px;*/
        text-align: center;
        background-color: #e2e2e2;
        border: 1px solid #ebedee;
        cursor: pointer;
        &.menu_addicon {
          height: 46px;
          line-height: 46px;
        }
        .menu_item {
          height: 44px;
          line-height: 44px;
          /*padding: 14px 0;*/
          text-align: center;
          box-sizing: border-box;
          &.active {
            border: 1px solid #2bb673;
          }
        }
        .menu_subItem {
          height: 44px;
          line-height: 44px;
          text-align: center;
          box-sizing: border-box;
          /*padding: 14px 0;*/
          &.active {
            border: 1px solid #2bb673;
          }
        }
      }
      i {
        color: #2bb673;
      }
      /*第二级菜单*/
      .submenu {
        position: absolute;
        width: 100px;
        bottom: 45px;
        .subtitle {
          background-color: #e8e7e7;
          box-sizing: border-box;
          margin-bottom: 2px;
          padding-bottom: 0
        }
      }
    }
    .save_btn {
    }
  }
  /*右边菜单内容*/
  .right {
    float: left;
    width: 63%;
    background-color: #e8e7e7;
    padding: 25px 10px 0px 20px;
    height: 710px;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .configure_page {
      .delete_btn {
        text-align: right;
        margin-bottom: 15px;
      }
      .menu_content {
        margin-top: 20px;
      }
      .configur_content {
        margin-top: 20px;
      }
      .blue {
        color: #29b6f6;
        margin-top: 10px;
      }
      .applet {
        margin-bottom: 20px;
        span {
          margin-right: 18px;
        }
      }
      .material {
        .input_width {
          width: 30%;
        }
        .el-textarea {
          width: 80%;
        }
      }
    }
  }
}
</style>
<!--修改UI框架样式-->
