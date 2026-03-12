import { ElLoading } from 'element-plus'
import { loadingSvg } from '@/assets/svg/loading'

interface LoadingInstance {
  close: () => void
}

let loadingInstance: LoadingInstance | null = null

/**
 * 获取当前主题对应的loading背景色
 * @returns 背景色字符串
 */
const getLoadingBackground = (): string => {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? 'rgba(7, 7, 7, 0.85)' : '#fff'
}

const getLoadingTextColor = (): string => {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? '#9a9a9a' : '#333'
}

const DEFAULT_LOADING_CONFIG = {
  // 锁定屏幕，防止用户在加载过程中进行其他操作
  lock: true,
  fullscreen: true,
  customClass: 'woj-loading-fix',
  get background() {
    return getLoadingBackground()
  },
  get svg() {
    return loadingSvg(getLoadingTextColor())
  }
} as const

export const loadingService = {
  // 显示loading
  showLoading(): () => void {
    if (!loadingInstance) {
      // 每次显示时获取最新的配置，确保背景色与当前主题同步
      const config = {
        ...DEFAULT_LOADING_CONFIG
      }
      loadingInstance = ElLoading.service(config)
    }
    return () => this.hideLoading()
  },

  /**
   * 隐藏 loading
   */
  hideLoading(): void {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}
