<template>
  <div class="user-page woj-full-height">
    <!-- 搜索栏 -->
    <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams" />

    <ElCard class="woj-table-card" shadow="never">
      <!-- 表格头部 -->
      <TableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增用户</ElButton>
          </ElSpace>
        </template>
      </TableHeader>

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

      <!-- 用户弹窗 -->
      <UserDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { formatDate, useTable } from '@/hooks/core/useTable'
  import { fetchGetUserList } from '@/api/system-manage'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'
  import { ElTag, ElMessageBox, ElImage } from 'element-plus'
  import { DialogType } from '@/types'
  import { AdminControllerService, UserAdminVO, UserSearchDTO, UserVO } from '@api/user'
  import ButtonTable from '@/components/forms/button-table/index.vue'
  import { useI18n } from 'vue-i18n'
  import { loadingService } from '@utils/ui'

  defineOptions({ name: 'User' })

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<UserAdminVO>>({})

  const { t } = useI18n()

  // 选中行
  const selectedRows = ref<UserVO[]>([])

  // 搜索表单
  const searchForm = ref<UserSearchDTO>({
    id: undefined,
    userAccount: undefined,
    userName: undefined,
    school: undefined,
    number: undefined,
    gender: undefined,
    isDelete: undefined
  })

  // 用户状态配置
  const USER_STATUS_CONFIG = {
    '0': { type: 'success' as const, text: '正常' },
    '1': { type: 'danger' as const, text: '注销' }
  } as const

  /**
   * 获取用户状态配置
   */
  const getUserStatusConfig = (status: number) => {
    return (
      USER_STATUS_CONFIG[status.toString() as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

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
      apiFn: fetchGetUserList,
      apiParams: {
        ...searchForm.value
      },
      columnsFactory: () => [
        { type: 'selection' }, // 勾选列
        { type: 'index', width: 60, label: '序号' },
        {
          width: 190,
          label: 'id',
          prop: 'id'
        },
        {
          prop: 'name',
          label: '用户名',
          width: 250,
          // visible: false, // 默认是否显示列
          formatter: (row) => {
            return h('div', { class: 'user flex-c' }, [
              h(ElImage, {
                class: 'size-9.5 rounded-md',
                src: row.avatar!,
                previewSrcList: [row.avatar!],
                // 图片预览是否插入至 body 元素上，用于解决表格内部图片预览样式异常
                previewTeleported: true
              }),
              h('div', { class: 'ml-2' }, [
                h('p', { class: 'user-name' }, row.name),
                h('p', { class: 'email' }, row.account)
              ])
            ])
          }
        },
        {
          prop: 'gender',
          label: '性别',
          sortable: true,
          formatter: (row) => {
            const genderMap = ['未知', '男', '女']
            return genderMap[row.gender!]
          }
        },
        {
          prop: 'school',
          label: '学校',
          sortable: true
        },
        {
          prop: 'number',
          label: '学号',
          sortable: true
        },
        {
          prop: 'isDelete',
          label: '状态',
          formatter: (row) => {
            const statusConfig = getUserStatusConfig(row.isDelete!)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'createTime',
          label: '创建日期',
          minWidth: 120,
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
                onClick: () => showDialog('edit', row)
              }),
              h(ButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    }
  })

  const handleSearch = (params: Record<string, any>) => {
    Object.assign(searchParams, params)
    getData()
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: UserAdminVO): void => {
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const deleteUser = async (row: UserAdminVO) => {
    if (row == undefined || row.id == undefined) {
      return
    }

    try {
      await ElMessageBox.confirm(
        t('message.deleteUserTips'), // 登出提示文案
        t('message.tips'), // 弹窗标题
        {
          confirmButtonText: t('message.confirm'),
          cancelButtonText: t('message.cancel'),
          type: 'error'
        }
      )

      loadingService.showLoading()

      const res = await AdminControllerService.deleteUserByid(row.id)

      if (res.code === 200) {
        ElMessage.success(t('message.success.delete'))
      } else {
        ElMessage.error(res.message)
      }
    } catch (error) {
    } finally {
      loadingService.hideLoading()
    }
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  const handleSelectionChange = (selection: UserVO[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>
