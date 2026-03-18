import axios from 'axios'
import { StorageKeyManager } from '@utils/storage'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from '@utils/http/status'

// 创建存储键管理器实例
const storageKeyManager = new StorageKeyManager()
const userStore = useUserStore()

axios.interceptors.request.use(
  function (config) {
    const { accessToken } = useUserStore()
    if (accessToken) config.headers.set('Authorization', accessToken)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    const { data } = response

    if (data?.code === ApiStatus.unauthorized) {
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
