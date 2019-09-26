<template>
  <div>
    <a-card class="card" title="返利相关" :bordered="false">
      <a-form ref="message" :form="form" @submit="handleSubmit">
        <a-form-item
          label="余额提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入余额提示' }]}
            ]"
            name="BALANCE"
            rows="5"
            default-value="                                一一一一 账 户 信 息 一一一一
◆未收货：￥{未收货返利}
[下单]>[收货]>[次月结算]
收到包裹记得点 [确认收货] 哦~
◆已收货：￥{已收货返利}
上月已确认收货的返利金
将在本月22号结算到您的
『微信钱包』中
一一一一一一
●累计返利：￥{总奖金}
●已结算返利：￥{已结算返利}
一一一一一一
●未收货订单：{未收货} 单
●已收货订单：{已收货} 单
●总成功订单：{成功订单数} 单
一一一一一一
♥好友数量：{好友数量}人
♥好友购物奖金：￥{好友奖金}

回复【邀请】去邀请好友吧~
                            "
          />
        </a-form-item>
        <a-form-item
          label="未开启自动提现提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入未开启自动提现提示' }]}
            ]"
            name="EXCHANGE_NOT_AVALIABLE"
            rows="5"
            default-value="                                一一一一 温 馨 提 醒 一一一一

自动提现暂未开启
请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="card" title="查券相关" :bordered="false">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="没有优惠券提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入没有优惠券提示' }]}
            ]"
            name="PDD_QUERY_COUPON_NO"
            rows="5"
            default-value="抱歉，该商品暂未参加任何推广活动，可以回复关键词搜索你想要的商品例如：查拖鞋"
          />
        </a-form-item>
        <a-form-item
          label="拼多多查券成功提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入拼多多查券成功提示' }]}
            ]"
            name="PDD_QUERY_OK"
            rows="5"
            default-value="●返利 {奖金}元
●券后 {券后价}元
●原价 {价格}元
●优惠 {优惠}元优惠券
一一一一一一一一一一一一
<a href=&quot;{商品链接}&quot;>{商品标题} <br>【点我去抢券】</a>
一一一一一一一一一一一一
▶点击上方商品标题
▶用券抢购，下单
▶系统自动绑定订单
3分钟内未收到绑定提醒？
请在进入底部【我的返利】联系客服,为您手动绑定
                            "
          />
        </a-form-item>
        <a-form-item
          label="查券失败提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入查券失败提示' }]}
            ]"
            name="QUERY_TAOCODE_FAIL"
            rows="5"
            default-value="发淘口令或者发标题查~
————
淘口令获取教程如下

点淘寶标题右边的分享二字→选择微信分享→粘贴淘口令给我
————
系统自动回复，其它问题请点击〔帮助中心〕联系人工客服。↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="无优惠券提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入无优惠券提示' }]}
            ]"
            name="QUERY_TAOCODE_NO"
            rows="5"
            default-value="                                ◇ ◇ ◇ 该商品无优惠 ◇ ◇ ◇

这个产品商家未给任何优惠。
--------
商品搜索举例：查袜子女
                            "
          />
        </a-form-item>
        <a-form-item
          label="未开启返利提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入未开启返利提示' }]}
            ]"
            name="REWARD_DISABLE"
            rows="5"
            default-value="                                一一一一  系 统 提 示  一一一一

系统返利暂未启用，如有疑问请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="淘宝客查券成功提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入淘宝客查券成功提示' }]}
            ]"
            name="TAOBAO_CODE_OK"
            rows="5"
            default-value="{标题}
一一一一一一一一一一一一
【原 价】:¥{原价}元
【付 费】:¥{付费}元
【优 惠】:{优惠}优惠券
【返 利】:¥{奖金}元
【会员奖励】:¥{会员奖励}元
【口 令】:{口令}
一一一一一一一一一一一一
 复制信息 -> 打开淘寳
                            "
          />
        </a-form-item>
        <a-form-item
          label="未知文本提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入未知文本提示' }]}
            ]"
            name="UNKNOW"
            rows="5"
            default-value="查券方式不对
输入：查**，即可查券
————
系统自动回复，其它问题可点击菜单联系人工客服。
                            "
          />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="card" title="推广相关" :bordered="false">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="海报正在生成提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入海报正在生成提示' }]}
            ]"
            name="BALANCE"
            rows="5"
            default-value="您的专属海报正在生成中……
