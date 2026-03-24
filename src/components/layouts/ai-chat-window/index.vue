<template>
  <div>
    <ElDrawer v-model="isDrawerVisible" :size="isMobile ? '100%' : '480px'" :with-header="false">
      <div class="mb-5 flex-cb">
        <div>
          <span class="text-base font-medium">{{ BOT_NAME }}</span>
          <div class="mt-1.5 flex-c gap-1">
            <div
              class="h-2 w-2 rounded-full"
              :class="isOnline ? 'bg-success/100' : 'bg-danger/100'"
            ></div>
            <span class="text-xs text-g-600">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div>
          <ElIcon class="c-p" :size="20" @click="closeChat">
            <Close />
          </ElIcon>
        </div>
      </div>

      <div class="flex h-[calc(100%-70px)] flex-col">
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto border-t-d px-4 py-7.5 [&::-webkit-scrollbar]:!w-1"
        >
          <template v-if="messages.length">
            <template v-for="message in messages" :key="message.id">
              <div
                :class="[
                  'mb-7.5 flex w-full items-start gap-2',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                ]"
              >
                <ElAvatar :size="32" :src="getMessageAvatar(message)" class="shrink-0">
                  {{ getAvatarFallback(message) }}
                </ElAvatar>

                <div
                  :class="[
                    'flex max-w-[70%] flex-col',
                    message.role === 'user' ? 'items-end' : 'items-start'
                  ]"
                >
                  <div
                    :class="[
                      'mb-1 flex gap-2 text-xs',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    ]"
                  >
                    <span class="font-medium">{{ getMessageSender(message) }}</span>
                    <span class="text-g-600">{{ message.time }}</span>
                  </div>
                  <div
                    :class="[
                      'rounded-md px-3.5 py-2.5 text-sm leading-[1.4] text-g-900',
                      message.role === 'user'
                        ? 'message-right bg-theme/15'
                        : 'message-left bg-g-300/50'
                    ]"
                  >
                    {{ message.content }}
                  </div>
                </div>
              </div>
            </template>
          </template>

          <div v-else class="flex h-full flex-col items-center justify-center px-6 text-center">
            <ElAvatar :size="52" :src="aiAvatar" class="mb-4">AI</ElAvatar>
            <p class="text-sm font-medium text-g-800">开始新的 AI 对话</p>
            <p class="mt-2 text-xs leading-5 text-g-500"> Hello，有什么我能帮你的吗？ </p>
          </div>
        </div>

        <div class="px-4 pt-4">
          <ElInput
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息，Enter 发送，Shift + Enter 换行"
            resize="none"
            @keydown="handleInputKeydown"
          />
          <div class="mt-3 flex-cb">
            <span class="text-xs text-g-500">当前用户：{{ currentUserName }}</span>
            <ElButton
              type="primary"
              class="min-w-20"
              :disabled="!messageText.trim()"
              @click="sendMessage"
              v-ripple
            >
              发送
            </ElButton>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import { useWindowSize } from '@vueuse/core'
  import { storeToRefs } from 'pinia'
  import { Close } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import { useUserStore } from '@/store/modules/user'
  import aiAvatar from '@/assets/images/avatar/ai.png'

  defineOptions({ name: 'AIChatWindow' })

  type ChatRole = 'assistant' | 'user'

  interface ChatMessage {
    id: number
    role: ChatRole
    content: string
    time: string
  }

  const MOBILE_BREAKPOINT = 640
  const SCROLL_DELAY = 100
  const BOT_NAME = 'Woj AI Bot'

  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < MOBILE_BREAKPOINT)

  const userStore = useUserStore()
  const { getUserInfo: userInfo } = storeToRefs(userStore)

  const isDrawerVisible = ref(false)
  const isOnline = ref(true)
  const messageText = ref('')
  const messageId = ref(0)
  const messageContainer = ref<HTMLElement | null>(null)
  const messages = ref<ChatMessage[]>([])

  const getUserField = (...keys: string[]): string => {
    const info = userInfo.value as Record<string, unknown>

    for (const key of keys) {
      const value = info[key]
      if (typeof value === 'string' && value.trim()) {
        return value
      }
    }

    return ''
  }

  const currentUserName = computed(
    () => getUserField('name', 'userName', 'account', 'userAccount') || '我'
  )
  const currentUserAvatar = computed(() => getUserField('avatar', 'userAvatar'))

  const formatCurrentTime = (): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date())
  }

  const createMessage = (role: ChatRole, content: string): ChatMessage => ({
    id: ++messageId.value,
    role,
    content,
    time: formatCurrentTime()
  })

  const getMessageSender = (message: ChatMessage): string => {
    return message.role === 'user' ? currentUserName.value : BOT_NAME
  }

  const getMessageAvatar = (message: ChatMessage): string => {
    return message.role === 'user' ? currentUserAvatar.value : aiAvatar
  }

  const getAvatarFallback = (message: ChatMessage): string => {
    return message.role === 'user' ? currentUserName.value.slice(0, 1) || '我' : 'AI'
  }

  const scrollToBottom = (): void => {
    nextTick(() => {
      setTimeout(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
      }, SCROLL_DELAY)
    })
  }

  const appendMessage = (role: ChatRole, content: string): void => {
    const text = content.trim()
    if (!text) return

    messages.value.push(createMessage(role, text))
    scrollToBottom()
  }

  const appendUserMessage = (content: string): void => {
    appendMessage('user', content)
  }

  const appendAssistantMessage = (content: string): void => {
    appendMessage('assistant', content)
  }

  const resetMessages = (): void => {
    messages.value = []
  }

  const requestAssistantReply = async (_content: string): Promise<void> => {
    // TODO: call the AI API here, then use appendAssistantMessage to append the reply.
  }

  const sendMessage = async (): Promise<void> => {
    const text = messageText.value.trim()
    if (!text) return

    appendUserMessage(text)
    messageText.value = ''
    await requestAssistantReply(text)
  }

  const handleInputKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing) {
      return
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const openChat = (): void => {
    isDrawerVisible.value = true
    scrollToBottom()
  }

  const closeChat = (): void => {
    isDrawerVisible.value = false
  }

  defineExpose({
    openChat,
    closeChat,
    appendUserMessage,
    appendAssistantMessage,
    resetMessages
  })

  onMounted(() => {
    mittBus.on('openChat', openChat)
  })

  onUnmounted(() => {
    mittBus.off('openChat', openChat)
  })
</script>
