<!-- 个人中心页面 -->
<template>
  <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
    <div class="relative flex-b mt-2.5 max-md:block max-md:mt-1">
      <div class="w-112 mr-5 max-md:w-full max-md:mr-0">
        <div class="art-card-sm relative p-9 pb-6 overflow-hidden text-center">
          <img class="absolute top-0 left-0 w-full h-50 object-cover" src="@imgs/user/bg.webp" />
          <img
            class="relative z-10 w-20 h-20 mt-30 mx-auto object-cover border-2 border-white rounded-full"
            src="@imgs/user/avatar.webp"
          />
          <h2 class="mt-5 text-xl font-normal">{{ userInfo.userName }}</h2>
          <p class="mt-5 text-sm">{{ userInfo.signature }}</p>

          <div class="w-75 mx-auto mt-7.5 text-left">
            <div class="mt-2.5">
              <SvgIcon icon="ri:mail-line" class="text-g-700" />
              <span class="ml-2 text-sm">{{ userInfo.userAccount }}</span>
            </div>
            <div class="mt-2.5">
              <SvgIcon icon="ri:user-3-line" class="text-g-700" />
              <span class="ml-2 text-sm">交互专家</span>
            </div>
            <div class="mt-2.5">
              <SvgIcon icon="ri:map-pin-line" class="text-g-700" />
              <span class="ml-2 text-sm">{{ userInfo.school }}</span>
            </div>
            <div class="mt-2.5">
              <SvgIcon icon="ri:dribbble-fill" class="text-g-700" />
              <span class="ml-2 text-sm">字节跳动－某某平台部－UED</span>
            </div>
          </div>

          <div class="mt-10">
            <h3 class="text-sm font-medium">{{ $t('system.title') }}</h3>
            <div class="flex flex-wrap justify-center mt-3.5">
              <div
                v-for="item in titleList"
                :key="item"
                class="py-1 px-1.5 mr-2.5 mb-2.5 text-xs border border-g-300 rounded"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-hidden max-md:w-full max-md:mt-3.5">
        <div class="art-card-sm">
          <h1 class="p-4 text-xl font-normal border-b border-g-300">{{
            $t('system.label.setting')
          }}</h1>

          <ElForm
            :model="userInfo"
            class="box-border p-5 [&>.el-row_.el-form-item]:w-[calc(50%-10px)] [&>.el-row_.el-input]:w-full [&>.el-row_.el-select]:w-full"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <ElRow>
              <ElFormItem :label="$t('system.label.userName')" prop="userName">
                <ElInput v-model="userInfo.userName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem :label="$t('system.label.gender')" prop="gender" class="ml-5">
                <ElSelect v-model="userInfo.gender" placeholder="Select" :disabled="!isEdit">
                  <ElOption
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="Github" prop="github">
                <ElInput v-model="userInfo.github" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem :label="$t('system.label.school')" prop="school" class="ml-5">
                <ElInput v-model="userInfo.school" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElFormItem :label="$t('system.label.profile')" prop="profile" class="h-32">
              <ElInput
                type="textarea"
                :rows="4"
                v-model="userInfo.userProfile"
                :disabled="!isEdit"
              />
            </ElFormItem>

            <div class="flex-c justify-end [&_.el-button]:!w-27.5">
              <ElButton type="primary" class="w-22.5" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </ElButton>
            </div>
          </ElForm>
        </div>

        <div class="art-card-sm my-5">
          <h1 class="p-4 text-xl font-normal border-b border-g-300">{{
            $t('system.label.editPassword')
          }}</h1>

          <ElForm
            :model="pswForm"
            :rules="pswRules"
            class="box-border p-5"
            label-width="86px"
            label-position="top"
          >
            <ElFormItem :label="$t('system.label.password')" prop="password">
              <ElInput v-model="pswForm.password" type="password" show-password />
            </ElFormItem>

            <ElFormItem :label="$t('system.label.newPassword')" prop="newPassword">
              <ElInput v-model="pswForm.newPassword" type="password" show-password />
            </ElFormItem>

            <ElFormItem :label="$t('system.label.confirmPassword')" prop="confirmPassword">
              <ElInput v-model="pswForm.confirmPassword" type="password" show-password />
            </ElFormItem>

            <div class="flex-c justify-end [&_.el-button]:!w-27.5">
              <ElButton type="primary" class="w-22.5" v-ripple @click="editPwd">保存</ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import { UserControllerService } from '@api/user'

  defineOptions({ name: 'UserCenter' })

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)
  // 安全解析 titleName 为字符串数组
  const titleList = computed(() => {
    // 1. 获取原始值并做空值处理
    const titleStr = userStore.getUserInfo.titleName || '[]'

    try {
      // 2. 解析 JSON 字符串
      const parsedData = JSON.parse(titleStr)

      // 3. 校验解析结果是否为字符串数组（类型安全）
      if (Array.isArray(parsedData)) {
        // 过滤非字符串元素，确保数组全为字符串
        console.log(parsedData)
        return parsedData.filter((item) => typeof item === 'string')
      } else {
        // 非数组则返回空数组
        return []
      }
    } catch (error) {
      // 解析失败（格式错误）返回空数组
      console.warn('解析 titleName 失败：', error)
      return []
    }
  })

  const isEdit = ref(false)
  const date = ref('')
  const ruleFormRef = ref<FormInstance>()

  /**
   * 密码修改表单
   */
  const pswForm = reactive({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
  })

  /**
   * 表单验证规则
   */
  const pswRules = reactive<FormRules>({
    password: [
      { required: true, message: '请输入原密码', trigger: 'blur' },
      { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          // 假设你的表单数据模型为 form（需和实际代码中的变量名一致）
          if (!value) {
            return callback(new Error('请输入确认密码'))
          }
          if (value !== pswForm.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change'] // 失焦/值变化时都触发校验
      }
    ]
  })

  /**
   * 性别选项
   */
  const options = [
    { value: '1', label: '男' },
    { value: '2', label: '女' }
  ]

  onMounted(() => {
    getDate()
  })

  /**
   * 根据当前时间获取问候语
   */
  const getDate = () => {
    const h = new Date().getHours()

    if (h >= 6 && h < 9) date.value = '早上好'
    else if (h >= 9 && h < 11) date.value = '上午好'
    else if (h >= 11 && h < 13) date.value = '中午好'
    else if (h >= 13 && h < 18) date.value = '下午好'
    else if (h >= 18 && h < 24) date.value = '晚上好'
    else date.value = '很晚了，早点睡'
  }

  /**
   * 切换用户信息编辑状态
   */
  const edit = () => {
    isEdit.value = !isEdit.value
  }

  /**
   * 切换密码编辑状态
   */
  const editPwd = async () => {
    const res = await UserControllerService.editPassword(pswForm)

    if (res.code === 200) {
      userStore.logOut()
    } else {
      ElMessage.error(res.message)
    }
  }
</script>