一一一一一一一一
本海报有效期{时间}天，过期后请重新回复「推广」获取。
                            "
          />
        </a-form-item>
        <a-form-item
          label="海报获取成功提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入海报获取成功提示' }]}
            ]"
            name="POSTER_OK"
            rows="5"
            default-value="                                一一一一 系 统 提 示 一一一一

推广海报获取成功
海报有效期截至：
{截止时间}
请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="获取过于频繁提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入获取过于频繁提示' }]}
            ]"
            name="POSTER_TIME_LIMIT"
            rows="5"
            default-value="                                一一一一 系 统 提 示 一一一一

获取推广海报过于频繁
请稍后重试
请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="推广成功提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入推广成功提示' }]}
            ]"
            name="PROMOTION"
            rows="5"
            default-value="你的好友 #{好友}# 通过海报关注了公众号

好友每完成一个订单你都可以获得奖金
该奖金是系统发放的额外奖励
不会影响好友的返利。
                            "
          />
        </a-form-item>
        <a-form-item
          label="推广未开启提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入推广未开启提示' }]}
            ]"
            name="PROMOTION_DISABLE"
            rows="5"
            default-value="                                一一一一 系 统 提 示 一一一一

海报推广暂未开启
请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="card" title="系统相关" :bordered="false">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="账户锁定提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入账户锁定提示' }]}
            ]"
            name="ACCOUNT_DISABLE"
            rows="5"
            default-value="                                一一一一 温 馨 提 醒 一一一一

您的账户已被锁定，如有疑问请点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="系统维护提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入系统维护提示' }]}
            ]"
            name="DEVELOPING"
            rows="5"
            default-value="                                一一一一 温 馨 提 醒 一一一一

系统维护中，将上即线
                            "
          />
        </a-form-item>
        <a-form-item
          label="系统错误提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入系统错误提示' }]}
            ]"
            name="ERROR"
            rows="5"
            default-value="                                一一一一 温 馨 提 醒 一一一一

系统异常，点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="被禁止的访问提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入被禁止的访问提示' }]}
            ]"
            name="FORBIDEN"
            rows="5"
            default-value="                                一一一一 温 馨 提 醒 一一一一

系统异常，点击〔帮助中心〕联系客服↘↘
                            "
          />
        </a-form-item>
        <a-form-item
          label="常用指令提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入常用指令提示' }]}
            ]"
            name="HELP_OFTEN_CODE"
            rows="5"
            default-value="                                在公众号对话框发送以下指令：
——————
发送【提现】申请奖金提现；
发送【绑定】订单号拿奖金；
发送【余额】查看返利明细；
发送【推广】邀好友赚奖金；
发送【订单】查询订单明细；
发送【查**】模糊搜索查券，比如发送：查袜子
——————
小提示：发送关键词指令不能出现错别字，也不能有空格，否则无法正常召唤相应功能~
                            "
          />
        </a-form-item>
        <a-form-item
          label="会员功能介绍"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入会员功能介绍' }]}
            ]"
            name="HELP_VIP_REWARD"
            rows="5"
            default-value="暂未开启！"
          />
        </a-form-item>
        <a-form-item
          label="关注回复"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入关注回复' }]}
            ]"
            name="SUBSCRIBE"
            rows="5"
            default-value="即刻下单，体验高额返利！
省多多！返多多！"
          />
        </a-form-item>
        <a-form-item
          label="临时PID不足提示"
        >
          <a-textarea
            v-decorator="[
              'description',
              {rules: [{ required: true, message: '请输入临时PID不足提示' }]}
            ]"
            name="TAOBAO_PID_NOT_ENOUGH"
            rows="5"
            default-value="                                一一一一  系 统 提 示  一一一一

错误：
没有找到你的 淘|寳 账号！
可能无法同步您在 淘|寳 的订单！
无法为你发放购物奖金！

解决办法：
1，您的 手机淘寳 中
2，复制任意一个你购买过商品订单号
3，在发送到公众号中
                            "
          />
        </a-form-item>
      </a-form>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button type="primary" :loading="loading" @click="validate">
        提交
      </a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'MessageForm',
  components: {
    FooterToolBar
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
      loading: false,

      // table
      columns: [
        {
          title: '成员姓名',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '工号',
          dataIndex: 'workId',
          key: 'workId',
          width: '20%',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '所属部门',
          dataIndex: 'department',
          key: 'department',
          width: '40%',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '小明',
          workId: '001',
          editable: false,
          department: '行政部'
        },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部'
        }
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    newMember() {
      this.data.push({
        key: '-1',
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
    },
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },

    // 最终全页面提交
    validate() {
      this.$refs.message.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
</style>
