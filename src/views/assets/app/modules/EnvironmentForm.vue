<template>
  <a-modal
    title="新建环境"
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
        <a-form-item label="环境名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入环境名称！'}]}]" />
        </a-form-item>
        <a-form-item label="环境别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入环境别名！'}]}]" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-decorator="['sort', {initialValue: 999}]" />
        </a-form-item>
        <a-form-item label="启用工单">
          <a-switch v-decorator="['ticket_on', {initialValue: model && model.ticket_on === 1 ? true : false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: '环境描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'extra.timezone', 'extra.icon', 'ticket_on', 'desc', 'id']

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
        { name: 'manager', position: 'manager', label: '环境', required: true },
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
      // this.model && this.form.setFieldsValue(pick(this.model, fields))
      // this.model.ticket_on = this.model.ticket_on === 1 || false
      this.model && this.form.setFieldsValue(this.model)
    })
  },
  methods: {
  }
}
</script>
