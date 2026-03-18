<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="30%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <ElFormItem label="用户名" prop="username">
        <ElInput v-model="formData.userName" placeholder="请输入用户名" />
      </ElFormItem>
      <ElFormItem label="账号" prop="userAccount">
        <ElInput v-model="formData.userAccount" placeholder="请输入账号" />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender">
        <ElSelect v-model="formData.gender">
          <ElOption label="男" value="男" />
          <ElOption label="女" value="女" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="角色" prop="role">
        <ElSelect v-model="formData.roles" multiple>
          <ElOption
            v-for="role in roleList"
            :key="role.roleCode"
            :value="role.roleCode"
            :label="role.roleName"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { UserAdminVO } from '@api/user'

  // 角色列表
  // todo
  const ROLE_LIST_DATA = [
    {
      roleName: '超级管理员',
      roleCode: 'R_SUPER',
      des: '拥有系统全部权限',
      date: '2025-05-15 12:30:45',
      enable: true
    },
    {
      roleName: '管理员',
      roleCode: 'R_ADMIN',
      des: '拥有系统管理权限',
      date: '2025-05-15 12:30:45',
      enable: true
    },
    {
      roleName: '普通用户',
      roleCode: 'R_USER',
      des: '拥有系统普通权限',
      date: '2025-05-15 12:30:45',
      enable: true
    },
    {
      roleName: '财务管理员',
      roleCode: 'R_FINANCE',
      des: '管理财务相关权限',
      date: '2025-05-16 09:15:30',
      enable: true
    },
    {
      roleName: '数据分析师',
      roleCode: 'R_ANALYST',
      des: '拥有数据分析权限',
      date: '2025-05-16 11:45:00',
      enable: false
    }
  ]

  interface Props {
    visible: boolean
    type: string
    userData?: UserAdminVO
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 角色列表数据
  const roleList = ref(ROLE_LIST_DATA)

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive<UserAdminVO>({})

  // 表单验证规则
  //todo
  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      userName: isEdit && row ? row.userName || '' : '',
      userAccount: isEdit && row ? row.userAccount || '' : '',
      gender: isEdit && row ? row.gender || '男' : '男',
      roles: isEdit && row ? (Array.isArray(row.roles) ? row.roles : []) : []
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  /**
   * 提交表单
   * 验证通过后触发提交事件
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
