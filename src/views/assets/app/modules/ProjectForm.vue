<template>
  <a-modal
    title="新建项目"
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
        <a-form-item label="项目名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入项目名称！'}]}]" />
        </a-form-item>
        <a-form-item label="项目别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入项目别名！'}]}]" />
        </a-form-item>
        <a-form-item v-for="(pos, idx) in posMap" :key="pos.name+idx" :label="`${pos.label}负责人`">
          <a-select :options="userOptions[pos.position]" v-decorator="[pos.name, {rules: [{required: pos.required, message: `请选择${pos.label}负责人！`}]}]">
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="项目负责人">
          <a-select :options="userOptions.manager" v-decorator="['manager', {rules: [{required: true, message: '请选择项目负责人！'}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="开发负责人">
          <a-select :options="userOptions.op" v-decorator="['developer', {rules: [{required: true, message: '请选择开发负责人！'}]}]">
          </a-select>
        </a-form-item> -->
        <a-form-item label="产品">
          <a-select :options="productOptions" v-decorator="['product', {rules: [{required: true, message: '请选择产品！'}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: '项目描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'manager', 'developer', 'tester', 'product', 'desc', 'id']

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
        { name: 'manager', position: 'manager', label: '项目', required: true },
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

    this.getPositionUser('manager')
    this.getPositionUser('op')
    this.getProductList()

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
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
    },
    // 获取产品
    getProductList () {
      this.$http.getProductList().then(res => {
        this.productOptions = res.data.items.map(item => (
          {
            label: item.alias,
            value: item.id
          }
        ))
      })
    }
  }
}
</script>
