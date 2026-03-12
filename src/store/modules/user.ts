import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { UserControllerService, UserLoginVO, UserVO } from '@/openapi/user'
import { useMenuStore } from '@/store/modules/menu'
import { resetRouterState } from '@/router/guards/beforeEach'
import router from '@/router'
import { StorageConfig } from '@utils/storage/storage-config'
import { LanguageEnum } from '@/enums/appEnum'
import { setPageTitle } from '@utils/router'

export const useUserStore = defineStore(
  'userStore',
  () => {
    // 语言设置
    const language = ref(LanguageEnum.ZH)
    // 登录状态
    const isLogin = ref(false)
    // 用户信息
    const userInfo = ref<Partial<UserVO>>({})
    // 访问令牌
    const accessToken = ref('')

    // 计算属性：获取用户信息
    const getUserInfo = computed(() => userInfo.value)

    /**
     * 设置登录状态
     * @param status 登录状态
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status
    }

    /**
     * 设置语言
     * @param lang 语言枚举值
     */
    const setLanguage = (lang: LanguageEnum) => {
      setPageTitle(router.currentRoute.value)
      language.value = lang
    }

    /**
     * 设置访问令牌
     * @param token token
     */
    const setAccessToken = (token: string) => {
      accessToken.value = token
    }

    /**
     * 退出登录
     * 清空所有用户相关状态并跳转到登录页
     * 如果是同一账号重新登录，保留工作台标签页
     */
    const logOut = () => {
      // 保存当前用户 ID，用于下次登录时判断是否为同一用户
      const currentUserId = userInfo.value.userAccount
      if (currentUserId) {
        localStorage.setItem(StorageConfig.LAST_USER_ID_KEY, String(currentUserId))
      }

      // 清空用户核心状态
      userInfo.value = {}
      isLogin.value = false
      accessToken.value = ''

      // 移除iframe路由缓存
      sessionStorage.removeItem('iframeRoutes')
      // 清空主页路径
      useMenuStore().setHomePath('')
      // 重置路由状态
      resetRouterState(500)
      // 跳转到登录页，携带当前路由作为 redirect 参数
      const currentRoute = router.currentRoute.value
      const redirect = currentRoute.path !== '/login' ? currentRoute.fullPath : undefined
      router.push({
        name: 'Login',
        query: redirect ? { redirect } : undefined
      })
    }

    return {
      language,
      accessToken,
      isLogin,
      userInfo,
      setLoginStatus,
      setLanguage,
      logOut,
      getUserInfo,
      setAccessToken
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
)
//   state: () => {
//     return {
//       userRole: ["not_login"],
//     };
//   },
//   persist: {
//     afterRestore: (ctx) => {
//       const userStore = useUserStore();
//       userStore.checkJWT(userStore.userInfo.jwt);
//     },
//   },
//   getters: {},
//   actions: {
//     // 清除过期信息
//     clearUserInfo() {
//       (this.userInfo.jwt = ""),
//         (this.userInfo.userAccount = null),
//         (this.userInfo.userName = ""),
//         (this.userInfo.userProfile = ""),
//         (this.userInfo.school = ""),
//         (this.userInfo.course = ""),
//         (this.userInfo.number = ""),
//         (this.userInfo.gender = ""),
//         (this.userInfo.github = ""),
//         (this.userInfo.blog = ""),
//         (this.userInfo.avatar = ""),
//         (this.userInfo.signature = ""),
//         (this.userInfo.titleName = ""),
//         (this.userInfo.titleColor = ""),
//         (this.userInfo.createTime = ""),
//         (this.userRole = ["not_login"]);
//     },
//     async checkJWT(JWT: string) {
//       const res = await UserControllerService.checkJwt(JWT);
//       if (res && res.code === 200) {
//         if (res.data === true) {
//           localStorage.removeItem("user");
//           this.clearUserInfo();
//           return true;
//         }else return false;
//       } else {
//         ElMessage.error("系统错误");
//       }
//     },
//     async getLoginUser() {
//       const res = await UserControllerService.getLoginUser();
//       if (res && res.code === 200) {
//         this.userInfo = res.data as any;
//       }
//     },
//     async getUserRole() {
//       const res = await UserControllerService.getRole(
//         this.userInfo.userAccount as any
//       );
//       if (res && res.code === 200) {
//         console.log("res不为空" + res.data);
//         this.userRole = res.data as any;
//       } else {
//         ElMessage.error("获取用户角色失败");
//       }
//     },
//   },
// });
