import axios from 'axios'
import router from '../router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { StorageKeyManager } from '@utils/storage'
import { useUserStore } from '@/store/modules/user'

// 创建存储键管理器实例
const storageKeyManager = new StorageKeyManager()
const userStore = useUserStore()

axios.interceptors.request.use(
  function (config) {
    const tokenStr = localStorage.getItem(storageKeyManager.getStorageKey('user'))

    if (tokenStr) {
      try {
        const tokenObj = JSON.parse(tokenStr)
        const jwt = tokenObj.accessToken

        if (jwt) {
          config.headers['Authorization'] = jwt
        }
      } catch (error) {
        console.error('Failed to parse token from localStorage:', error)
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data?.code === 401) {
      // 清理用户token
      localStorage.removeItem(storageKeyManager.getStorageKey('user'))
      userStore.logOut()
      return Promise.reject(new Error('登录信息已失效，请重新登录'))
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axios
