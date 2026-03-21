<template>
  <div class="page-content !mb-5">
    <el-row :gutter="10" style="margin: auto; max-width: 1500px; min-width: 600px">
      <el-col :xl="17" :lg="17" :xs="24">
        <ElCard shadow="hover">
          <template #header>
            <div class="card-header" style="height: 35px">
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
      </el-col>
      <ElCol :xl="7" :lg="7" :xs="24">
        <ElCard shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="stat-item clickable">
                <div class="stat-number">{{ problemStatsData.charDataVO?.acCount || 0 }}</div>
                <div class="stat-label">通过</div>
              </div>
              <div data-v-22ef7511="" class="stat-divider"></div>
              <div class="stat-item clickable">
                <div class="stat-number"> {{ problemStatsData.totalSubmissions }}</div>
                <div class="stat-label">提交</div>
              </div>
            </div>
          </template>
          <StatsView :data="problemStatsData.charDataVO!" />

          <transition name="el-zoom-in-top">
            <div v-if="!isHide" class="submit-status-box mt-3" :class="statusThemeClass">
              <div class="status-header">
                <span class="status-title">代码判题结果</span>
              </div>

              <div class="status-body">
                <div v-if="!isState" class="status-content">
                  <ElIcon class="is-loading status-icon"><Loading /></ElIcon>
                  <span>正在云端评测中，请稍候...</span>
                </div>

                <div v-else class="status-content">
                  <ElIcon class="status-icon" v-if="isAccepted"><SuccessFilled /></ElIcon>
                  <ElIcon class="status-icon" v-else><WarningFilled /></ElIcon>
                  <span class="result-text">{{ message || '未知状态' }}</span>
                </div>
              </div>
            </div>
          </transition>
        </ElCard>
        <el-card shadow="hover" class="mt-3 ai-chat-card">
          <template #header>
            <div class="chat-header">
              <div class="title">
                <el-icon class="mr-1"><ChatDotRound /></el-icon>
                AI 编程助手
              </div>
              <el-tag size="small" type="success" effect="plain">在线</el-tag>
            </div>
          </template>

          <el-scrollbar height="350px" ref="scrollbarRef" class="chat-window">
            <div class="message-list">
              <div
                v-for="(msg, index) in chatMessages"
                :key="index"
                :class="['message-wrapper', msg.role === 'user' ? 'is-user' : 'is-ai']"
              >
                <el-avatar :size="32" :class="msg.role === 'user' ? 'avatar-user' : 'avatar-ai'">
                  {{ msg.role === 'user' ? 'U' : 'AI' }}
                </el-avatar>

                <div class="message-bubble">
                  <span class="text-content">{{ msg.content }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>

          <div class="chat-input-area mt-3">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="2"
              resize="none"
              placeholder="遇到困难了？向 AI 提问或寻求代码提示..."
              @keydown.enter.prevent="sendMessage"
            />
            <div class="action-bar mt-2" style="text-align: right">
              <el-button
                type="primary"
                :icon="Position"
                @click="sendMessage"
                :loading="isAiAnswering"
              >
                发送
              </el-button>
            </div>
          </div>
        </el-card>
      </ElCol>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import {
    ProblemControllerService,
    ProblemStatsVO,
    ProblemSubmitAddDTO,
    ProblemSubmitControllerService
  } from '@api/web'
  import WojCodeEditor from '@/components/WojCodeEditor.vue'
  import WangEditor from '@/components/forms/wang-editor/index.vue'
  import StatsView from '@views/problem/problem-detail/modules/StatsView.vue'
  import { Loading, SuccessFilled, WarningFilled, Upload } from '@element-plus/icons-vue'
  import { computed } from 'vue'
  import { ref, nextTick } from 'vue'
  import { ChatDotRound, Position } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  // 聊天记录类型定义
  interface ChatMessage {
    role: 'user' | 'ai'
    content: string
  }

  const scrollbarRef = ref()
  const inputMessage = ref('')
  const isAiAnswering = ref(false)

  // 初始欢迎语
  const chatMessages = ref<ChatMessage[]>([
    {
      role: 'ai',
      content: '你好！我是你的专属编程助手。对这道题有疑问，或者需要排查报错，随时问我哦！'
    }
  ])

  // 滚动到底部的方法
  const scrollToBottom = async () => {
    await nextTick()
    if (scrollbarRef.value) {
      // 自动滚动到最新消息
      const wrap = scrollbarRef.value.wrapRef
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight
      }
    }
  }

  // 发送消息
  const sendMessage = async () => {
    const text = inputMessage.value.trim()
    if (!text) return

    // 1. 追加用户消息到列表
    chatMessages.value.push({ role: 'user', content: text })
    inputMessage.value = ''
    scrollToBottom()

    // 2. 模拟向后端请求 AI 回复
    isAiAnswering.value = true

    // 占位一条 AI 的空消息，准备接收流式输出
    chatMessages.value.push({ role: 'ai', content: '思考中...' })
    scrollToBottom()

    try {
      // 【TODO】这里替换为真实的后端 API 调用
      // 如果是普通请求，直接 await 拿到结果替换内容
      // 如果是 SSE 流式输出，需要监听 onmessage 逐步拼接 content
      await new Promise((resolve) => setTimeout(resolve, 1500)) // 模拟延迟

      // 替换最后一条"思考中"的内容
      chatMessages.value[chatMessages.value.length - 1].content =
        '这是一个模拟回复。如果是代码问题，建议检查一下边界条件是否处理正确。'
    } catch (error) {
      ElMessage.error('AI 助手开小差了，请稍后再试')
      chatMessages.value[chatMessages.value.length - 1].content = '[请求失败]'
    } finally {
      isAiAnswering.value = false
      scrollToBottom()
    }
  }
  //

  const isAccepted = computed(() => {
    if (!message.value) return false
    const msg = message.value.toUpperCase()
    return msg.includes('ACCEPTED')
  })

  const statusThemeClass = computed(() => {
    if (!isState.value) return 'theme-loading' // 判题中（蓝色）
    if (isAccepted.value) return 'theme-success' // 成功（绿色）
    return 'theme-error' // 失败/错误（红色）
  })

  const isState = ref(true)
  const isHide = ref(true)
  const message = ref('')

  // Long类型丢失精度，又要求params传参
  // 首先在路由上加上 props: true,将路由参数作为 props 传给组件
  // 不从 route.params 拿值，改用 defineProps，并强制指定为 String
  const props = defineProps<{
    id: string
  }>()

  const problemData = ref({
    id: 0,
    problemId: 0,
    title: 0,
    author: '',
    tagList: [],
    description: '',
    input: '',
    output: '',
    source: '',
    difficulty: 0,
    auth: 0
  })

  const problemStatsData = ref(<ProblemStatsVO>{})

  const submitData = ref<ProblemSubmitAddDTO>({
    language: 'c++',
    code: '',
    pid: props.id
  })

  const submit = async () => {
    isState.value = false
    //先清空以前的数据
    message.value = ''

    const res = await ProblemSubmitControllerService.doSubmit(submitData.value)

    isState.value = true
    console.log(res)

    if (res.code === 200 && res.data) {
      ElMessage.success('提交成功')
      message.value = res.data.result ?? ''
      isHide.value = false
    } else {
      ElMessage.error('提交失败：' + res.message)
    }
  }

  const loadStatsData = async () => {
    if (!props.id) {
      ElMessage.error('id 为空')
      return
    }
    const res = await ProblemControllerService.getProblemStatistics(props.id)

    if (res.code === 200 && res.data) {
      problemStatsData.value = res.data
      console.log(res)
    } else {
      ElMessage.error('统计数据加载失败：' + res.message)
    }
  }

  const loadData = async () => {
    if (!props.id) {
      return
    }
    const res = await ProblemControllerService.getProblem(props.id)
    if (res.code === 200) {
      problemData.value = res.data as any
    } else {
      ElMessage.error('题目信息加载失败：' + res.message)
      return
    }
  }

  onMounted(() => {
    loadData()
    loadStatsData()
  })
