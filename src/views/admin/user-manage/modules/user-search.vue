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

  // 校验规则
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
      label: 'id',
      key: 'id',
      type: 'input',
      placeholder: '请输入Id',
      clearable: true
    },
    {
      label: '账号',
      key: 'userAccount',
      type: 'input',
      props: { placeholder: '请输入账号', maxlength: '11' }
    },
    {
      label: '用户名',
      key: 'userName',
      type: 'input',
      props: { placeholder: '请输入用户名' }
    },
    {
      label: '学校',
      key: 'school',
      type: 'input',
      props: { placeholder: '请输入学校' }
    },
    {
      label: '学号',
      key: 'number',
      type: 'input',
      props: { placeholder: '请输入学号' }
    },
    {
      label: '性别',
      key: 'gender',
      type: 'radiogroup',
      props: {
        options: [
          { label: '保密', value: '0' },
          { label: '男', value: '1' },
          { label: '女', value: '2' }
        ]
      }
    },
    {
      label: '状态',
      key: 'isDelete',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value
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
