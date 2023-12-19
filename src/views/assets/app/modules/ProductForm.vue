<template>
  <a-modal
    title="新建产品"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="产品名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入产品名称！'}]}]" />
        </a-form-item>
        <a-form-item label="产品别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入产品别名！'}]}]" />
        </a-form-item>
        <a-form-item label="产品负责人">
          <a-select :options="userOptions.manager" v-decorator="[`managers.product`, {rules: [{required: false, message: `请选择产品负责人！`}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="技术负责人">
          <a-select :options="userOptions.manager" v-decorator="[`managers.develop`, {rules: [{required: false, message: `请选择技术负责人！`}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: '产品描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['managers.product', 'managers.develop', 'name', 'alias', 'desc', 'id']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      posMap: [
        { name: 'product', position: 'manager', label: '产品', required: false },
        { name: 'develop', position: 'manager', label: '技术', required: false }
      ],
      userOptions: {},
      productOptions: [],
      form: this.$form.createForm(this)
    }
  },
  async created () {
    console.log('custom modal created', this.model)
    await this.getPositionUser('manager')
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(this.model)
    })
  },
  methods: {
    // 获取用户人员
    async getPositionUser (role) {
      await this.$http.getPositionUser({ position: role === 'manager' ? null : role })
        .then(res => {
          const users = res.data.map(item => (
            {
              label: item.name,
              value: item.id
          }
          ))
          this.userOptions[role] = users
        })
    }
  }
}
</script>
