<template>
  <div id="activity-content">
    <div class="panel-body">
      <h1 style="text-align: center">{{ activityData.title }}</h1>
      <div class="footer">发布于： {{ activityData.createTime }}</div>
      <div class="content" v-html="activityData.description"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { ActivityControllerService } from '@api/web/services/ActivityControllerService'
  import { ActivityContentVO } from '@api/web/models/ActivityContentVO'

  const route = useRoute()
  const activityData = ref({
    id: 0,
    title: '',
    description: '',
    createTime: ''
  } as ActivityContentVO)

  const loadData = async () => {
    const id = Number(route.query.id)
    if (!id) {
      return
    }
    const res = await ActivityControllerService.getActivity(id)
    if (res.code === 200) {
      activityData.value = res.data as ActivityContentVO
    } else {
      ElMessage.error('加载失败：' + res.message)
    }
  }

  onBeforeMount(() => {
    loadData()
  })
</script>

<style scoped>
  #activity-content {
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
  }

  .content {
    margin-top: 24px;
    line-height: 1.8;
  }

  .content :deep(img) {
    max-width: 100%;
  }
</style>
