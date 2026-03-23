<template>
  <div class="page-content problem-detail-page !mb-5">
    <el-row :gutter="10" class="problem-detail-layout">
      <el-col :xl="17" :lg="17" :xs="24">
        <ElCard shadow="hover">
          <template #header>
            <div class="card-header problem-detail-title-header">
              <p class="title">{{ problemData.title }}</p>
            </div>
          </template>

          <WangEditor v-model="problemData.description" read-only height="100%" />

          <div class="mt-3">
            <WojCodeEditor v-model:value="submitData.code" language="cpp" />
          </div>

          <div class="mt-3">
            <ElButton type="primary" @click="submit" :loading="!isState">
              <ElIcon class="el-icon--left" v-if="isState"><Upload /></ElIcon>
              提交代码
            </ElButton>
          </div>
        </ElCard>
        <transition name="el-zoom-in-top">
          <div v-if="!isHide" class="submit-status-box mt-3" :class="statusThemeClass">
            <div class="status-header">
              <span class="status-title">代码判题结果</span>
            </div>

            <div class="status-body">
              <div v-if="!message" class="status-content">
                <ElIcon class="is-loading status-icon"><Loading /></ElIcon>
                <span>正在云端评测中，请稍候...</span>
              </div>

              <div v-else class="status-content">
                <ElIcon class="status-icon" v-if="isAccepted"><SuccessFilled /></ElIcon>
                <ElIcon class="status-icon" v-else><WarningFilled /></ElIcon>
                <span style="white-space: pre-wrap" class="result-text">{{
                  message || '未知状态'
                }}</span>
              </div>
            </div>
          </div>
        </transition>
      </el-col>

      <ElCol :xl="7" :lg="7" :xs="24">
        <ElCard shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="stat-item clickable">
                <div class="stat-number">{{ problemStatsData.charDataVO?.acCount || 0 }}</div>
                <div class="stat-label">通过</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item clickable">
                <div class="stat-number">{{ problemStatsData.totalSubmissions }}</div>
                <div class="stat-label">提交</div>
              </div>
            </div>
          </template>

          <StatsView :data="problemStatsData.charDataVO || {}" />
          <ProblemAiChat
            :problem-id="props.id"
            :problem="problemData"
            :stats="problemStatsData"
            :code="submitData.code ?? ''"
            :submit-result="message"
          />
        </ElCard>
      </ElCol>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import {
    ProblemControllerService,
    ProblemStatsVO,
    ProblemSubmitAddDTO,
    ProblemSubmitControllerService,
    ProblemVO
  } from '@api/web'
  import '@styles/custom/problem-detail.scss'
  import { Loading, SuccessFilled, WarningFilled, Upload } from '@element-plus/icons-vue'
  import WojCodeEditor from '@/components/WojCodeEditor.vue'
  import WangEditor from '@/components/forms/wang-editor/index.vue'
  import { ElMessage } from 'element-plus'
  import { computed, ref } from 'vue'
  import ProblemAiChat from './modules/ProblemAiChat.vue'
  import StatsView from './modules/StatsView.vue'
  import { useUserStore } from '@/store/modules/user'

  interface ProblemDetailData extends ProblemVO {
    input?: string
    output?: string
  }

  const isAccepted = computed(() => {
    if (!message.value) return false
    const msg = message.value.toUpperCase()
    return msg.includes('ACCEPTED')
  })

  const statusThemeClass = computed(() => {
    if (!isState.value) return 'theme-loading'
    if (isAccepted.value) return 'theme-success'
    return 'theme-error'
  })

  const isState = ref(true)
  const isHide = ref(true)
  const message = ref('')

  const props = defineProps<{
    id: string
  }>()

  const problemData = ref<ProblemDetailData>({
    id: 0,
    problemId: '',
    title: '',
    author: '',
    tagList: [],
    description: '',
    input: '',
    output: '',
    source: '',
    difficulty: 0,
    auth: 0
  })

  const problemStatsData = ref<ProblemStatsVO>({})

  const submitData = ref<ProblemSubmitAddDTO>({
    language: 'c++',
    code: '',
    pid: props.id
  })

  const submit = async () => {
    isHide.value = false
    isState.value = false
    message.value = ''

    try {
      const res = await ProblemSubmitControllerService.doSubmit(submitData.value)

      if (res.code === 200 && res.data) {
        ElMessage.success('提交成功')
        return
      }

      message.value = res.message || '提交失败'
      ElMessage.error(`提交失败：${res.message || '未知错误'}`)
    } catch (error: any) {
      message.value = error?.message || '提交失败，请稍后重试'
      ElMessage.error(message.value)
    } finally {
      isState.value = true
    }
  }

  const loadStatsData = async () => {
    if (!props.id) {
      ElMessage.error('id 为空')
      return
    }

    try {
      const res = await ProblemControllerService.getProblemStatistics(props.id)

      if (res.code === 200 && res.data) {
        problemStatsData.value = res.data
        console.log(res)
      } else {
        ElMessage.error(`统计数据加载失败：${res.message}`)
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '统计数据加载失败，请稍后重试')
    }
  }

  const loadData = async () => {
    if (!props.id) {
      return
    }

    try {
      const res = await ProblemControllerService.getProblem(props.id)
      if (res.code === 200) {
        problemData.value = res.data as ProblemDetailData
      } else {
        ElMessage.error(`题目信息加载失败：${res.message}`)
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '题目信息加载失败，请稍后重试')
    }
  }

  const userState = useUserStore()
  const userId = userState.userInfo.id
  const socket = new WebSocket(`ws://localhost:8103/api/web/websocket/${userId}`)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log(data)
    console.log(data.result)
    console.log(data.info)
    console.log(data.result + data.info)

    if (data.type === 'JUDGE_RESULT') {
      const result = data.result || ''
      const info = data.info || ''
      message.value = `${result}\n${info}`
    }
    isState.value = true
  }

  onMounted(() => {
    loadData()
    loadStatsData()
  })
</script>
