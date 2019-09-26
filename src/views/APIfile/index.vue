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
        <div style="background:white;" class="mcard">
          <div class="mleft">
            <div style="padding-bottom:0 0 20px;border-bottom:1px solid #eee;position:relative">
              <h4
                style="margin:15px 0;text-align:left;padding-left:40px;font-size:20px;font-weight:bold"
              >目录</h4>
              <el-button
                style="position:absolute;right:2%;top:0%"
                size="mini"
                type="primary"
                @click="add"
                icon="el-icon-plus"
              >新增</el-button>
            </div>
            <ul class="left_ul">
              <li @click="seeapi(p,i)" v-for="(p,i) of apilist" :key="i" :class="{light:active==i}">
                <p>{{p.api_url}}</p>
                <p class="text">{{p.api_name}}</p>
              </li>
            </ul>
          </div>
          <div class="mright">
            <rform :data="apidata"></rform>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import rform from "./apicompontents/card_zhu.vue";
import { fips } from "crypto";
export default {
  name: "home",
  components: { rform },
  data() {
    return {
      activeIndex2: "1",
      apilist: [],
      active: 0,
      apidata: []
    };
  },
  created() {
    if (this.userInfo.id == 1) {
      this.axios.get("/admin/api-history").then(res => {
        if (res.error == 0) {
          this.apilist = res.data;
          for (var p of res.data) {
            if(p.parameter==1){
              p.parameter=[]
            }else{
              p.parameter=JSON.parse(p.parameter)
            }
            if(p.re_info==1){
              p.re_info=[]
            }else{
              p.re_info=JSON.parse(p.re_info)
            }
            if (p.re_example == 1) {
              p.re_example = "无";
            } else {
              p.re_example = p.re_example;
            }
            if (p.request_info == 1||p.request_info=="") {
              p.request_info = "无";
            } else {
              p.request_info = p.request_info;
            }
          }
          this.apidata = res.data[0];
        }
      });
    } else {
      this.$notification["error"]({
        message: "错误",
        description: "你没有权限查看该页面",
        duration: 4
      });
      this.$router.back(-1);
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    active(val1, val2) {
      this.apidata = this.apilist[val1];
    }
  },
  methods: {
    add() {
      this.$router.push({ name: "api.edit" });
    },
    handleSelect(key, keyPath) {},
    seeapi(p, i) {
      this.active = i;
    }
  }
};
</script>

<style scoped>
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
.light {
  background: #f0f9eb;
}
.el-main {
  background-color: #eee;
  padding: 20px 70px;
  height: 100%;
  height: 100%;
  text-align: center;
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
</style>
