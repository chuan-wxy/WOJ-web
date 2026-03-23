<template>
  <div class="woj-full-height">
    <ProblemSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams" />

    <ElCard class="woj-table-card" shadow="never">
      <TableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="toAdd" v-roles="['root']" v-ripple>新增题目</ElButton>
          </ElSpace>
        </template>
      </TableHeader>

      <Table
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </Table>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ProblemTitleVO } from '@/openapi/web'
  import { ElMessage, ElTag } from 'element-plus'
  import ProblemSearch from '@views/problem/problem-list/modules/problem-search.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetProblemTitleList } from '@/api/system-manage'
  import ButtonTable from '@/components/forms/button-table/index.vue'
  import { useUser } from '@/hooks/core/userUser'

  const { hasRole } = useUser()

  const router = useRouter()

  const searchForm = ref({
    id: undefined,
    problemId: undefined,
    title: undefined,
    author: undefined,
    source: undefined,
    difficulty: undefined
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
      apiFn: fetchGetProblemTitleList,
      apiParams: {
        ...searchForm.value
      },
      columnsFactory: () => [
        { prop: 'problemId', width: 90, label: 'Id' },
        {
          prop: 'title',
          label: '题目',
          width: 90
        },
        {
          prop: 'author',
          label: '作者',
          width: 100
        },
        {
          prop: 'source',
          label: '来源',
          width: 110
        },
        {
          prop: 'tagList',
          label: '标签',
          minWidth: 120,
          formatter: (row) => {
            const list = row.tagList
            if (!list) return
            return h('div', { style: 'display: flex; gap: 8px;' }, [
              ...list.map((item: string) => h(ElTag, { type: 'success', key: item }, () => item))
            ])
          }
        },
        {
          prop: 'difficulty',
          label: '难度',
          sortable: true,
          width: 85,
          formatter: (row) => {
            const statusConfig = getDifficultyConfig(row.difficulty!)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'operation',
          label: '操作',
          width: 160,
          fixed: 'right', // 固定列
          formatter: (row) => {
            const buttons = []

            if (hasRole('root')) {
              buttons.push(
                h(ButtonTable, {
                  type: 'edit',
                  onClick: () => toEdit(row)
                })
              )
              buttons.push(
                h(ButtonTable, {
                  type: 'delete',
                  onClick: () => deleteProblem(row)
                })
              )
            }
            buttons.push(
              h(ButtonTable, {
                type: 'view',
                onClick: () => toDetail(row)
              })
            )
            return h('div', buttons)
          }
        }
      ]
    }
  })

  const handleSearch = (params: Record<string, any>) => {
    Object.assign(searchParams, params)
    getData()
  }

  const DIFFICULTY_STATUS_CONFIG = {
    '0': { type: 'success' as const, text: '简单' },
    '1': { type: 'warning' as const, text: '中等' },
    '2': { type: 'danger' as const, text: '困难' }
  } as const

  const getDifficultyConfig = (status: number) => {
    return (
      DIFFICULTY_STATUS_CONFIG[status.toString() as keyof typeof DIFFICULTY_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const deleteProblem = async (row: ProblemTitleVO) => {
    // todo 删除Problem
    ElMessage.success('待开发')
  }

  // todo 通过题目标签查找
  // const getTagList = async () => {
  //   const res = await ProblemControllerService.getProblemTagList()
  //   if (res.code === 200 && res.data != null) {
  //     tagList.value = res.data
  //   } else {
  //     ElMessage.error('获取题目标签失败')
  //   }
  // }
  const toAdd = () => {
    router.push({ name: 'ProblemManage', replace: true })
  }

  const toDetail = (item: ProblemTitleVO) => {
    router.push({ name: 'ProblemDetail', params: { id: String(item.id) } })
  }

  const toEdit = (item: ProblemTitleVO) => {
    router.push({ name: 'ProblemManage', query: { id: item.id } })
  }
</script>
<style scoped>
  h2 {
    text-align: center;
  }

  hr {
    color: #aaaaaa;
    margin-top: 32px;
  }

  .panel-body {
    padding: 2px;
  }
</style>
