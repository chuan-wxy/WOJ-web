<template>
  <div id="announcement-content">
    <div class="panel-body">
      <!-- 核心修复1：必须加 v-if，数据回来前不渲染内容 -->
      <template v-if="announcementData">
        <h1 style="text-align: center">{{ announcementData.title }}</h1>
        <div class="footer">发布于：{{ announcementData.createTime }}</div>
        <div class="content">
          <Viewer :value="announcementData.content" />
        </div>
      </template>

      <!-- 核心修复2：加空数据/加载中提示（避免空白） -->
      <div v-else class="empty-tip">
        {{ loading ? '加载中...' : '暂无公告' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { AnnouncementContentVO, AnnouncementControllerService } from '@/openapi/web'
  import { ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'
  import { Viewer } from '@bytemd/vue-next'
  import { loadingService } from '@utils/ui'

  const route = useRoute()
  const announcementData = ref<AnnouncementContentVO>()
  const loading = ref(false)

  const loadData = async () => {
    loading.value = true
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
      loading.value = false
      loadingService.hideLoading()
    }
  }

  onMounted(() => {
    loadData()
  })
</script>

<style scoped>
  #announcement-content {
    background: rgba(0, 0, 0, 0%);
    width: 95%;
    height: 100vh;
    margin: auto;
  }

  .panel-body {
    padding: 15px;
  }

  .footer {
    text-align: right;
    margin-top: 10px;
    color: #666;
  }

  .empty-tip {
    text-align: center;
    padding: 50px 0;
    color: #999;
    font-size: 16px;
  }
</style>
