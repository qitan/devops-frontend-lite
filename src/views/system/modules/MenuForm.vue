<template>
  <a-modal
    :title="`${model && model.id ? '编辑' : '新建'}菜单`"
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
        <a-form-item label="菜单名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入菜单名称！'}]}]" />
        </a-form-item>
        <a-form-item label="显示名称">
          <a-input v-decorator="['title', {rules: [{required: true, message: '请输入菜单别名！'}]}]" />
        </a-form-item>
        <a-form-item label="图标">
          <a-input v-decorator="['icon', {rules: [{required: false, message: '请输入菜单图标！'}]}]" />
        </a-form-item>
        <a-form-item label="路由地址">
          <a-input v-decorator="['path', {rules: [{required: false, message: '请输入路由地址！'}]}]" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number
          v-decorator="['sort', {initialValue: 999}, {rules: [{required: false, message: '请输入排序！'}]}]" />
        </a-form-item>
        <a-form-item label="固定标签">
          <a-switch v-decorator="['affix', {initialValue: model && model.affix || false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="单开标签">
          <a-switch v-decorator="['single', {initialValue: model && model.single || false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="外部菜单">
          <a-switch v-decorator="['is_frame', {initialValue: model && model.outside || false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="是否隐藏">
          <a-switch v-decorator="['hidden', {initialValue: model && model.hidden || false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="默认展开">
          <a-switch v-decorator="['spread', {initialValue: model && model.defaultExpand || false, valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item label="菜单组件">
          <a-input
          v-decorator="['component', {rules: [{required: false, message: '请输入菜单组件！'}]}]" />
        </a-form-item>
        <a-form-item label="激活菜单路径">
          <a-input
          v-decorator="['activeMenu', {rules: [{required: false, message: '请输入激活菜单路径！'}]}]" />
        </a-form-item>
        <a-form-item label="父级菜单">
          <a-tree-select
          v-decorator="['parent', {rules: [{required: false, message: '请选择父级菜单！'}]}]"
          :tree-data="menus"
          :field-names="{children: 'children', label: 'name', value: 'id'}"
          tree-node-filter-prop="name"  />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'title', 'path', 'sort', 'hidden', 'component', 'parent', 'activeMenu', 'spread', 'is_frame', 'icon', 'single', 'affix', 'id']

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
    menus: {
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
        { name: 'manager', position: 'manager', label: '菜单', required: true },
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
    console.log('tree menus', this.menus)
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
            label: item.title,
            value: item.id
          }
        ))
      })
    }
  }
}
</script>
