<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="淘宝返利比例">
            <a-input-number :default-value="40" :min="0" :max="100" :formatter="value => `${value} %`" :parser="value => value.replace(' %', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="拼多多返利比例">
            <a-input-number :default-value="40" :min="0" :max="100" :formatter="value => `${value} %`" :parser="value => value.replace(' %', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="每日提现次数限制">
            <a-input-number :default-value="20" :min="0" :formatter="value => `${value} 次`" :parser="value => value.replace(' 次', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="提现时间频率限制">
            <a-input-number :default-value="60" :min="0" :formatter="value => `${value} 秒`" :parser="value => value.replace(' 秒', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="单次提现最大金额">
            <a-input-number :default-value="100" :min="0" :formatter="value => `${value} 元`" :parser="value => value.replace(' 元', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="每日提现总额限制">
            <a-input-number :default-value="100" :min="0" :formatter="value => `${value} 元`" :parser="value => value.replace(' 元', '')" @change="onChange" />
          </a-form-item>
          <a-form-item label="近期提现限制">
            <a-input addon-before="每" addon-after="秒" @change="onChange" />
            <a-input addon-before="最多提现" addon-after="元" @change="onChange" />
          </a-form-item>
          <a-form-item label="第三方阿里妈妈账号设置">
            <a-input addon-before="key" default-value="" />
            <a-input addon-before="secret" default-value="" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary">
              提交
            </a-button>
            <a-button style="margin-left: 8px">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <avatar-modal ref="modal" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      value: 3
    }
  },
  methods: {
    onChange(e) {
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.value = value
      }
    }
  }
}

</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
