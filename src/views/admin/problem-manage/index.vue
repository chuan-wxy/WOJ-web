<template>
  <div>
    <div>
      <div class="max-w-250 mx-auto my-5">
        <ElRow :gutter="2">
          <ElCol :span="9">
            <ElInput
              v-model.trim="form.title"
              placeholder="请输入题目标题（最多255个字符）"
              maxlength="255"
            />
          </ElCol>
          <ElCol :span="6">
            <ElInputTag v-model="form.tagList" placeholder="题目标签" />
          </ElCol>
          <ElCol :span="4">
            <ElInput v-model="form.problemId" placeholder="自定义id" />
          </ElCol>
          <ElCol :span="5">
            <ElSelect v-model="form.difficulty" placeholder="请选择题目难度">
              <ElOption label="简单" :value="0" />
              <ElOption label="中等" :value="1" />
              <ElOption label="困难" :value="2" />
            </ElSelect>
          </ElCol>
        </ElRow>

        <!-- 富文本编辑器 -->
        <WangEditor class="mt-2.5" v-model="form.description" />

        <div class="p-5 mt-5 woj-card-xs">
          <h2 class="mb-5 text-xl font-medium">发布设置</h2>
          <!-- 图片上传 -->
          <ElRow>
            <ElCol :span="12">
              <ElForm>
                <ElFormItem label="封面">
                  <div class="mt-2.5">
                    <!--                    <el-upload class="upload-demo" :data="fileData">-->
                    <!--                      <i class="el-icon-upload"></i>-->
                    <!--                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
                    <!--                    </el-upload>-->
                    <ElUpload
                      drag
                      multiple
                      accept=".txt"
                      :action="uploadjudgeCaseUrl"
                      :headers="uploadHeaders"
                      :on-success="onSuccess"
                      :on-error="onError"
                      :before-upload="beforeUpload"
                      class="judge-case-upload"
                    >
                      <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
                      <div class="el-upload__text">
                        将测试用例 (.txt) 拖到此处，或 <em>点击上传</em>
                      </div>

                      <template #tip>
                        <div class="el-upload__tip text-g-700 mt-2">
                          请上传 .txt 格式的输入/输出文件，支持批量拖拽
                        </div>
                      </template>
                    </ElUpload>
                  </div>
                </ElFormItem>
                <ElFormItem label="可见">
                  <ElSwitch v-model="visible" />
                </ElFormItem>
              </ElForm>
            </ElCol>
            <ElCol :span="12">
              <ElSpace direction="vertical" :size="31" fill class="w-full">
                <ElInput v-model="form.timeLimit" placeholder="时间限制" />
                <ElInput v-model="form.memoryLimit" placeholder="内存限制" />
                <ElInput v-model="form.problemId" placeholder="自定义id" />
              </ElSpace>
            </ElCol>
          </ElRow>

          <div class="flex justify-end">
            <ElButton type="primary" @click="addQuestion" class="w-25">
              {{ pageMode === PageModeEnum.Edit ? '保存' : '发布' }}
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ProblemControllerService } from '@api/web'
  import { useUserStore } from '@/store/modules/user'
  import { ProblemVO } from '@api/web'
  import { ProblemAddDTO } from '@api/web'
  import { PageModeEnum } from '@/enums/formEnum'
  import EmojiText from '@utils/ui/emojo'
  import { UploadFilled } from '@element-plus/icons-vue'
  import { loadingService } from '@utils/ui'

  interface UploadResponse {
    data: {
      url: string
    }
  }

  const pageMode = ref<PageModeEnum>(PageModeEnum.Add)
  const visible = ref(true)

  const MAX_SIZE = 3 // MB

  const route = useRoute()
  const userStore = useUserStore()
  const { accessToken } = userStore

  const uploadjudgeCaseUrl = ref('')
  const uploadHeaders = { Authorization: accessToken }

  const isUpdate = ref(false)
  const jwt = ref('')
  const fileData = ref({
    pid: 'deafualt'
  })

  const form = ref<ProblemAddDTO>({
    problemId: '',
    title: '',
    author: '',
    description: '',
    tagList: [],
    timeLimit: 0,
    memoryLimit: 0,
    stackLimit: 0,
    input: '',
    output: '',
    source: '',
    difficulty: 0,
    auth: 0,
    judgeMode: 'default',
    spjCode: '',
    spjLanguage: ''
  })

  const loadJwt = () => {
    const tokenStr = localStorage.getItem('user')
    if (tokenStr) {
      try {
        const tokenObj = JSON.parse(tokenStr)
        jwt.value = tokenObj.userInfo.jwt
      } catch (error) {
        console.error('Failed to parse token from localStorage:', error)
      }
    }
  }

  const loadData = async () => {
    const id = route.query.id
    try {
      loadingService.showLoading()
      if (id) {
        // 编辑
        pageMode.value = PageModeEnum.Edit
        ElMessage.success('编辑')
        const res = await ProblemControllerService.getProblem(Number(id))
        if (res.code === 200 && res.data !== undefined) {
          form.value = res.data as ProblemVO
        } else {
          ElMessage.error('加载失败：' + res.message)
        }
      } else {
        // 新增
        ElMessage.success('新增')

        return
      }
    } catch (error) {
      console.error(error)
    } finally {
      loadingService.hideLoading()
    }
  }

  const addQuestion = async () => {
    form.value.author = userStore.userInfo.name
    const result = await ProblemControllerService.addProblem(form.value)
    if (result.code === 200) {
      ElMessage.success('添加成功')
    } else if (result.code === 201) {
      ElMessageBox.confirm('没有该标签，是否创建？', 'Warning', {
        confirmButtonText: '添加',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Array.isArray(form.value.tagList)) {
            for (const s of form.value.tagList) {
              ProblemControllerService.addTag(s)
            }
          }
          ElMessage({
            type: 'success',
            message: '添加成功'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消添加'
          })
        })
    } else {
      ElMessage.error('添加失败：' + result.message)
    }
  }
  const updateQuestion = async () => {
    const result = await ProblemControllerService.updateProblem(form.value)
    if (result.code === 200) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error('修改失败：' + result.message)
    }
  }

  /**
   * 上传成功回调
   */
  const onSuccess = (response: UploadResponse) => {
    ElMessage.success(`上传成功 ${EmojiText[200]}`)
  }

  /**
   * 上传失败回调
   */
  const onError = () => {
    ElMessage.error(`上传失败 ${EmojiText[500]}`)
  }

  /**
   * 上传前的文件校验
   */
  const beforeUpload = (file: File): boolean => {
    const isTxt = file.type.startsWith('text/plain')
    const isLt3M = file.size / 1024 / 1024 < MAX_SIZE

    if (!isTxt) {
      ElMessage.error('只能上传文本文件')
      return false
    }

    if (!isLt3M) {
      ElMessage.error(`文件大小不能超过 ${MAX_SIZE}MB`)
      return false
    }

    return true
  }

  const onContentMdchange = (v: string) => {
    form.value.description = v
  }

  onBeforeMount(() => {
    loadData()
    loadJwt()
    fileData.value.pid = form.value.problemId as string
    uploadjudgeCaseUrl.value = import.meta.env.VITE_APP_JUDGECASE_UPLOAD_PATH
  })
</script>

<style scoped>
  .panel-body {
    padding: 15px;
  }
</style>
