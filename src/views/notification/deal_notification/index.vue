<template>
  <a-card>
     <a-spin :spinning="spinning"  class="myloading"/>
    <div slot="title">
      {{msg_id?'修改客服消息':'新建客服消息'}}
    </div>
    <a-form layout="horizontal">

      <a-form-item label="公众号" :label-col="{md:1,xs:6}" :wrapper-col="{md:5,xs:18}">
        <a-select
          v-model="uniac"
          placeholder="不选择默认发送给全部公众号"
          :mode="activeKey==='4'?'':'multiple'"
          @change="handleChange"
        >
          <template v-for="item in uniacs_list">

            <a-select-option :value="item.uniac_id">{{item.uniac_name}}</a-select-option>

          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="任务名称" :label-col="{md:1,xs:6}" :wrapper-col="{md:5,xs:18}">
        <a-input placeholder="请输入任务名称" v-model="publicKey.task_name">

        </a-input>
      </a-form-item>
      <a-row type="flex">
        <a-col :md="4" :xs="24">
          <a-form-item label="性别" :label-col="{span:6}" :wrapper-col="{span:18}">
            <a-select
              v-model="publicKey.sex"
              placeholder="请选择性别"
            >
              <a-select-option value='0'>不限</a-select-option>
              <a-select-option value='1'>男</a-select-option>
              <a-select-option value='2'>女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="4" :xs="24">
          <a-form-item label="下单数" :label-col="{span:6}" :wrapper-col="{span:18}">
            <a-input
              v-model="publicKey.order_number"
              type="number"
              :min="0"
              placeholder="请输入下单数"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="向指定用户推送" :label-col="{md:8,xs:8}" :wrapper-col="{md:16,xs:16}">
            <a-input v-model="publicKey.to_user"
                     placeholder="用于测试消息内容"
            />

          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-tabs class="tabs-wrap" v-model="activeKey" :size="size">
      <a-tab-pane tab="图片" key="1" style="min-height:330px; padding:0 20px;">
        <notify-image :imgData.sync="imgData">

        </notify-image>
      </a-tab-pane>
      <a-tab-pane tab="文字" key="2" style="min-height:330px; padding:0 20px;">
        <notify-text :textData.sync="textData">

        </notify-text>
      </a-tab-pane>
      <a-tab-pane tab="图文链接" key="3" style="min-height:330px; padding:0 20px;">
        <v-img-text :datas="imgTextDatas">

        </v-img-text>
      </a-tab-pane>
    </a-tabs>
    <div class="mt15">
      <label> 发送时间：</label>
      <a-radio-group :options="plainOptions" v-model="sendType"/>
      <a-date-picker
        showTime
        v-model="time"
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="选择发送时间"
        @change="onOk"
      />
    </div>
    <a-button :disabled="spinning" @click="submit">确定</a-button>
  </a-card>
</template>

