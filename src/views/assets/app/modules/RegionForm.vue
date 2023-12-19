<template>
  <a-modal
    title="新建区域"
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
        <a-form-item label="区域名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入区域名称！'}]}]" />
        </a-form-item>
        <a-form-item label="区域别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入区域别名！'}]}]" />
        </a-form-item>
        <a-form-item label="时区">
          <a-input v-decorator="['extra.timezone', {rules: [{required: true, message: '请输入时区！'}]}]" />
        </a-form-item>
        <a-form-item label="图标">
          <a-input v-decorator="['extra.icon', {rules: [{required: true, message: '请选择图标！'}]}]" />
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['is_enable', {initialValue: model && model.is_enable === 1 ? true : false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: '区域描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'extra.timezone', 'extra.icon', 'is_enable', 'desc', 'id']

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
        { name: 'manager', position: 'manager', label: '区域', required: true },
        { name: 'developer', position: 'manager', label: '开发', required: false },
        { name: 'tester', position: 'op', label: '测试', required: false }
      ],
      userOptions: {},
      productOptions: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(this.model)
    })
  },
  methods: {
  }
}
</script>
