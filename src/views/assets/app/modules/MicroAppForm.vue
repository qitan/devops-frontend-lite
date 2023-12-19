<template>
  <a-modal
    title="新建应用"
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
        <a-form-item label="应用名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入应用名称！'}]}]" />
        </a-form-item>
        <a-form-item label="应用别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入应用别名！'}]}]" />
        </a-form-item>
        <a-form-item label="应用类型">
          <a-radio-group v-decorator="['category', {initialValue: 1, rules: [{required: true, message: '请选择应用类型！'}]}]">
            <a-radio v-for="(cate, index) in categoryList" :key="`${cate.key}-${index}`" :value="cate.key">{{ cate.value }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="项目">
          <a-select :options="projectOptions" v-decorator="['project', {rules: [{required: true, message: '请选择项目！'}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 5, message: '应用描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'category', 'language', 'is_k8s', 'project', 'desc', 'id']

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
    },
    categoryList: {
      type: Array,
      default: () => []
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
        { name: 'manager', position: 'manager', label: '应用', required: true },
        { name: 'developer', position: 'dev', label: '开发', required: false },
        { name: 'tester', position: 'op', label: '测试', required: false }
      ],
      userOptions: {},
      projectOptions: [],
      form: this.$form.createForm(this)
    }
  },
  watch: {
    categoryList: {
      immediate: true,
      handler (val) {
        if (val[0]) {
          this.form.setFieldsValue({ category: val[0].key })
        }
      }
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
    this.getPositionUser('manager')
    this.getPositionUser('op')
    this.getProjectList()
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
    getProjectList () {
      this.$http.getProjectList().then(res => {
        this.projectOptions = res.data.items.map(item => (
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