</script>

<style scoped>
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-weight: bolder;
    color: #3f3f3f;
  }

  .title {
    margin: 0;
    font-size: 25px;
  }

  .clickable {
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
  }

  .stat-item {
    text-align: center;
    flex: 1;
  }

  .stat-divider {
    width: 1px;
    height: 60px;
    background-color: #e0e0e0;
    margin: 0 20px;
  }

  /* --- 判题状态美化 --- */
  .submit-status-box {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    transition: all 0.3s ease;
  }

  .status-header {
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .status-title {
    font-size: 13px;
    font-weight: bold;
    color: #606266;
  }

  .status-body {
    padding: 16px;
    display: flex;
    align-items: center;
  }

  .status-content {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
  }

  .status-icon {
    font-size: 20px;
    margin-right: 10px;
  }

  .result-text {
    letter-spacing: 0.5px;
  }

  /* 主题颜色：评测中 */
  .theme-loading {
    background-color: #f0f9eb; /* 浅底色 */
    border-color: #a0cfff;
  }
  .theme-loading .status-icon,
  .theme-loading .status-content {
    color: #409eff;
  }

  /* 主题颜色：成功 (AC) */
  .theme-success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
  }
  .theme-success .status-icon,
  .theme-success .status-content {
    color: #67c23a;
  }

  /* 主题颜色：错误 (WA, TLE, CE 等) */
  .theme-error {
    background-color: #fef0f0;
    border-color: #fde2e2;
  }
  .theme-error .status-icon,
  .theme-error .status-content {
    color: #f56c6c;
  }

  /* 按钮的间距微调 */
  .mt-3 {
    margin-top: 16px;
  }

  /* --- AI 聊天框样式 --- */
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .chat-header .title {
    display: flex;
    align-items: center;
    font-size: 15px;
  }

  .chat-window {
    background-color: #f9fafc;
    border-radius: 4px;
    padding: 10px;
  }

  .message-wrapper {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;
  }

  .message-wrapper.is-user {
    flex-direction: row-reverse; /* 用户消息靠右 */
  }

  .message-wrapper.is-user .message-bubble {
    background-color: #409eff;
    color: white;
    margin-left: 48px;
    margin-right: 12px;
    border-bottom-right-radius: 2px;
  }

  .message-wrapper.is-ai .message-bubble {
    background-color: white;
    color: #333;
    border: 1px solid #ebeef5;
    margin-right: 48px;
    margin-left: 12px;
    border-bottom-left-radius: 2px;
  }

  .avatar-ai {
    background-color: #f0f9eb;
    color: #67c23a;
    border: 1px solid #e1f3d8;
  }

  .avatar-user {
    background-color: #ecf5ff;
    color: #409eff;
    border: 1px solid #d9ecff;
  }

  .message-bubble {
    padding: 10px 14px;
    border-radius: 8px;
    max-width: 80%;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-all;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }

  .text-content {
    white-space: pre-wrap; /* 保留换行符 */
  }
</style>
