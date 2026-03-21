<template>
  <div class="max-w-250 mx-auto my-5">
    <ElForm :model="form" :rules="rules" ref="formRef" label-position="top">
      <ElRow :gutter="10">
        <ElCol :span="9">
          <ElFormItem prop="title">
            <ElInput v-model.trim="form.title" placeholder="题目标题" maxlength="255" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem prop="tagList">
            <ElInputTag v-model="form.tagList" placeholder="题目标签" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="4">
          <ElFormItem prop="problemId">
            <ElInput v-model="form.problemId" placeholder="自定义id" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem prop="difficulty">
            <ElSelect v-model="form.difficulty" placeholder="请选择题目难度">
              <ElOption label="简单" :value="0" />
              <ElOption label="中等" :value="1" />
              <ElOption label="困难" :value="2" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem prop="description">
        <WangEditor class="mt-2.5" v-model="form.description!" />
      </ElFormItem>

      <div class="p-5 mt-5 woj-card-xs">
        <h2 class="mb-5 text-xl font-medium">发布设置</h2>
        <!-- 图片上传 -->
        <ElRow>
          <ElCol :span="12">
            <div class="mt-2.5 pr-7">
              <ElUpload
                drag
                multiple
                accept=".in,.out"
                :data="fileData"
                :action="uploadjudgeCaseUrl"
                :headers="uploadHeaders"
                :on-success="onSuccess"
                :on-error="onError"
                :before-upload="beforeUpload"
                class="judge-case-upload"
              >
                <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
                <div class="el-upload__text"> 将测试用例拖到此处，或 <em>点击上传</em> </div>

                <template #tip>
                  <div class="el-upload__tip text-g-700 mt-2">
                    请上传 .in,.out 格式的输入/输出文件，支持批量拖拽
                  </div>
                </template>
              </ElUpload>
              <ElTable
                v-show="judgeCaseList"
                :data="judgeCaseList"
                stripe
                class="mt-4"
                size="small"
              >
                <ElTableColumn prop="fileName" label="文件名" />
                <ElTableColumn prop="fileSize" label="大小">
                  <template #default="scope">
                    {{ (scope.row.fileSize / 1024).toFixed(2) }} KB
                  </template>
                </ElTableColumn>
                <ElTableColumn label="操作" width="80">
                  <template #default="scope">
                    <ElButton type="danger" link @click="deleteFile(scope.row.fileName)"
                      >删除</ElButton
                    >
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="时间限制 (ms)" prop="timeLimit">
              <ElInput v-model="form.timeLimit" placeholder="时间限制">
                <template #suffix>
                  <span class="input-unit">ms</span>
                </template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="内存限制 (kb)" prop="memoryLimit">
              <ElInput v-model="form.memoryLimit" placeholder="内存限制">
                <template #suffix>
                  <span class="input-unit">kb</span>
                </template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="内存限制 (kb)" prop="memoryLimit">
              <ElInput v-model="form.stackLimit" placeholder="堆栈限制">
                <template #suffix>
                  <span class="input-unit">kb</span>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <div class="flex justify-end">
          <ElButton type="primary" @click="addQuestion" class="w-25">
            {{ pageMode === PageModeEnum.Edit ? '保存' : '发布' }}
          </ElButton>
        </div>
      </div>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { FileControllerService, ProblemControllerService } from '@api/web'
  import { useUserStore } from '@/store/modules/user'
  import { ProblemAddDTO } from '@api/web'
  import { PageModeEnum } from '@/enums/formEnum'
  import EmojiText from '@utils/ui/emojo'
  import { UploadFilled } from '@element-plus/icons-vue'
  import { loadingService } from '@utils/ui'
  import { BaseResponse } from '@/types'

  interface JudgeCaseFileVO {
    fileName: string
    fileSize: number
    suffix: string
  }

  const judgeCaseList = ref()

  const pageMode = ref<PageModeEnum>(PageModeEnum.Add)
  const MAX_SIZE = 3 // MB

  const route = useRoute()
  const userStore = useUserStore()
  const { accessToken } = userStore

  const uploadjudgeCaseUrl = ref('')
  const uploadHeaders = { Authorization: accessToken }

  const fileData = computed(() => ({
    pid: form.value.problemId || 'default'
  }))

  const form = ref<ProblemAddDTO>({
    problemId: '',
    title: '',
    author: userStore.userInfo.name || '',
    description: '',
    tagList: [],
    timeLimit: 1000,
    memoryLimit: 65535,
    stackLimit: 131072,
    source: '',
    difficulty: 0,
    auth: 0,
    judgeMode: 'default',
    spjCode: '',
    spjLanguage: ''
  })

  const loadData = async () => {
    const id = route.query.id
    try {
      loadingService.showLoading()
      if (id) {
        // 编辑
        pageMode.value = PageModeEnum.Edit
        const res = await ProblemControllerService.getProblem(String(id))

        if (res.code === 200 && res.data !== undefined) {
          form.value = res.data
        } else {
          ElMessage.error('加载失败：' + res.message)
        }
      } else {
        // 新增
        return
      }
    } catch (error) {
      console.error(error)
    } finally {
      loadingService.hideLoading()
    }
  }

  const rules = {
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  const addQuestion = async () => {
    if (pageMode.value === PageModeEnum.Add) {
      form.value.author = userStore.userInfo.name
      const result = await ProblemControllerService.addProblem(form.value)
      if (result.code === 200) {
        ElMessage.success('添加成功')
      } else {
        ElMessage.error('添加失败：' + result.message)
      }
    } else {
      const res = await ProblemControllerService.updateProblem(form.value)
      if (res.code === 200) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.error('修改失败：' + res.message)
      }
    }
  }

  const onSuccess = (res: BaseResponse<JudgeCaseFileVO[]>) => {
    if (res.code === 200) {
      ElMessage.success(`上传成功 ${EmojiText[200]}`)
      judgeCaseList.value = res.data
    } else {
      ElMessage.error(res.message)
    }
  }

  const onError = () => {
    ElMessage.error(`上传失败 ${EmojiText[500]}`)
  }

  const beforeUpload = (file: File): boolean => {
    const allowedExtensions = ['in', 'out']
    const fileName = file.name.toLowerCase()

    const isAllowedExt = allowedExtensions.some((ext) => fileName.endsWith(`.${ext}`))

    if (!isAllowedExt) {
      ElMessage.error('只能上传 .in, .out 或 .txt 格式的文件')
      return false
    }

    const isLt3M = file.size / 1024 / 1024 < MAX_SIZE

    if (!isLt3M) {
      ElMessage.error(`文件大小不能超过 ${MAX_SIZE}MB`)
      return false
    }

    return true
  }

  const deleteFile = async (fileName: string) => {
    try {
      await ElMessageBox.confirm(`确定要删除测试用例 ${fileName} 吗？`, '提示', { type: 'warning' })

      const res = await FileControllerService.deleteJudgeCase(fileName, form.value.problemId)

      if (res.code === 200) {
        ElMessage.success('删除成功')
        judgeCaseList.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    } catch (e) {}
  }

  onBeforeMount(() => {
    loadData()
    uploadjudgeCaseUrl.value = import.meta.env.VITE_APP_JUDGECASE_UPLOAD_PATH
  })
</script>

<style scoped>
  .panel-body {
    padding: 15px;
  }
</style>
