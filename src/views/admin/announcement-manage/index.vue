<template>
  <div class="user-page woj-full-height">
    <!-- todo 搜索栏(参考user-manage) -->

    <ElCard class="woj-table-card" shadow="never">
      <!-- 表格头部 -->
      <TableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData" />

      <!-- 表格 -->
      <Table
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </Table>
    </ElCard>
  </div>
  <div class="page-content mb-5">
    <ElForm ref="formRef" :rules="rules" :model="form" label-width="auto">
      <ElFormItem prop="title" label="公告标题" required>
        <ElInput
          v-model="form.title"
          placeholder="请输入公告标题..."
          maxlength="100"
          show-word-limit
        />
      </ElFormItem>

      <ElCard class="editor-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>MarkDown 编辑器</span>
            <div class="header-buttons">
              <ElButton size="small" @click="clearFullEditor">清空</ElButton>
              <ElButton size="small" @click="getFullEditorContent">获取内容</ElButton>
            </div>
          </div>
        </template>

        <WangEditor
          ref="fullEditorRef"
          v-model="form.content"
          placeholder="请输入内容，体验完整的编辑功能..."
          :exclude-keys="[]"
        />
      </ElCard>

      <div class="flex justify-end mt-6">
        <ElButton type="primary" size="large" :loading="submitting" @click="onSubmit" class="px-8">
          发布公告
        </ElButton>
      </div>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox, ElTag, FormInstance, FormRules } from 'element-plus'
  import {
    AnnouncementAddDTO,
    AnnouncementContentVO,
    AnnouncementControllerService,
    AnnouncementSearchDTO
  } from '@api/web'
  import WangEditor from '@/components/forms/wang-editor/index.vue'
  import { formatDate, useTable } from '@/hooks/core/useTable'
  import { fetchGetAnnouncementList } from '@/api/system-manage'
  import ButtonTable from '@/components/forms/button-table/index.vue'
  import { UserVO } from '@api/user'
  import { useI18n } from 'vue-i18n'
  import { loadingService } from '@utils/ui'
  import { HttpError } from '@utils/http/error'

  const { t } = useI18n()
  const fullEditorRef = ref()
  const submitting = ref(false)
  // 选中行
  const selectedRows = ref<AnnouncementContentVO[]>([])
  const formRef = ref<FormInstance>()

  const searchForm = ref<AnnouncementSearchDTO>({
    id: undefined,
    title: undefined
  })

  const form = ref<AnnouncementAddDTO>({
    title: '',
    content: ''
  })

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetAnnouncementList,
      apiParams: {
        ...searchForm.value
      },
      columnsFactory: () => [
        { type: 'index', width: 60, label: '序号' },
        {
          width: 190,
          label: 'id',
          prop: 'id'
        },
        {
          prop: 'title',
          label: '标题',
          minWidth: 250
        },
        {
          prop: 'createTime',
          label: '创建日期',
          width: 240,
          sortable: true,
          formatter: (row) => {
            return formatDate(row.createTime)
          }
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(ButtonTable, {
                type: 'edit',
                onClick: () => ((form.value.content = row.content), (form.value.title = row.title))
              }),
              h(ButtonTable, {
                type: 'delete',
                onClick: () => deleteAnnouncement(row)
              })
            ])
        }
      ]
    }
    // 数据处理
  })

  // todo
  const handleSearch = (params: Record<string, any>) => {
    Object.assign(searchParams, params)
    getData()
  }

  const rules = computed<FormRules>(() => ({
    title: [
      { required: true, message: t('views.announcement.rules.title'), trigger: 'blur' },
      { min: 2, max: 255, message: t('views.announcement.rules.titleSize'), trigger: 'blur' }
    ]
  }))

  const clearFullEditor = () => {
    ElMessageBox.confirm('确定要清空所有已编辑的内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      fullEditorRef.value?.clear()
      form.value.content = ''
      ElMessage.success('已清空')
    })
  }

  const handleSelectionChange = (selection: UserVO[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }

  const getFullEditorContent = () => {
    console.log('当前内容:', form.value.content)
    ElMessage.info('内容已同步至控制台')
  }

  const deleteAnnouncement = (row: AnnouncementContentVO) => {
    console.log(row.id)
  }

  const clearForm = () => {
    form.value.content = ''
    form.value.title = ''
  }

  const onSubmit = async () => {
    submitting.value = true

    try {
      const valid = await formRef.value.validate()
      if (!valid) return
      loadingService.showLoading()
      const res = await AnnouncementControllerService.addAnnouncement(form.value)
      if (res.code === 200) {
        ElMessage.success('发布成功')
        clearForm()
      } else {
        ElMessage.error(`错误: ${res.message}`)
      }
    } catch (error) {
      if (error instanceof HttpError) {
      } else {
      }
    } finally {
      submitting.value = false
      loadingService.hideLoading()
    }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;
  }

  .editor-card {
    margin-bottom: 24px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-buttons {
    display: flex;
    gap: 8px;
  }

  .preview-card {
    margin-bottom: 24px;
  }

  .preview-card h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  .content-preview {
    min-height: 200px;
    max-height: 300px;
    padding: 16px;
    overflow-y: auto;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }

  .content-preview :deep(h1),
  .content-preview :deep(h2),
  .content-preview :deep(h3) {
    margin: 16px 0 8px;
  }

  .content-preview :deep(p) {
    margin: 8px 0;
    line-height: 1.6;
  }

  .content-preview :deep(table) {
    margin: 16px 0;
  }

  .content-preview :deep(table th),
  .content-preview :deep(table td) {
    padding: 8px 12px;
  }

  .content-preview :deep(pre) {
    padding: 12px;
    margin: 16px 0;
    overflow-x: auto;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
  }

  .content-preview :deep(blockquote) {
    padding-left: 16px;
    margin: 16px 0;
    color: var(--el-text-color-regular);
    border-left: 4px solid var(--el-color-primary);
  }

  .usage-card :deep(.el-collapse-item__content) {
    padding-bottom: 16px;
  }

  .usage-card pre {
    padding: 16px;
    margin: 0;
    overflow-x: auto;
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
  }

  .usage-card pre code {
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  .toolbar-explanation h4 {
    margin: 0 0 16px;
    color: var(--el-text-color-primary);
  }

  .toolbar-explanation h5 {
    margin: 0 0 8px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  .toolbar-explanation ul {
    padding-left: 20px;
    margin: 8px 0 16px;
  }

  .toolbar-explanation ul li {
    margin: 4px 0;
    font-size: 13px;
    color: var(--el-text-color-regular);
  }

  .toolbar-explanation .note {
    margin: 8px 0 0;
    font-size: 12px;
    font-style: italic;
    color: var(--el-text-color-placeholder);
  }

  @media (width <= 768px) {
    .page-content {
      padding: 12px;
    }

    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch !important;
    }

    .header-buttons {
      justify-content: center;
    }

    .preview-card :deep(.el-col) {
      margin-bottom: 16px;
    }
  }
</style>
