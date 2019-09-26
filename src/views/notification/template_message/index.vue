<template>
  <a-card :title="msg_id?'修改模板消息':'新建模板消息'">
    <a-row :gutter="20">
      <a-col :md="14" :sm="24">
        <a-form>
          <a-form-item
            label="选择公众号"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-select
              v-model="uniac"
              placeholder="请选择公众号"
              mode="multiple"
            >
              <template v-for="item in user_uniacs_list">
                <a-select-option :value="item.uniac_id">
                  {{ item.uniac_name }}
                </a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
            label="任务名称"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              v-model="messages.task_name"
              placeholder="任意填写, 用于自己识别"
            />
          </a-form-item>
          <a-form-item
            label="性别"
            :label-col="labelCol"
            :wrapper-col="{span:3}"
          >
            <a-select
              v-model="messages.sex"
              placeholder="请选择性别"
            >
              <a-select-option value='0'>不限</a-select-option>
              <a-select-option value='1'>男</a-select-option>
              <a-select-option value='2'>女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="向指定用户推送"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="用于测试, 填写人员id"
              v-model="messages.to_user"
            />
          </a-form-item>
          <a-form-item
            label="选择模板"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="20">
              <a-col :span="19">
                <a-select
                  placeholder="选择模板"
                  v-model="template_id"
                >
                  <template v-for="item in templateLists">
                    <a-select-option :value='item.template_id'>{{item.title}}</a-select-option>
                  </template>
                </a-select>
              </a-col>
              <a-col :span="5">
                <a-button @click="refreshTemplate">刷新模板列表</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <template v-for="items in templateContent">
            <div class="list-wrapper">
              <a-form-item
                :label="items.title2"
                :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <a-row :gutter="20">
                  <a-col :span="18">
                    <template v-if="Array.isArray(items.title)">
                      <a-input v-model="items[key]" v-for="(key,index) in items.title"
                               :placeholder="index===0?'':(index===1?'输入自定义标题':'输入自定义内容')"></a-input>
                    </template>
                    <template v-else>
                      <a-input v-model="items[items.title]"></a-input>
                    </template>
                  </a-col>
                  <a-col :span="4">
                    <el-color-picker v-model="items.color"></el-color-picker>
                  </a-col>
                </a-row>

              </a-form-item>
            </div>
          </template>
          <a-form-item
            label="跳转链接"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-input v-model="url" placeholder="用户点击模板后跳转到的网页链接">

            </a-input>
          </a-form-item>
          <a-form-item
            label="发送时间"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-radio-group :options="plainOptions" v-model="sendType"/>
            <a-date-picker
              showTime
              v-model="time"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择发送时间"
              @change="onOk"
            />
          </a-form-item>
        </a-form>
        <a-col :offset="3" style="padding-left:0;">
          <a-button type="primary" @click="submit" icon="check">确定</a-button>
          <!--<a-button class="ml15" icon="close">取消</a-button>-->
        </a-col>
      </a-col>
      <a-col :md="10" :sm="24">
        <div class="phone">
          <div class="preview-box" v-if="previewTitle">
            <div class="title">{{previewTitle}}</div>
            <div class="time" style="color:#c7c7cb;margin-bottom: 8px;">{{previewTime}}</div>
            <template v-if="previewContent.length">
              <template v-for="item in previewContent">

                <p style="margin: 0;color:#515a6e">
                  <span v-if="item.title!=='first'&&item.title!=='remark'">
                  {{item.title2}}:
                  </span>
                  <span :style="{color:item.color}">
                    {{item[item.title]||item.title}}
                  </span>
                </p>
              </template>
            </template>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import moment from 'moment'

  export default {
    name: "template_message",
    data() {
      return {
        labelCol: {span: 3},
        wrapperCol: {span: 20},
        uniac_id: null,
        msg_id: '',
        details: {},

        messages: {sex: '0'},
        uniac2: [],
        url: '',  //跳转链接
        template_id: '',
        colors: {color1: '#000',},   //内容文字颜色
        // templateList: [{
        //   title: 'title'
        // }],   //模板列表
        plainOptions: [  // 发送方式二选一
          // {label: '立即发送', value: '1'},
          {label: '定时发送', value: '2'},
        ],
        sendType: '2',   //发送类型(立即发送跟定时)
        time: null,
        start_time: '',  //发送时间
        templateLists: [],
        templateContent: [],
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
          return this.uniac2
        },
        set(val) {
          console.log(val);
          this.uniac2 = val
        }
      },
      previewContent() {
        if (this.templateContent.length > 0) {
          return this.templateContent.map(item => {
            return item
          })
        } else {
          return []
        }
      },
      previewTitle() {
        for (let value of this.templateLists) {
          if (this.template_id === value.template_id) {
            return value.title
          }
        }
      },
      previewTime() {
        return moment().format('MM月DD日')
      }
    },
    watch: {
      template_id: {
        handler(val1, val2) {
          if (val1 !== val2) {
            this.getTemplateList(val1)
          }
        },
        deep: true
      }
    },
    created() {
      this.msg_id = this.$route.query.msg_id
      const details = this.$route.query.details
      this.details = details && JSON.parse(details) || {}
      if (this.msg_id) {
        this.messages = {...this.details, ...this.details.condition, ...this.details.content}
        this.uniac2 = this.messages.uniac_id
        this.url = this.messages.url
        this.messages.sex = this.messages.sex || '0'
        this.start_time = this.messages.start_time
        this.time = moment(this.messages.start_time)
        this.template_id = this.messages.msg_no
      }
    },
    mounted() {
      this.uniac_id = this.user_uniacs_list[0].uniac_id

      this.getAllTemplateList(this.uniac_id)
    },
    methods: {
      submit() {
        if (this.sendType === '2' && !this.start_time) {
          return this.$message.error('请选择发送时间')
        }

        const uniac = this.uniac.filter(item => {
          return item && item
        }).join(',')
        const {messages, start_time, uniac_id, template_id, previewContent, url} = this

        let content = {task_name: messages.task_name, msg_no: template_id, url}

        let data = {}

        previewContent.forEach((item, index) => {
          if (item.title === 'first' || item.title === 'remark') {
            data[item.title] = {
              value: item[item.title],
              color: item.color
            }
          } else {
            data[item.title] = {
              value: item[item.title],
              color: item.color
            }
          }
        })

        const formData = new FormData()
        if (this.msg_id) {  //如果是编辑已有的推送历史
          formData.append('task_edit', 1)
          formData.append('msg_id', this.msg_id)
        }
        start_time && formData.append('uniac', uniac)
        start_time && formData.append('start_time', start_time)
        messages.to_user && formData.append('to_user', messages.to_user)
        !messages.to_user && messages.sex && messages.sex !== '0' && formData.append('sex', messages.sex)
        template_id && formData.append('template_id', template_id)
        content && formData.append('content', JSON.stringify(content))
        formData.append('data', JSON.stringify(data))
        formData.append('msg_type', '3')
        this.axios.post('/kfmsg/push-start', formData).then(res => {
          if (!res.error) {
            this.$message.success(res.msg || '推送成功')
            if(messages.to_user==undefined){
                this.$router.push({
                  name: 'notification.history'
                })
            }
          } else {
            this.$message.error(res.msg || '推送失败')
          }
        })
      },
      onOk(value) {
        this.start_time = value.format('YYYY-MM-DD HH:mm:ss')
      },
      getTemplateList(template_id) {
        const params = {
          template_id
        }
        this.axios.get('/kfmsg/get-template-id', {params})
          .then(res => {
            if (res) {
              console.log(res.templateColor);
              this.templateContent = res.templateColor.map(item => {
                for (let key in res.templateContents) {
                  if (item.type === key) {
                    const messages = this.messages
                    let title = res.templateContents[key], title2 = item.type, color = item.color,
                      data = ''
                    if (this.msg_id) {
                      color = messages.data[title].color
                      data = messages.data[title].value
                    }
                    return {
                      title,
                      title2,
                      color,
                      [title]: data
                    }
                  }
                }
              })
            }
          })
      },
      getAllTemplateList(uniac_id) {
        const params = {
          uniac_id
        }
        return this.axios.get('/kfmsg/get-template', {params})
          .then(res => {
            let arr = []
            for (let key in res) {
              arr.push({
                template_id: res[key],
                title: key
              })
            }

            this.templateLists = arr
            if (!this.msg_id) {
              this.template_id = arr[0].template_id
            }

          })
      },
      refreshTemplate() {
        this.getAllTemplateList(this.uniac_id)
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
    }
  }
</script>

<style scoped>
  .list-wrapper {
    background-color: #f7f7f7;
    /*padding: 10px 10px 0 10px;*/
  }

  .list-wrapper .ant-form-item {
    margin-bottom: 0;
  }

  .phone {
    position: relative;
    width: 250px;
    height: 520px;
    background: #fff url("../../../assets/images/phone.jpg") 0 0/250px 520px no-repeat;
  }

  .preview-box {
    position: absolute;
    left: 0;
    right: 0;
    width: 200px;
    min-height: 100px;
    margin: 115px auto 0;
    padding: 10px;
    background-color: #fff;
    font-size: 12px;
  }

  .ml15 {
    margin-left: 15px;
  }

  .ant-form-item {
    margin-bottom: 5px;
  }
</style>
