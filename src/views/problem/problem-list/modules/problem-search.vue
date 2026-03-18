<template>
  <SearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </SearchBar>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // todo 题目查询 校验规则
  const rules = {
    // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 动态 options
  const statusOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // 模拟接口返回状态数据
  function fetchStatusOptions(): Promise<typeof statusOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '正常', value: '0' },
          { label: '注销', value: '1' }
        ])
      }, 1000)
    })
  }

  onMounted(async () => {
    statusOptions.value = await fetchStatusOptions()
  })

  // 表单配置
  const formItems = computed(() => [
    {
      label: 'Id',
      key: 'problemId',
      type: 'input',
      placeholder: '题目Id',
      clearable: true
    },
    {
      label: '标题',
      key: 'title',
      type: 'input',
      props: { placeholder: '标题', maxlength: 255 },
      clearable: true
    },
    {
      label: '作者',
      key: 'author',
      type: 'input',
      props: { placeholder: '作者', maxlength: 32 },
      clearable: true
    },
    {
      label: '来源',
      key: 'source',
      type: 'input',
      props: { placeholder: '来源', maxlength: 255 }
    },
    {
      label: '难度',
      key: 'difficulty',
      type: 'select',
      props: {
        options: [
          { label: '简单', value: '0' },
          { label: '中等', value: '1' },
          { label: '困难', value: '2' }
        ]
      }
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('表单数据', formData.value)
  }
</script>
