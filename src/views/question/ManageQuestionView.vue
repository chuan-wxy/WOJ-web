<template>
  <div class="page-content mb-5">
    <ElCard shadow="never">
      <div class="question-toolbar">
        <ElInput
          v-model="searchValue"
          clearable
          placeholder="搜索题目"
          class="question-search"
          @keyup.enter="listPage"
          @clear="listPage"
        />
        <ElButton type="primary" @click="listPage">搜索</ElButton>
      </div>

      <ElTable v-loading="loading" :data="data" border>
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="problemId" label="题号" width="100" />
        <ElTableColumn prop="title" label="题目" min-width="180" />
        <ElTableColumn prop="author" label="作者" width="120" />
        <ElTableColumn prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <ElTag :type="getDifficultyType(row.difficulty)">
              {{ getDifficultyText(row.difficulty) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="tagList" label="标签" min-width="180">
          <template #default="{ row }">
            <ElSpace wrap>
              <ElTag v-for="tag in row.tagList || []" :key="tag" type="success">
                {{ tag }}
              </ElTag>
            </ElSpace>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <ElButton link type="primary" @click="toDetail(row)">查看</ElButton>
            <ElButton link type="warning" @click="toUpdate(row)">编辑</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="question-pagination">
        <ElPagination
          v-model:current-page="query.current"
          v-model:page-size="query.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="listPage"
          @current-change="listPage"
        />
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ProblemControllerService, ProblemSearchDTO, ProblemTitleVO } from '@api/web'

  const router = useRouter()
  const loading = ref(false)
  const total = ref(0)
  const searchValue = ref('')
  const data = ref<ProblemTitleVO[]>([])
  const query = ref({
    current: 1,
    pageSize: 10
  })

  const getDifficultyType = (difficulty?: number) => {
    if (difficulty === 0) return 'success'
    if (difficulty === 1) return 'warning'
    if (difficulty === 2) return 'danger'
    return 'info'
  }

  const getDifficultyText = (difficulty?: number) => {
    if (difficulty === 0) return '简单'
    if (difficulty === 1) return '中等'
    if (difficulty === 2) return '困难'
    return '未知'
  }

  const toDetail = (problem: ProblemTitleVO) => {
    router.push({ name: 'ProblemDetail', params: { id: String(problem.id) } })
  }

  const toUpdate = (problem: ProblemTitleVO) => {
    router.push({ name: 'ProblemManage', query: { id: problem.id } })
  }

  const listPage = async () => {
    loading.value = true

    try {
      const res = await ProblemControllerService.getProblemTitleList(
        query.value.current,
        query.value.pageSize,
        { title: searchValue.value || undefined } as ProblemSearchDTO
      )

      data.value = res.data?.records || []
      total.value = res.data?.total || 0
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    listPage()
  })
</script>

<style scoped>
  .question-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .question-search {
    max-width: 320px;
  }

  .question-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
</style>
