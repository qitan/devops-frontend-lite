<template>
  <a-modal
    :title="`${model && model.id ? '编辑' : '新建'}IDC`"
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
        <a-form-item label="IDC名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入IDC名称！'}]}]" />
        </a-form-item>
        <a-form-item label="IDC别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入IDC别名！'}]}]" />
        </a-form-item>
        <a-form-item label="区域">
          <a-select :options="regionOptions" v-decorator="['region', {rules: [{required: true, message: '请选择区域！'}]}]"></a-select>
        </a-form-item>
        <a-form-item label="镜像仓库">
          <a-select :options="harborOptions" v-decorator="['repo', {rules: [{required: true, message: '请选择镜像仓库！'}]}]"></a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: 'IDC备注！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'region', 'contact', 'repo', 'type', 'config', 'desc', 'id']

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
      harborOptions: [],
      regionOptions: [],
      userOptions: {},
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
    this.getRegions()
    this.getHarbors()
  },
  methods: {
    getRegions (params) {
      this.$http.getRegionList(params).then(res => {
        this.regionOptions = res.data.items.map(item => (
          {
            label: item.alias,
            value: item.id
          }
        ))
      })
    },
    getHarbors (params) {
      this.$http.getIdcRepo(params).then(res => {
        this.harborOptions = res.data.map(item => (
          {
            label: item.name,
            value: item.id
          }
        ))
      })
    }
  }
}
</script>