<script>
  import notifyImage from './components/notify_img'
  import notifyText from './components/notify_word'
  import vImgText from './components/img-text/img_text'

  import {mapGetters} from 'vuex'

  import moment from 'moment'

  export default {
    name: "index",
    components: {
      notifyImage,
      notifyText,
      vImgText,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data() {
      return {
        // 推送详情
        msg_id: '',
        msg_type: '',
        details: {},
        spinning:false,
        size: 'default',
        task: {},
        start_time: null,

        sendType: '2',
        plainOptions: [  // 发送方式二选一
          // {label: '立即发送', value: '1'},
          {label: '定时发送', value: '2'},
        ],

        publicKey: {
          sex: '0',
        },
        uniac2: [],
        // uniac:[],
        activeKey: '1',
        imgData: null,   //图片消息图片数据
        textData: '',  //文本消息内容
        imgTextDatas: {},
        status: true,
        time: null
      }
    },
    created() {
      this.msg_id = this.$route.query.msg_id
      const details = this.$route.query.details
      this.details = details && JSON.parse(details) || {}
      this.msg_type = this.details.msg_type
      if (this.msg_id) {
        switch (this.msg_type) {
          case 0:
            this.activeKey = '3'
            this.imgTextDatas = this.details.content
            break;
          case 2:
            this.activeKey = '1'
            this.imgData = this.details.content
            break;
          case 1:
            this.activeKey = '2'
            this.textData = this.details.content
            break;
        }
        this.uniac2 = this.details.condition.uniac_id
        this.start_time = this.details.start_time
        this.time = moment(this.details.start_time)
        this.publicKey = {...this.details, ...this.details.condition, ...this.details.content}
        this.publicKey.imgData = this.details.img
        this.publicKey.sex = this.publicKey.sex || '0'
      }
    },
    computed: {
      ...mapGetters([
        'user_uniacs_list'
      ]),
      uniacs_list: {
        get() {
          return ([
            // {
            //   uniac_id: 0,
            //   uniac_name: "全部",
            // },
            ...this.user_uniacs_list
          ])
        },
        set() {

        }
      },
      uniac: {
        get(val, val2) {
          console.log(val, 'value');
          return this.uniac2
        },
        set(val) {
          console.log(val);
          this.uniac2 = val
        }
      },
    },
    watch: {
      // uniac: {
      //   handler(val1, val2) {
      //     if (!val1.includes(0) && val2.includes(0)) {
      //       return this.uniac = []
      //     }
      //     if (val1.length===this.user_uniacs_list.length){
      //       this.uniac.push(0)
      //     }
      //   },
      //   deep: true
      // }
    },
    methods: {
      onOk(value) {
        this.start_time = value.format('YYYY-MM-DD HH:mm:ss')
      },
      submit() {
        if (this.sendType === '2' && !this.start_time) {
          return this.$message.error('请选择发送时间')
        }
        const url = 'kfmsg/push-start'
        const uniac = this.uniac.filter(item => {
          return item && item
        }).join(',')
        const order_number = this.publicKey.order_number
        const formData = new FormData()
        if (this.msg_id) {
          formData.append('task_edit', 1)
          formData.append('msg_id', this.msg_id)
        }
        formData.append('uniac', uniac)
        formData.append('task_name', this.publicKey.task_name)
        this.start_time && formData.append('start_time', this.start_time)
        this.publicKey.to_user && formData.append('to_user', this.publicKey.to_user)
        !this.publicKey.to_user && this.publicKey.sex && formData.append('sex', this.publicKey.sex)
        if (order_number || order_number === 0) {
          !this.publicKey.to_user && formData.append('order_number', order_number)
        }
        this.spinning=true
        switch (this.activeKey) {
          case '3':
            this.getImgTextData(formData)
            break;
          case '2':
            this.getTextData(formData)
            break;
          case '1':
            this.getImgData(formData)
        }
        
        if (!this.status) {
        this.spinning=false
          return false
        }

        this.axios.post(url, formData).then(res => {
          if (!res.errcode) {
             this.$notification.success({
                  message: "success",
                  description:res.errmsg || '推送成功',
                  duration: 4
                });
              this.spinning=false
              if(this.publicKey.to_user){
                console.log(this.publicKey.to_user)
              }else{
                this.$router.push({
                  name: 'notification.history'
                })
              }
          } else {
            this.$notification["error"]({
                  message: "错误",
                  description: res.errmsg || '推送失败',
                  duration: 4
                });
            this.spinning=false
          }

        })
          .catch(err => {
            console.log(err)
            this.$notification["error"]({
                  message: "错误",
                  description: '请求失败',
                  duration: 4
                });
            this.spinning=false
          })
      },
      handleChange(value) {
        if (value.includes(0)) {
          this.user_uniacs_list.map(item => {
            if (!this.uniac.includes(item.uniac_id)) {
              this.uniac.push(item.uniac_id)
            }
          })
        }
      },
      selectAll() {
        console.log('selectall');
      },

      getImgTextData(formData) {
        formData.append('descp', this.imgTextDatas.descp)
        formData.append('photo', this.imgTextDatas.photo || this.publicKey.img)
        formData.append('title', this.imgTextDatas.title)
        formData.append('url', this.imgTextDatas.url)
        formData.append('msg_type', '0')
        this.status = true
      },
      getImgData(formData) {
        if (!this.imgData) {
          this.status = false
          return this.$message.error('请选择推送的图片')
        }
        formData.append('photo', this.imgData)
        formData.append('msg_type', '2')
        this.status = true
      },
      getTextData(formData) {
        if (!this.textData) {
          this.status = false
          return this.$message.error('请输入推送的内容')
        }
        formData.append('descp', this.textData)
        formData.append('msg_type', '1')
        this.status = true
      },
    }
  }
</script>

<style scoped>
  .tabs-wrap {
    border: 1px solid #eee
  }

  .ant-form-item {
    margin-bottom: 5px;
  }
  .myloading{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%,-50%)
  }
</style>
