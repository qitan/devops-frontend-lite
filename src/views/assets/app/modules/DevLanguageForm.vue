<template>
  <a-modal
    title="新建开发语言"
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
        <a-form-item label="开发语言名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入开发语言名称！'}]}]" />
        </a-form-item>
        <a-form-item label="开发语言别名">
          <a-input v-decorator="['alias', {rules: [{required: true, message: '请输入开发语言别名！'}]}]" />
        </a-form-item>
        <a-form-item label="基础镜像">
          <a-select @change="getProjectImages" v-decorator="['Vproject', {rules: [{required: false, message: '请选择项目！'}]}]" style="width: 100%">
            <a-select-option v-for="(item, index) in harborObjs.projects" :key="item.name + index" :value="item.project_id">
            {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :colon="false">
          <a-select @change="getImageTags" v-decorator="['Vimage', {rules: [{required: false, message: '请选择镜像！'}]}]" style="width: 100%">
            <a-select-option v-for="(item, index) in harborObjs.repos" :key="item.name + index" :value="item.name">
            {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " :colon="false">
          <a-select v-decorator="['Vtag', {rules: [{required: false, message: '请选择标签！'}]}]" style="width: 100%">
            <a-select-option v-for="(item, index) in harborObjs.tags" :key="index" :value="item.name">
            {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['desc', {rules: [{required: false, min: 2, message: '开发语言描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import pick from 'lodash.pick'
// import { getPositionUser } from '@/api/manage'

// 表单字段
const fields = ['name', 'alias', 'Vproject', 'Vimage', 'Vtag', 'desc', 'id']

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
        { name: 'manager', position: 'manager', label: '开发语言', required: true },
        { name: 'developer', position: 'manager', label: '开发', required: false },
        { name: 'tester', position: 'op', label: '测试', required: false }
      ],
      userOptions: {},
      productOptions: [],
      form: this.$form.createForm(this),
      harborObjs: {},
      seletedProject: {}
    }
  },
  watch: {
    // model: {
    //   handler(newVal) {
    //     if (newVal) {
    //       this.form.setFieldsValue(newVal);
    //     }
    //   },
    //   immediate: true
    // }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', (newVal) => {
      if (newVal) {
        fields.forEach(field => {
          if (field.startsWith('V')) this.form.setFieldsValue({ [field]: this.model.base_image[field.split('V')[1]] })
          else if (this.form.getFieldValue(field) !== this.model[field]) {
            this.form.setFieldsValue({ [field]: this.model[field] })
          }
        })
      }
    }, { immediate: true })
    this.getHarborProjects('projects')
  },
  methods: {
    async getImageTags (val) {
      try {
        const res = await this.$http.getHarborResource({
          type: 'tags',
          image: val,
          project_id: this.seletedProject[0]?.id,
          project_name: this.seletedProject[0]?.name
        })
        this.$set(this.harborObjs, 'tags', res.data || [])
        // this.form.setFieldsValue({ base_image: { tag: res.data[0]?.name || '' } })
        this.form.setFieldsValue({ Vtag: res.data[0]?.name || '' })
      } catch (error) {
        console.error('Error fetching image tags:', error)
        // 处理错误，例如显示提示或者回滚操作
      }
    },
    async getProjectImages (val) {
      this.seletedProject = this.harborObjs.projects.filter(item => item.project_id === val)
      try {
        const res = await this.$http.getHarborResource({
          type: 'repos',
          project_id: val,
          project_name: this.seletedProject[0]?.name
        })
        this.$set(this.harborObjs, 'repos', res.data || [])
        // this.form.setFieldsValue({ base_image: { image: res.data[0]?.name || '', tag: '' } })
        this.form.setFieldsValue({ Vimage: res.data[0]?.name || '' })
        if (res.data[0]) {
          await this.getImageTags(res.data[0].name)
        }
      } catch (error) {
        console.error('Error fetching project images:', error)
        // 处理错误，例如显示提示或者回滚操作
      }
    },
    getHarborProjects (type) {
      this.$http.getHarborResource({ type }).then(res => {
        this.harborObjs[type] = res.data || []
      })
    }
  }
}
</script>
