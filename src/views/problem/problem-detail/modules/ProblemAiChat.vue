<template>
  <div class="problem-ai-chat art-card p-5">
    <div class="art-card-header">
      <div class="title">
        <h4>AI 辅助</h4>
        <p>结合题目、代码和评测结果给出提示</p>
      </div>
      <ElTag size="small" :type="isReady ? 'success' : 'info'">
        {{ isReady ? '可分析' : '待提交' }}
      </ElTag>
    </div>

    <div ref="messageContainer" class="ai-message-list">
      <div v-for="message in messages" :key="message.id" class="ai-message" :class="message.role">
        <ElAvatar :size="30" :src="message.role === 'assistant' ? aiAvatar : ''">
          {{ message.role === 'assistant' ? 'AI' : userName.slice(0, 1) || '我' }}
        </ElAvatar>
        <div class="message-content">
          <div class="message-meta">
            <span>{{ message.role === 'assistant' ? 'Woj AI' : userName }}</span>
            <span>{{ message.time }}</span>
          </div>
          <div class="message-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <ElInput
      v-model="question"
      type="textarea"
      :rows="3"
      resize="none"
      maxlength="500"
      show-word-limit
      placeholder="例如：我的代码为什么会 WA？能给我一点思路吗？"
      @keydown="handleKeydown"
    />

    <div class="ai-chat-actions">
      <ElButton text bg size="small" @click="usePreset('请分析我的提交结果，并指出优先排查的位置。')">
        分析结果
      </ElButton>
      <ElButton text bg size="small" @click="usePreset('请给我这道题的解题方向，不要直接给完整代码。')">
        解题提示
      </ElButton>
      <ElButton type="primary" size="small" :loading="loading" :disabled="!canSend" @click="send">
        发送
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from '@/utils/axios'
  import { ElMessage } from 'element-plus'
  import { nextTick, ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ProblemStatsVO, ProblemVO } from '@api/web'
  import { useUserStore } from '@/store/modules/user'
  import aiAvatar from '@/assets/images/avatar/ai.png'

  type ChatRole = 'assistant' | 'user'

  interface ChatMessage {
    id: number
    role: ChatRole
    content: string
    time: string
  }

  interface Props {
    problemId: string
    problem: ProblemVO
    stats: ProblemStatsVO
    code: string
    submitResult?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    submitResult: ''
  })

  const userStore = useUserStore()
  const { getUserInfo } = storeToRefs(userStore)

  const question = ref('')
  const loading = ref(false)
  const messageId = ref(0)
  const messageContainer = ref<HTMLElement | null>(null)
  const messages = ref<ChatMessage[]>([
    {
      id: ++messageId.value,
      role: 'assistant',
      content: '提交代码后，我可以结合题目、代码和评测结果帮你定位问题；也可以只给解题方向。',
      time: formatTime()
    }
  ])

  const userName = computed(() => {
    const info = getUserInfo.value as Record<string, unknown>
    return String(info.name || info.userName || info.account || '我')
  })

  const isReady = computed(() => Boolean(props.code?.trim() || props.problem?.title))
  const canSend = computed(() => Boolean(question.value.trim()) && isReady.value && !loading.value)

  function formatTime(): string {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date())
  }

  function appendMessage(role: ChatRole, content: string): void {
    messages.value.push({
      id: ++messageId.value,
      role,
      content,
      time: formatTime()
    })

    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  }

  function splitSubmitResult() {
    const raw = props.submitResult?.trim()
    if (!raw) {
      return {
        judgeResult: '未提交',
        judgeInfo: '暂无评测信息'
      }
    }

    const [firstLine, ...rest] = raw.split(/\r?\n/)
    return {
      judgeResult: firstLine || raw,
      judgeInfo: rest.join('\n') || raw
    }
  }

  function buildPayload() {
    const { judgeResult, judgeInfo } = splitSubmitResult()

    return {
      pid: Number(props.problem?.id || props.problemId),
      language: 'c++',
      code: props.code?.trim() || '暂无代码',
      judgeResult,
      judgeInfo,
      title: props.problem?.title || `题目 ${props.problemId}`,
      description: props.problem?.description || '暂无题目描述',
      question: question.value.trim()
    }
  }

  function usePreset(text: string): void {
    question.value = text
  }

  async function send(): Promise<void> {
    const text = question.value.trim()
    if (!text || loading.value) return

    appendMessage('user', text)
    question.value = ''
    loading.value = true

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8101/api'
      const response = await axios.post<string>(`${baseUrl}/ai/inner/trigger`, buildPayload(), {
        responseType: 'text'
      })

      appendMessage('assistant', response.data || 'AI 暂时没有返回内容，请稍后再试。')
    } catch (error: any) {
      const message = error?.message || 'AI 分析失败，请确认 AI 服务已启动。'
      appendMessage('assistant', message)
      ElMessage.error(message)
    } finally {
      loading.value = false
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.isComposing) return

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void send()
    }
  }
</script>
