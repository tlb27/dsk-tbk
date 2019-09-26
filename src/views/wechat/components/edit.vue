<template>
  <a-card :body-style="{padding: '24px 32px'}" title="公众号配置详情" :bordered="false">
    <template slot="extra">
      <a-button type="primary" @click="$router.go(-1)">
        返回
      </a-button>
    </template>
    <a-row type="flex" justify="center">
      <a-col :xs="{span: 24}" :sm="{span: 24}" :md="15" :lg="12">
        <a-card>
          <a-row>
            <a-col :sm="2" :xs="24" class="mb15">
              <a-card-meta style="width:300px;margin-top:4px;">
                <a-avatar slot="avatar" shape="square" :size="64" :src="formData.uniac_head_img" />
              </a-card-meta>
            </a-col>
            <a-col :sm="11" :xs="{span:19,offset:1}" style="font-size: 16px;">
              <div class="title">
                名称：{{ formData.uniac_name }}
              </div>
              <div>粉丝数：{{ formData.user_count }}</div>
              <div>接入时间：{{ formData.create_time }}</div>
              <!--<div>模式：{{formData.model_name}}</div>-->
            </a-col>
            <a-col :sm="10" :xs="24">
              <img
                width="1280"
                height="1280"
                style="display:block;width:128px;height:128px; margin:auto"
                :src="formData.qrcode_url"
              >
            </a-col>
          </a-row>
        </a-card>
        <div class="mt15">
          <wechatForm
            :form-title="formTitle"
            :form-data="formData"
            @handleSubmit="handleSubmit"
            @showModel="showModel"
          />
        </div>
      </a-col>
    </a-row>

    <a-modal
      :title="item.cn+'---修改'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form class="text-align-left">
        <template v-if="item.type==='switch'">
          <a-form-item
            :label="item.cn"
            :label-col="item.labelCol||{lg: {span: 9}, sm: {span: 9}}"
            :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
            has-feedback
          >
            <a-switch v-model="value" checked-children="开启" un-checked-children="关闭" />
          </a-form-item>
        </template>
        <template v-else-if="item.type==='key'">
          <a-form-item
            :label="item.cn"
            :label-col="item.labelCol||{lg: {span: 9}, sm: {span: 9}}"
            :wrapper-col="item.wrapperCol||{lg: {span: 10}, sm: {span: 17}}"
            has-feedback
          >
            <a-input
              v-model="value"
              style="width:80%;"
              :placeholder="'请输入'+item.cn"
            />
          </a-form-item>
        </template>
        <template v-else>
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :label="item.cn"
            has-feedback
          >
            <a-input-number
              v-model="value"
              :min="0"
              :max="100"
              style="width:80%;"
              :placeholder="'请输入'+item.cn"
              :formatter="value => `${value}${item.behind||''}`"
              :parser="value => value.replace(/%|元|小时|秒|天|日/, '')"
            />
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import wechatForm from '@/components/form/wechat_edit_form'
import { mapGetters } from 'vuex'

