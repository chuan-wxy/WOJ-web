<template>
  <div class="page-content mb-5">
    <ElCard class="preview-card" shadow="never" v-if="announcementData">
      <template #header>
        <div>📖 {{ announcementData.title }}</div>
        <span>⌛{{ $t('views.announcement.createTime') }}{{ formTime }}</span>
      </template>

      <WangEditor v-model="announcementData.content!" read-only height="100%" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { AnnouncementContentVO, AnnouncementControllerService } from '@/openapi/web'
  import { ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'
  import { loadingService } from '@utils/ui'
  import WangEditor from '@/components/forms/wang-editor/index.vue'
  import { formatDate } from '@/hooks/core/useTable'

  const route = useRoute()
  const announcementData = ref<AnnouncementContentVO>()

  const loadData = async () => {
    loadingService.showLoading()
    try {
      const rawId = route.query.id
      let id: number | undefined = undefined

      if (rawId) {
        const parsedId = Number(rawId)
        if (!isNaN(parsedId) && parsedId > 0) {
          id = parsedId
        }
      }

      let res
      if (id === undefined) {
        res = await AnnouncementControllerService.getLastAnnouncement()
      } else {
        res = await AnnouncementControllerService.getAnnouncement(id)
      }

      if (res.code === 200 || res.code === 0) {
        if (res.data) {
          announcementData.value = res.data
        } else {
          ElMessage.warning('暂无公告')
        }
      } else {
        ElMessage.error(res.message || '加载公告失败')
      }
    } catch (error) {
      console.error('加载公告异常:', error)
      ElMessage.error('加载公告失败')
    } finally {
      loadingService.hideLoading()
    }
  }

  const formTime = computed(() => {
    return formatDate(announcementData.value!.createTime)
  })

  onMounted(() => {
    loadData()
  })
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
