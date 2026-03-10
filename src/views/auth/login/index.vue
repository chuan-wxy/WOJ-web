<template>
  <div class="body">
    <div class="container" id="container">
      <div class="form-container sign-up-container">
        <div class="form">
          <h1>Create Account</h1>
          <div class="social-container">
            <a href="#" class="social">
              <i class="fab fa-alipay" />
            </a>
            <a href="#" class="social">
              <i class="fab fa-qq" />
            </a>
            <a href="#" class="social">
              <i class="fab fa-weixin" />
            </a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="请输入邮箱" v-model="registerData.userAccount" />
          <div class="email">
            <input
              type="text"
              placeholder="验证码"
              class="emailcode"
              v-model="registerData.captcha"
            />
            <button ref="getRegisterCodeButton" @click="getRegisterCode()">
              {{ BUttonText }}
            </button>
          </div>
          <input type="password" placeholder="请输入密码" v-model="registerData.userPassword" />
          <input type="password" placeholder="请确认密码" v-model="registerData.rePassword" />
          <ElButton type="primary" v-ripple class="w-full custom-height" @click="regist">{{
            $t('register.btnText')
          }}</ElButton>
        </div>
      </div>
      <div class="form-container sign-in-container">
        <div class="form">
          <h1>Sign in</h1>
          <div class="social-container">
            <a href="#" class="social">
              <i class="fab fa-alipay" />
            </a>
            <a href="#" class="social">
              <i class="fab fa-qq" />
            </a>
            <a href="#" class="social">
              <i class="fab fa-weixin" />
            </a>
          </div>
          <span>or use your account</span>
          <ElForm class="custom-height">
            <ElFormItem prop="account">
              <ElInput
                :placeholder="$t('login.placeholder.account')"
                v-model.trim="loginData.userAccount"
              />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                class="custom-height"
                :placeholder="$t('login.placeholder.password')"
                v-model.trim="loginData.userPassword"
              />
            </ElFormItem>
          </ElForm>
          <RouterLink class="text-theme" :to="{ name: 'ForgetPassword' }">{{
            $t('login.forgotPwd')
          }}</RouterLink>
          <ElButton type="primary" v-ripple class="w-full custom-height" @click="login">{{
            $t('login.btnText')
          }}</ElButton>
        </div>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p> To keep connected with us please login with your personal info </p>
            <button class="ghost" id="signIn"> 登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录 </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost" id="signUp"> 注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册 </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { UserControllerService, UserLoginDTO, UserRegisterDTO } from '@api/user'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { useMenuStore } from '@/store/modules/menu'

  const router = useRouter()
  const userStore = useUserStore()
  const BUttonText = ref('发送验证码')
  const second = ref(60)
  const getRegisterCodeButton = ref(null)
  const timeId = ref(null)

  const getRegisterCode = async () => {
    const res = await UserControllerService.getRegisterCode(registerData.userAccount as string)
    if (res.code !== 0) {
      ElMessage.error(res.message)
    }
    getRegisterCodeButton.value.disabled = true
    timeId.value = setInterval(() => {
      BUttonText.value = second.value--
      if (second.value < 0) {
        second.value = 60
        if (timeId.value !== null && timeId.value !== '') {
          clearInterval(timeId.value)
        }
        BUttonText.value = '发送验证码'
        getRegisterCodeButton.value.disabled = false
      }
    }, 1000)
  }

  const registerData = reactive({
    userAccount: '',
    userPassword: '',
    rePassword: '',
    captcha: ''
  } as UserRegisterDTO)

  const regist = async () => {
    const result = await UserControllerService.register(registerData)
    if (result.code === 0) {
      ElMessage.success('注册成功')
      router.push('/')
    } else {
      ElMessage.error(result.message)
    }
  }

  const loginData = reactive<UserLoginDTO>({
    userAccount: '',
    userPassword: ''
  })

  const login = async () => {
    const result = await UserControllerService.login(loginData)

    if (result.code === 0 && result.data != null) {
      const accessToken = result.data.jwt

      // 验证token
      if (!accessToken) {
        throw new Error('登陆失败：token检验失败')
      }

      ElMessage.success('登陆成功')

      userStore.userInfo = result.data.userInfo!
      userStore.setLoginStatus(true)
      userStore.setAccessToken(accessToken)

      const menuList = storeToRefs(useMenuStore())

      router.push({
        name: 'Home',
        replace: true
      })
    } else {
      ElMessage.error(result.message)
    }
  }
  onMounted(() => {
    const signUpButton = document.getElementById('signUp')
    const signInButton = document.getElementById('signIn')
    const container = document.getElementById('container')

    // 检查元素是否存在，避免运行时错误
    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active')
      })

      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active')
      })
    } else {
      console.error('DOM not found.')
    }
  })
</script>

<style scoped>
  @import './style.css';
</style>