export default {
  name: 'Edit',
  components: { wechatForm },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      item: {},
      value: 0,
      id: 0,
      dis: true,

      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },

      // form
      formTitle: [
        {
          cn: '第三方阿里妈妈账户ID',
          en: 'alimama_account_id',
          type: 'key'
        },
        {
          cn: '第三方阿里妈妈app-key',
          en: 'alimama_app_key',
          type: 'key'
        },
        {
          cn: '第三方阿里妈妈app-密钥',
          en: 'alimama_app_secret',
          type: 'key'
        },
        {
          cn: '客服二维码永久素材ID',
          en: 'custom_service_image',
          type: 'key'
        },
        {
          cn: '多多客应用ID',
          en: 'ddk_app_id',
          type: 'key'
        },
        {
          cn: '多多客App密钥',
          en: 'ddk_app_secret',
          type: 'key'
        },
        {
          cn: '多多客应用-客户端ID',
          en: 'ddk_client_id',
          type: 'key'
        },
        {
          cn: '默认多多客pid',
          en: 'ddk_default_pid',
          type: 'key'
        },
        {
          cn: '拼多多返利比例',
          en: 'ddk_reward_rate',
          behind: '%'
        },
        {
          cn: '结算日',
          en: 'exchange_day',
          behind: '日',
          pre: '每月'
        },
        {
          cn: '单次提现最大金额',
          en: 'exchange_max_fee',
          behind: '元'
        },
        {
          cn: '邀请者所得佣金比例',
          en: 'friend_reward_rate',
          behind: '%'
        },
        {
          cn: '第三方淘宝账号key',
          en: 'isv_mama_key',
          type: 'key'
        },
        {
          cn: '第三方淘宝账号secret',
          en: 'isv_mama_secret',
          type: 'key'
        },
        {
          cn: '新用户免单是否开启',
          en: 'newuser_free_order',
          type: 'switch'
        },
        {
          cn: '新人免单金额限制',
          en: 'newuser_free_order_fee',
          behind: '分'
        },
        {
          cn: '新人免单报销金额',
          en: 'newuser_free_donate_fee',
          behind: '分'
        },
        {
          cn: '海报推广是否开启',
          en: 'poster_enable',
          type: 'switch'
        },
        {
          cn: '两次获取海报的最短时间间隔',
          en: 'poster_timelimit',
          behind: '秒'
        },
        {
          cn: '用户推广是否开启',
          en: 'newuser_free_donate_fee',
          type: 'switch'
        },
        {
          cn: '返利是否开启',
          en: 'reward_status',
          type: 'switch'
        },
        {
          cn: '开启淘宝相关功能',
          en: 'taobao_enable',
          type: 'switch'
        },
        {
          cn: '默认淘宝PID',
          en: 'tb_default_pid',
          type: 'key'
        },
        {
          cn: '淘宝返利比例',
          en: 'tb_reward_rate',
          behind: '%'
        },
        {
          cn: '临时pid回收时间限制',
          en: 'temp_pid_max_unuse_hours',
          behind: '小时'
        },
        {
          cn: '维易API-key',
          en: 've_key',
          type: 'key'
        },
        {
          cn: '维易API_session-key',
          en: 've_session_key',
          type: 'key'
        },
        {
          cn: '微信支付API-Key',
          en: 'wxpay_apikey',
          type: 'key'
        },
        {
          cn: '微信支付商户ID',
          en: 'wxpay_apikey',
          type: 'key'
        }
      ],
      formData: {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.id = this.$route.query.id
    this.getDetails()
  },
  methods: {
    // 获取系统设置
    getDetails() {
      const data = {
        'access-token': this.token, uniac_id: this.id
      }
      this.$get('admin/settings', data).then(res => {
        const obj = res.data
        obj.user_count = res.data.user_count[1]
        this.formData = obj
      })
    },

    // handler
    handleSubmit(value) {
      return false
    },
    handleeidt() {
      this.dis = !this.dis
    },
    showModel(item) {
      this.value = ''
      this.item = item
      const value = this.formData[item.en]
      this.value = (value === '' || value === '-' || value === undefined || value === null) ? 0 : value

      this.visible = true
    },
    handleOk(e) {
      this.confirmLoading = true
      const data = {
        uniac_id: this.id,
        data: {}
      }
      data.data[this.item.en] = this.value

      this.$post('/admin/settings', data)
        .then(res => {
          if (res.error === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg || '保存失败')
          }

          this.visible = false
          this.confirmLoading = false
          this.getDetails()
        })
        .catch(err => {
          this.$message.error(err.msg || '保存失败')
          this.visible = false
          this.confirmLoading = false
        })
    },

    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>
<style scoped>

  .text-align-left .ant-form-item-label{
    text-align: left;
  }
</style>
