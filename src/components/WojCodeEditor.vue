<template>
  <div class="editor-container" :class="isDarkTheme ? 'theme-dark' : 'theme-light'">
    <div class="editor-toolbar">
      <div class="left">
        <span class="status-dot"></span>
        <span class="file-name">main.{{ language === 'python' ? 'py' : language }}</span>
      </div>

      <div class="actions">
        <el-switch
          v-model="enableSuggest"
          inline-prompt
          active-text="补全开"
          inactive-text="补全关"
          @change="handleSuggestChange"
          style="margin-right: 12px"
        />

        <el-button-group style="margin-right: 12px">
          <el-button size="small" plain @click="changeFontSize(-2)">A-</el-button>
          <el-button size="small" plain @click="changeFontSize(2)">A+</el-button>
        </el-button-group>

        <el-select
          v-model="language"
          size="small"
          @change="handleLanguageChange"
          style="width: 90px; margin-right: 12px"
        >
          <el-option label="C" value="c" />
          <el-option label="C++" value="cpp" />
          <el-option label="Java" value="java" />
          <el-option label="Python" value="python" />
        </el-select>

        <el-button size="small" type="primary" link @click="toggleTheme">
          <el-icon size="16">
            <Sunny v-if="isDarkTheme" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </div>
    </div>

    <div id="code-editor" ref="codeEditorRef" class="monaco-instance" />
  </div>
</template>

<script setup lang="ts">
  import * as monaco from 'monaco-editor'
  import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
  // 引入 Element Plus 的图标
  import { Sunny, Moon } from '@element-plus/icons-vue'

  interface Props {
    value: string
    language?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    language: 'cpp'
  })

  const emit = defineEmits(['update:value', 'change'])

  const codeEditorRef = ref()
  let editor: monaco.editor.IStandaloneCodeEditor | null = null

  // 状态控制
  const language = ref(props.language)
  const isDarkTheme = ref(true) // 默认深色模式
  const fontSize = ref(16) // 默认字体大小调到了 16
  const enableSuggest = ref(true) // 默认开启代码补全

  // 初始化编辑器
  onMounted(() => {
    if (!codeEditorRef.value) return

    editor = monaco.editor.create(codeEditorRef.value, {
      value: props.value,
      language: language.value,
      theme: isDarkTheme.value ? 'vs-dark' : 'vs',
      automaticLayout: true,
      fontSize: fontSize.value,
      fontFamily: "'Fira Code', 'Consolas', monospace",
      minimap: { enabled: false }, // 建议 OJ 系统关掉右侧缩略图，节省空间
      scrollBeyondLastLine: false,
      cursorSmoothCaretAnimation: 'on',
      padding: { top: 16, bottom: 16 },
      // 补全提示初始化配置
      quickSuggestions: enableSuggest.value,
      suggestOnTriggerCharacters: enableSuggest.value,
      wordBasedSuggestions: enableSuggest.value ? 'currentDocument' : 'off'
    })

    // 内容变化监听
    editor.onDidChangeModelContent(() => {
      const newValue = editor?.getValue()
      emit('update:value', newValue)
      emit('change', newValue)
    })
  })

  const handleSuggestChange = (val: boolean) => {
    editor?.updateOptions({
      quickSuggestions: val, // 是否开启快捷提示
      suggestOnTriggerCharacters: val, // 是否在输入如 '.' 时提示
      wordBasedSuggestions: val ? 'currentDocument' : 'off' // 是否基于上下文单词提示
    })
  }

  const changeFontSize = (delta: number) => {
    const newSize = fontSize.value + delta
    // 限制字体大小范围 (12px - 32px)
    if (newSize >= 12 && newSize <= 32) {
      fontSize.value = newSize
      editor?.updateOptions({ fontSize: fontSize.value })
    }
  }

  const handleLanguageChange = (val: string) => {
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel()!, val)
    }
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    monaco.editor.setTheme(isDarkTheme.value ? 'vs-dark' : 'vs')
  }

  // 销毁实例，防止内存泄漏
  onBeforeUnmount(() => {
    editor?.dispose()
  })
</script>

<style scoped>
  /* 容器基础样式 */
  .editor-container {
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
  }

  /* 顶部工具栏 */
  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid transparent;
    transition: all 0.3s;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    background: #67c23a; /* 绿色圆点，代表 ready */
    border-radius: 50%;
  }

  .actions {
    display: flex;
    align-items: center;
  }

  .monaco-instance {
    height: 500px;
    width: 100%;
  }

  /* ================= 主题适配方案 ================= */

  /* 深色主题 */
  .theme-dark {
    border-color: #333333;
  }
  .theme-dark .editor-toolbar {
    background-color: #252526;
    border-bottom-color: #333333;
    color: #cccccc;
  }
  .theme-dark .monaco-instance {
    background-color: #1e1e1e;
  }

  /* 浅色主题 (彻底解决"中间黑两边白"的问题) */
  .theme-light {
    border-color: #e4e7ed;
  }
  .theme-light .editor-toolbar {
    background-color: #f5f7fa;
    border-bottom-color: #e4e7ed;
    color: #606266;
  }
  .theme-light .monaco-instance {
    background-color: #ffffff;
  }

  /* 强制清除 Monaco 内部可能残留的背景色，让它完全跟随父级背景 */
  :deep(.monaco-editor),
  :deep(.monaco-editor-background),
  :deep(.monaco-editor .margin) {
    background-color: transparent !important;
  }
</style>
