<template>
  <page-header-wrapper>
    <a-card :bordered="false">
    <div class="table-page-search-wrapper">
        <a-form layout="inline">
        <a-row :gutter="48">
            <a-col :md="8" :sm="24">
            <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item label="别名">
                <a-input-number v-model="queryParam.alias" style="width: 100%"/>
                </a-form-item>
            </a-col>
            <template v-if="advanced">
            <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                </a-select>
                </a-form-item>
            </a-col> -->
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
            </span>
            </a-col>
        </a-row>
        </a-form>
    </div>

    <div class="table-operator">
        <a-button v-action="['admin']" type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="onExtraClick">
            <a-menu-item v-action="['admin']" key="delete"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
        </a-button>
        </a-dropdown>
    </div>

    <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
    >
        <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
        </span>
        <span slot="ticket_on" slot-scope="text">
        <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        <a-switch :checked="text === 1 ? true : false" :disabled="true"></a-switch>
        </span>
        <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
        <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
        </template>
        </span>
    </s-table>

    <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
    />
    <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/DevLanguageForm'

const columns = [
// {
//     title: '#',
//     scopedSlots: { customRender: 'serial' }
// },
{
    title: 'ID',
    dataIndex: 'id'
},
{
    title: '名称',
    dataIndex: 'name'
},
{
    title: '别名',
    dataIndex: 'alias',
    scopedSlots: { customRender: 'alias' }
},
{
    title: '基础镜像',
    dataIndex: 'base_image'
},
{
    title: '构建命令',
    dataIndex: 'build'
},
{
    title: '描述',
    dataIndex: 'desc',
    scopedSlots: { customRender: 'desc' }
},
{
    title: '更新时间',
    dataIndex: 'update_time',
    sorter: true
},
{
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
}
]

const statusMap = {
0: {
    status: 'default',
    text: '关闭'
},
1: {
    status: 'processing',
    text: '运行中'
},
2: {
    status: 'success',
    text: '已上线'
},
3: {
    status: 'error',
    text: '异常'
}
}

export default {
name: 'TableList',
components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
},
data () {
    this.columns = columns
    return {
    // create model
    visible: false,
    confirmLoading: false,
    mdl: null,
    // 高级搜索 展开/关闭
    advanced: false,
    // 查询参数
    queryParam: {},
    // 加载数据方法 必须为 Promise 对象
    loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return this.$http.getDevLanguageList(requestParameters)
        .then(res => {
            return res.data
        })
    },
    selectedRowKeys: [],
    selectedRows: []
    }
},
filters: {
    statusFilter (type) {
    return statusMap[type].text
    },
    statusTypeFilter (type) {
    return statusMap[type].status
    }
},
created () {
    this.$http.getRoleList({ t: new Date() })
},
computed: {
    rowSelection () {
    return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
    }
    }
},
methods: {
    // 批量操作
    onExtraClick ({ key }) {
        console.log('批量操作', key, this.selectedRowKeys, this.selectedRows)
        if (key === 'delete') {
            const ids = this.selectedRows.map(item => item.id)
            this.handleDel(ids)
        }
    },
    handleAdd () {
    this.mdl = null
    this.visible = true
    },
    handleEdit (record) {
    this.visible = true
    this.mdl = { ...record, ticket_on: record.ticket_on === 1 || false }
    },
    handleOk () {
    const form = this.$refs.createModal.form
    this.confirmLoading = true
    form.validateFields((errors, values) => {
        if (!errors) {
        console.log('values', values)
        values = { ...values, ticket_on: values.ticket_on ? 1 : 0, base_image: { project: values.Vproject, image: values.Vimage, tag: values.Vtag } }
        if (values.id > 0) {
            // 修改 e.g.
            this.$http.patchDevLanguage(values).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('修改成功')
            })
        } else {
            // 新增
            this.$http.createDevLanguage(values).then(res => {
                this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('新增成功')
            })
        }
        } else {
        this.confirmLoading = false
        }
    })
    },
    handleCancel () {
    this.visible = false

    const form = this.$refs.createModal.form
    form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) {
      this.$http.deleteDevLanguage(record).then(res => {
        if (res.code === 20000) {
            this.$message.info(`${record[0] ? '批量' : record.name} 删除成功`)
            this.$refs.table.refresh()
        } else {
            this.$message.error(`${record[0] ? '批量' : record.name} 删除失败`)
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
    this.selectedRowKeys = selectedRowKeys
    this.selectedRows = selectedRows
    },
    toggleAdvanced () {
    this.advanced = !this.advanced
    },
    resetSearchForm () {
    this.queryParam = {
        date: moment(new Date())
    }
    }
  }
}
</script>
